# Backend: KisanSaathi API

This directory contains the backend for KisanSaathi, a Node.js/Express server that powers the AI-driven farming assistant. It handles REST API requests, Twilio webhooks for WhatsApp and IVR, integrates with Lyzr.ai for AI responses, and uses ElevenLabs for text-to-speech.

## Directory Structure
- `config/`: Environment and configuration files (e.g., `.env`).  
- `middleware/`: Middleware for authentication, logging, etc.  
- `models/`: MongoDB schemas for users, queries, etc.  
- `routes/`: API endpoints (e.g., `whatsbot.js`, `voicebot.js`).  
- `services/`: Business logic for integrations (e.g., Twilio, Lyzr.ai).  
- `server.js`: Main Express server file.

## Setup Instructions
1. Navigate to the Backend folder:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your credentials (e.g., Twilio, AWS, MongoDB):
   ```bash
   cp .env.example .env
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. The server will run on `http://localhost:3000`.

## Key Endpoints
- **`/api/whatsapp/webhook`**: Handles incoming WhatsApp messages via Twilio.  
- **`/api/voice/incoming`**: Manages incoming voice calls for IVR.  
- **`/api/voice/test-call`**: Initiates a test voice call.

## Tech Stack
- **Node.js + Express**: Backend framework for API and webhook handling.  
- **MongoDB Atlas**: Database for storing user data and query history.  
- **Twilio**: WhatsApp messaging and IVR for voice calls.  
- **Lyzr.ai**: AI inference with RAG for farming advice.  
- **ElevenLabs**: Text-to-Speech for voice responses.  
- **AWS S3**: Stores audio recordings and TTS files.

## Environment Variables
See `.env.example` for required variables:
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`: Twilio credentials.  
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`: AWS credentials for S3.  
- `ELEVENLABS_API_KEY`: ElevenLabs API key for TTS.  
- `MONGO_URI`: MongoDB connection string.

## Contributing
Contributions are welcome! Please create a pull request with your changes, ensuring tests pass and documentation is updated.