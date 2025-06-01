const express = require("express");
const axios = require("axios");
const VoiceResponse = require("twilio").twiml.VoiceResponse;
const AWS = require("aws-sdk");
require("dotenv").config();

const router = express.Router();

// Configure AWS for Transcribe and Polly
AWS.config.update({
  region: "us-east-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const transcribeService = new AWS.TranscribeService();
const polly = new AWS.Polly();
const s3 = new AWS.S3();

// Webhook to handle incoming calls
router.post("/incoming", (req, res) => {
  const twiml = new VoiceResponse();

  // Welcome message and language selection
  const gather = twiml.gather({
    numDigits: 1,
    action: "/api/voice/language",
    method: "POST",
  });
  gather.say("Welcome to Farm Assistant. Press 1 for English, 2 for Hindi.");

  res.type("text/xml");
  res.send(twiml.toString());
});

// Handle language selection
router.post("/language", (req, res) => {
  const twiml = new VoiceResponse();
  const digit = req.body.Digits;
  const language = digit === "1" ? "en-US" : "hi-IN"; // English or Hindi

  // Store language in the session (using Twilio's CallSid as a key in a real app)
  twiml.say("Please speak your farming question after the beep.");
  twiml.record({
    action: "/api/voice/process",
    method: "POST",
    timeout: 5,
    transcribe: false, // We'll use AWS Transcribe instead of Twilio's
    recordingStatusCallback: "/api/voice/recording",
    recordingStatusCallbackMethod: "POST",
  });

  // Add language as a query parameter for the next step
  twiml.redirect(`/api/voice/language?language=${language}`);

  res.type("text/xml");
  res.send(twiml.toString());
});

// Handle the recording callback
router.post("/recording", async (req, res) => {
  const twiml = new VoiceResponse();
  const recordingUrl = req.body.RecordingUrl;
  const callSid = req.body.CallSid;
  const language = req.query.language || "en-US";

  try {
    // Download the recording from Twilio
    const recordingResponse = await axios.get(recordingUrl, {
      responseType: "arraybuffer",
    });
    const audioBuffer = recordingResponse.data;

    // Upload the recording to S3 for AWS Transcribe
    const s3Params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `recordings/${callSid}.wav`,
      Body: audioBuffer,
      ContentType: "audio/wav",
    };
    await s3.upload(s3Params).promise();
    const s3Uri = `s3://${process.env.AWS_S3_BUCKET}/recordings/${callSid}.wav`;

    // Start transcription with AWS Transcribe
    const transcribeParams = {
      TranscriptionJobName: `transcription-${callSid}`,
      LanguageCode: language,
      Media: { MediaFileUri: s3Uri },
      OutputBucketName: process.env.AWS_S3_BUCKET,
    };
    await transcribeService.startTranscriptionJob(transcribeParams).promise();

    // Poll for transcription result
    let transcriptionJob;
    for (let i = 0; i < 10; i++) {
      const jobStatus = await transcribeService
        .getTranscriptionJob({
          TranscriptionJobName: `transcription-${callSid}`,
        })
        .promise();
      transcriptionJob = jobStatus.TranscriptionJob;
      if (transcriptionJob.TranscriptionJobStatus === "COMPLETED") break;
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
    }

    if (transcriptionJob.TranscriptionJobStatus !== "COMPLETED") {
      throw new Error("Transcription failed to complete in time");
    }

    // Get the transcription result
    const transcriptUri = transcriptionJob.Transcript.TranscriptFileUri;
    const transcriptResponse = await axios.get(transcriptUri);
    const transcriptText =
      transcriptResponse.data.results.transcripts[0]?.transcript || "";

    if (!transcriptText) {
      twiml.say(
        "Sorry, I could not understand your question. Please try again."
      );
      twiml.redirect("/api/voice/language");
      res.type("text/xml");
      return res.send(twiml.toString());
    }

    // Process the query with the inference API
    const payload = {
      user_id: callSid, // Use CallSid as user_id
      agent_id: "683b58dbcf9fc42b59e136bc",
      session_id: `${callSid}-wezaj0hdgkc`,
      message: transcriptText,
    };

    const inferenceRes = await axios.post(
      "https://agent-prod.studio.lyzr.ai/v3/inference/chat/",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "sk-default-kKtXYeA4rpMOdv1mJCpeUGvN9ck8Yg8H",
        },
      }
    );

    // Parse the inference response
    const { response } = inferenceRes.data;
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(response);
    } catch (parseErr) {
      console.error("Error parsing response:", parseErr);
      throw new Error("Failed to parse inference response");
    }

    // Normalize the structure
    const responseArray = Array.isArray(parsedResponse)
      ? parsedResponse
      : [parsedResponse];
    const [{ queries = [] } = {}] = responseArray;
    const [{ response: queryResponse } = {}] =
      queries.length > 0 ? queries : [{}];

    const reply =
      queryResponse ||
      "Sorry, I couldn’t find the information you’re looking for.";

    // Convert the response to speech using AWS Polly
    const pollyParams = {
      OutputFormat: "mp3",
      Text: reply,
      VoiceId: language === "hi-IN" ? "Aditi" : "Joanna", // Hindi or English voice
    };
    const pollyResponse = await polly.synthesizeSpeech(pollyParams).promise();

    // Upload the synthesized speech to S3
    const audioKey = `audio/${callSid}.mp3`;
    const pollyS3Params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: audioKey,
      Body: pollyResponse.AudioStream,
      ContentType: "audio/mpeg",
    };
    await s3.upload(pollyS3Params).promise();
    const audioUrl = `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${audioKey}`;

    // Play the response to the caller
    twiml.play(audioUrl);
    twiml.say(
      "Would you like to ask another question? Press 1 to continue, or hang up to end."
    );
    twiml.gather({
      numDigits: 1,
      action: "/api/voice/language",
      method: "POST",
    });
  } catch (err) {
    console.error("Error processing voice query:", err);
    twiml.say(
      "Sorry, there was an error processing your query. Please try again."
    );
    twiml.redirect("/api/voice/language");
  }

  res.type("text/xml");
  res.send(twiml.toString());
});

module.exports = router;
