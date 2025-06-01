import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Mic } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import LanguageSelector from './LanguageSelector';

const Login = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { login, sendOTP } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTP = async () => {
    if (!phoneNumber) {
      alert('Please enter phone number');
      return;
    }

    setIsLoading(true);
    const success = await sendOTP(phoneNumber);
    setIsLoading(false);

    if (success) {
      setIsOtpSent(true);
      setCountdown(30);
    } else {
      alert('Failed to send OTP. Please try again.');
    }
  };

  const handleVoiceOTP = () => {
    setIsListening(true);
    // Simulate voice recognition for OTP
    setTimeout(() => {
      setOtp('1234');
      setIsListening(false);
    }, 2000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      alert('Please enter OTP');
      return;
    }

    setIsLoading(true);
    const success = await login(phoneNumber, otp);
    setIsLoading(false);

    if (success) {
      navigate('/');
    } else {
      alert('Invalid OTP. Please try again.');
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
            {t('login')}
          </CardTitle>
          <p className="text-gray-600 text-sm">
            Enter your phone number to continue
          </p>
          <div className="flex justify-center mt-3">
            <LanguageSelector />
          </div>
        </CardHeader>
        
        <CardContent>
          {!isOtpSent ? (
            <div className="space-y-6">
              {/* Progress Indicator */}
              <div className="flex justify-center mb-6">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-farm-green rounded-full"></div>
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                </div>
                <span className="ml-3 text-sm text-gray-600">Step 1 of 2</span>
              </div>

              {/* Phone Number Field */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-lg font-medium">
                  {t('phoneNumber')}
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="text-lg py-6 touch-target"
                  required
                />
              </div>

              {/* Send OTP Button */}
              <Button
                onClick={handleSendOTP}
                className="w-full bg-farm-green hover:bg-farm-green/90 text-white text-lg py-6 touch-target"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : t('sendOTP')}
              </Button>

              {/* Register Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="text-farm-green font-medium hover:underline"
                  >
                    {t('register')}
                  </button>
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Progress Indicator */}
              <div className="flex justify-center mb-6">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-farm-green rounded-full"></div>
                  <div className="w-3 h-3 bg-farm-green rounded-full"></div>
                </div>
                <span className="ml-3 text-sm text-gray-600">Step 2 of 2</span>
              </div>

              <div className="text-center mb-6">
                <p className="text-sm text-gray-600">
                  OTP sent to {phoneNumber}
                </p>
              </div>

              {/* OTP Field */}
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-lg font-medium">
                  {t('enterOTP')}
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="1234"
                    maxLength={4}
                    className="text-lg py-6 touch-target text-center tracking-widest"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleVoiceOTP}
                    className={`touch-target shrink-0 ${isListening ? 'voice-recording bg-red-100' : ''}`}
                    disabled={isListening}
                    aria-label="Voice input for OTP"
                  >
                    <Mic className={`w-5 h-5 ${isListening ? 'text-red-600' : 'text-farm-green'}`} />
                  </Button>
                </div>
                {isListening && (
                  <p className="text-sm text-blue-600 flex items-center gap-2">
                    🎤 Speak your OTP...
                  </p>
                )}
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full bg-farm-green hover:bg-farm-green/90 text-white text-lg py-6 touch-target"
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : t('signIn')}
              </Button>

              {/* Resend OTP */}
              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-sm text-gray-600">
                    Resend OTP in {countdown}s
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    className="text-sm text-farm-green font-medium hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
