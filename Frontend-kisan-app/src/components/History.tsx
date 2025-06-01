
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft, Search, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import BottomNav from './BottomNav';

const History = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [expandedQuery, setExpandedQuery] = useState<number | null>(null);

  const queryHistory = [
    {
      id: 1,
      date: 'Jul 10, 2025',
      time: '08:45 AM',
      question: 'When is the best time to plant wheat after monsoon?',
      answer: 'The ideal time to plant wheat is 2-3 weeks after the monsoon ends, usually in October-November. This timing ensures optimal soil moisture while avoiding waterlogging.',
      feedback: 'positive',
      feedbackDate: 'Jul 10, 2025'
    },
    {
      id: 2,
      date: 'Jul 9, 2025',
      time: '03:20 PM',
      question: 'How to control pest attack on cotton plants?',
      answer: 'For cotton pest control, use integrated pest management. Monitor regularly, use pheromone traps, apply neem-based pesticides early morning or evening.',
      feedback: 'positive',
      feedbackDate: 'Jul 9, 2025'
    },
    {
      id: 3,
      date: 'Jul 8, 2025',
      time: '11:15 AM',
      question: 'What is the best fertilizer for rice in rainy season?',
      answer: 'During rainy season, use slow-release fertilizers like urea super granules. Apply nitrogen in split doses and ensure proper drainage to prevent nutrient loss.',
      feedback: null,
      feedbackDate: null
    },
  ];

  const toggleExpand = (queryId: number) => {
    setExpandedQuery(expandedQuery === queryId ? null : queryId);
  };

  const handleTTSPlayback = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

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
            {t('history')}
          </h1>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search past queries..."
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/70"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <Calendar className="w-4 h-4 mr-2" />
              Filter by date
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-24">
        {/* Query List */}
        <div className="space-y-3">
          {queryHistory.map((query) => (
            <Card key={query.id} className="shadow-lg">
              <CardContent className="p-4">
                <div 
                  className="cursor-pointer"
                  onClick={() => toggleExpand(query.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="text-sm text-gray-500 mb-1">
                        {query.date} | {query.time}
                      </div>
                      <p className="text-gray-800 font-medium line-clamp-2">
                        {query.question}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="shrink-0 ml-2">
                      {expandedQuery === query.id ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </div>

                {expandedQuery === query.id && (
                  <div className="mt-4 pt-4 border-t space-y-4">
                    {/* Full Question */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Question:</h4>
                      <p className="text-gray-800 bg-blue-50 p-3 rounded-lg">
                        {query.question}
                      </p>
                    </div>

                    {/* Full Answer */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium text-gray-600">Answer:</h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTTSPlayback(query.answer)}
                          className="text-farm-green"
                        >
                          🔊 Listen
                        </Button>
                      </div>
                      <p className="text-gray-800 bg-green-50 p-3 rounded-lg border-l-4 border-farm-green">
                        {query.answer}
                      </p>
                    </div>

                    {/* Feedback Status */}
                    {query.feedback && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Feedback:</span>{' '}
                        <span className={`${query.feedback === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                          {query.feedback === 'positive' ? '👍 Helpful' : '👎 Not helpful'}
                        </span>
                        {query.feedbackDate && (
                          <span className="text-gray-500"> • {query.feedbackDate}</span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="pt-4 space-y-3">
          <Button variant="outline" className="w-full" disabled>
            📄 Export History
          </Button>
          <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
            🗑️ Clear History
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default History;
