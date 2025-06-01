
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Globe, Bell, Trash2, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import BottomNav from './BottomNav';
import LanguageSelector from './LanguageSelector';

const Settings = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/register');
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      logout();
      navigate('/register');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-farm-green text-white p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/20 touch-target"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold outdoor-contrast">
            {t('settings')}
          </h1>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-24">
        {/* Profile Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              👤 Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                {t('name')}
              </Label>
              <Input
                id="name"
                type="text"
                defaultValue={user.name}
                className="mt-1 touch-target"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-sm font-medium">
                {t('phoneNumber')}
              </Label>
              <Input
                id="phone"
                type="tel"
                value={user.phoneNumber}
                className="mt-1 touch-target bg-gray-100"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">
                Phone number cannot be changed
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Preferred Language
              </Label>
              <div className="mt-2">
                <LanguageSelector />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">SMS Weather Alerts</p>
                <p className="text-sm text-gray-600">
                  Receive daily weather updates via SMS
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Weekly Crop Tips</p>
                <p className="text-sm text-gray-600">
                  Get farming tips and advice via SMS
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Market Price Alerts</p>
                <p className="text-sm text-gray-600">
                  Notify when crop prices change significantly
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Data & Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Your Data</h4>
              <p className="text-sm text-blue-800">
                We protect your farming data and queries. You can export or delete your data anytime.
              </p>
            </div>
            <Button variant="outline" className="w-full" disabled>
              📄 Export My Data
            </Button>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full touch-target flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              {t('signIn')} Out
            </Button>
            <Button
              onClick={handleDeleteAccount}
              variant="destructive"
              className="w-full touch-target flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="shadow-lg">
          <CardContent className="p-4 text-center">
            <div className="space-y-2">
              <div className="text-2xl">🌾</div>
              <h3 className="font-semibold">AI Farm Advisor</h3>
              <p className="text-sm text-gray-600">Version 1.0.0</p>
              <p className="text-xs text-gray-500">
                Smart farming guidance for Indian farmers
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Settings;
