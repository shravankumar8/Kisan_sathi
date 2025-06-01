
import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

const LanguageSelector = () => {
  const { currentLanguage, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="text-white hover:bg-white/20 touch-target"
        aria-label="Select Language"
      >
        <Globe className="w-5 h-5 mr-2" />
        {currentLanguage.code.toUpperCase()}
      </Button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <Card className="absolute top-full right-0 mt-2 w-48 z-50 shadow-lg">
            <CardContent className="p-2">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => {
                    setLanguage(language);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition-colors touch-target ${
                    currentLanguage.code === language.code ? 'bg-farm-green text-white' : ''
                  }`}
                >
                  <div className="font-medium">{language.nativeName}</div>
                  <div className="text-sm text-gray-500">{language.name}</div>
                </button>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;
