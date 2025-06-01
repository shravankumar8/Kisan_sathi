import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import BottomNav from './BottomNav';

const Schemes = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const schemes = [
    {
      title: 'PM-KISAN Samman Nidhi',
      description: 'Direct income support of ₹6,000 per year to farmer families',
      crops: ['All Crops'],
      eligibility: 'Small & marginal farmers',
    },
    {
      title: 'Pradhan Mantri Fasal Bima Yojana',
      description: 'Crop insurance scheme to protect farmers from crop losses',
      crops: ['Wheat', 'Rice', 'Cotton'],
      eligibility: 'All farmers',
    },
    {
      title: 'Kisan Credit Card',
      description: 'Credit facility for farmers to meet farming expenses',
      crops: ['All Crops'],
      eligibility: 'Land-owning farmers',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-farm-green text-white p-4">
        <div className="flex items-center gap-3 mb-4">
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
            {t('schemes')}
          </h1>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search schemes..."
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/70"
          />
        </div>
      </div>

      <div className="p-4 space-y-4 pb-24">
        {/* Recommended Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            ⭐ Recommended for You
          </h2>
          <Card className="shadow-lg border-l-4 border-harvest-yellow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-farm-green">
                {schemes[0].title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-3">{schemes[0].description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {schemes[0].crops.map((crop, index) => (
                  <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {crop}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="bg-farm-green hover:bg-farm-green/90">
                  Learn More
                </Button>
                <Button variant="outline" size="sm">
                  Share via SMS
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All Schemes */}
        <div>
          <h2 className="text-lg font-semibold mb-3">All Schemes</h2>
          <div className="space-y-4">
            {schemes.map((scheme, index) => (
              <Card key={index} className="shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    🌾 {scheme.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-3">{scheme.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs text-gray-600">Applicable crops:</span>
                      {scheme.crops.map((crop, cropIndex) => (
                        <span key={cropIndex} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {crop}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Eligibility:</span> {scheme.eligibility}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      Learn More
                    </Button>
                    <Button size="sm" variant="outline">
                      📱 Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Schemes;
