import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { ArrowLeft, Mic } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import LanguageSelector from "./LanguageSelector";
import axios from "axios";
import { toast } from "react-toastify";

// Type definitions for SpeechRecognition
interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

type SpeechRecognitionConstructor = new () => SpeechRecognition;

// Backend response type
interface RegisterResponse {
  userId: string;
  token: string;
  message: string;
}

const API_BASE_URL =
  import.meta.env.REACT_APP_API_URL || "http://localhost:3000";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { t, currentLanguage, setLanguage, languages } = useLanguage();
  const { login } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    city: "",
    state: "",
    pincode: "",
    selectedLanguage: currentLanguage.code,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceField, setVoiceField] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );

  // Initialize SpeechRecognition

  // Handle voice input
  useEffect(() => {
    if (!recognition || !isListening || !voiceField) return;

    recognition.lang = formData.selectedLanguage;
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript.trim();
      setFormData((prev) => ({ ...prev, [voiceField]: transcript }));
      setIsListening(false);
      setVoiceField(null);
    };
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      toast.error(
        t("speechError") || `Speech recognition error: ${event.error}`
      );
      setIsListening(false);
      setVoiceField(null);
    };

    try {
      recognition.start();
    } catch (err) {
      toast.error(
        t("speechStartError") || "Failed to start speech recognition."
      );
      setIsListening(false);
      setVoiceField(null);
    }

    return () => {
      recognition.stop();
    };
  }, [isListening, voiceField, recognition, formData.selectedLanguage, t]);

  const handleVoiceInput = (field: string) => {
    if (!recognition) {
      toast.warn(
        t("speechNotSupported") || "Speech recognition is not supported."
      );
      return;
    }
    setVoiceField(field);
    setIsListening(true);
  };

  const handleNextStep = () => {
    if (!formData.name.trim() || !formData.phoneNumber) {
      toast.error(t("fillAllFields") || "Please fill all fields.");
      return;
    }
    const phoneRegex = /^\+91[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      toast.error(
        t("invalidPhoneNumber") ||
          "Please enter a valid phone number (+91 followed by 10 digits)."
      );
      return;
    }
    setCurrentStep(2);
  };

  const handlePreviousStep = () => {
    setCurrentStep(1);
  };

  const handleLanguageChange = (languageCode: string) => {
    const selectedLang = languages.find((lang) => lang.code === languageCode);
    if (selectedLang) {
      setLanguage(selectedLang);
      setFormData((prev) => ({ ...prev, selectedLanguage: languageCode }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (
      !formData.name.trim() ||
      !formData.phoneNumber ||
      !formData.city ||
      !formData.state ||
      !formData.pincode
    ) {
      const errorMsg = t("fillAllFields") || "Please fill all fields.";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    const phoneRegex = /^\+91[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      const errorMsg =
        t("invalidPhoneNumber") ||
        "Please enter a valid phone number (+91 followed by 10 digits).";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    const pincodeRegex = /^[0-9]{6}$/;
    if (!pincodeRegex.test(formData.pincode)) {
      const errorMsg =
        t("invalidPincode") || "Please enter a valid 6-digit pincode.";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post<RegisterResponse>(
        `${API_BASE_URL}/api/auth/register`,
        {
          name: formData.name.trim(),
          phoneNumber: formData.phoneNumber,
          selectedLanguage: formData.selectedLanguage,
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 201) {
        const user = {
          id: response.data.userId,
          name: formData.name.trim(),
          phoneNumber: formData.phoneNumber,
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode,
          language: formData.selectedLanguage,
        };
        login(response.data.token, user);
        toast.success(t("registrationSuccess") || "Registration successful!");
        navigate("/");
      }
    } catch (error) {
      const errorMessage =
        error || t("registrationFailed") || "Registration failed.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-farm-green rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">🌾</span>
          </div>
          <CardTitle className="text-2xl font-bold text-farm-green">
            Kisan sathi
          </CardTitle>
          <p className="text-gray-600 text-sm">
            {t("welcome")} - {t("One place for all your needs ")}
          </p>
          {currentStep === 1 && (
            <div className="flex justify-center mt-3">
              <LanguageSelector />
            </div>
          )}
        </CardHeader>

        <CardContent>
          <div className="flex justify-center mb-6">
            <div className="flex space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  currentStep >= 1 ? "bg-farm-green" : "bg-gray-300"
                }`}
              ></div>
              <div
                className={`w-3 h-3 rounded-full ${
                  currentStep >= 2 ? "bg-farm-green" : "bg-gray-300"
                }`}
              ></div>
            </div>
            <span className="ml-3 text-sm text-gray-600">
              Step {currentStep} of 2
            </span>
          </div>

          {error && (
            <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
          )}

          {currentStep === 1 ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleNextStep();
              }}
              className="space-y-6"
            >
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-lg font-medium">
                  {t("name")}
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder={t("enterName") || "Enter your name"}
                    className="text-lg py-6 touch-target"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleVoiceInput("name")}
                    className={`touch-target shrink-0 ${
                      isListening && voiceField === "name"
                        ? "voice-recording bg-red-100"
                        : ""
                    }`}
                    disabled={isListening}
                    aria-label="Voice input for name"
                  >
                    <Mic
                      className={`w-5 h-5 ${
                        isListening && voiceField === "name"
                          ? "text-red-600"
                          : "text-farm-green"
                      }`}
                    />
                  </Button>
                </div>
                {isListening && voiceField === "name" && (
                  <p className="text-sm text-blue-600 flex items-center gap-2">
                    🎤 {t("sayName") || "Say your name after the beep..."}
                  </p>
                )}
              </div>

              {/* Phone Number Field */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-lg font-medium">
                  {t("phoneNumber")}
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      phoneNumber: e.target.value,
                    }))
                  }
                  placeholder="+91 98765 43210"
                  className="text-lg py-6 touch-target"
                  required
                />
              </div>

              {/* Next Button */}
              <Button
                type="submit"
                className="w-full bg-farm-green hover:bg-farm-green/90 text-white text-lg py-6 touch-target"
              >
                {t("next") || "Next"}
              </Button>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {t("haveAccount") || "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-farm-green font-medium hover:underline"
                  >
                    {t("signIn") || "Sign in"}
                  </button>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Back Button */}
              <Button
                type="button"
                variant="ghost"
                onClick={handlePreviousStep}
                className="flex items-center gap-2 p-0 h-auto text-farm-green hover:text-farm-green/80"
              >
                <ArrowLeft className="w-4 h-4" />
                {t("back") || "Back"}
              </Button>

              {/* Language Preference */}
              <div className="space-y-2">
                <Label className="text-lg font-medium">
                  {t("preferredLanguage") || "Preferred Language"}
                </Label>
                <select
                  value={formData.selectedLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md text-lg touch-target"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.nativeName} ({lang.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* City Field */}
              <div className="space-y-2">
                <Label htmlFor="city" className="text-lg font-medium">
                  {t("city") || "City"}
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="city"
                    type="text"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, city: e.target.value }))
                    }
                    placeholder={t("enterCity") || "Enter your city"}
                    className="text-lg py-6 touch-target"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleVoiceInput("city")}
                    className={`touch-target shrink-0 ${
                      isListening && voiceField === "city"
                        ? "voice-recording bg-red-100"
                        : ""
                    }`}
                    disabled={isListening}
                    aria-label="Voice input for city"
                  >
                    <Mic
                      className={`w-5 h-5 ${
                        isListening && voiceField === "city"
                          ? "text-red-600"
                          : "text-farm-green"
                      }`}
                    />
                  </Button>
                </div>
                {isListening && voiceField === "city" && (
                  <p className="text-sm text-blue-600 flex items-center gap-2">
                    🎤 {t("sayCity") || "Say your city after the beep..."}
                  </p>
                )}
              </div>

              {/* State Field */}
              <div className="space-y-2">
                <Label htmlFor="state" className="text-lg font-medium">
                  {t("state") || "State"}
                </Label>
                <Input
                  id="state"
                  type="text"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, state: e.target.value }))
                  }
                  placeholder={t("enterState") || "Enter your state"}
                  className="text-lg py-6 touch-target"
                  required
                />
              </div>

              {/* Pincode Field */}
              <div className="space-y-2">
                <Label htmlFor="pincode" className="text-lg font-medium">
                  {t("pincode") || "Pincode"}
                </Label>
                <Input
                  id="pincode"
                  type="text"
                  value={formData.pincode}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      pincode: e.target.value,
                    }))
                  }
                  placeholder={t("enterPincode") || "Enter your pincode"}
                  className="text-lg py-6 touch-target"
                  maxLength={6}
                  pattern="[0-9]{6}"
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-farm-green hover:bg-farm-green/90 text-white text-lg py-6 touch-target"
                disabled={isLoading}
              >
                {isLoading
                  ? t("creatingAccount") || "Creating Account..."
                  : t("joinNow") || "Join Now"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
