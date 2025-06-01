
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { House, Mic, Clock, Settings } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { 
      path: '/', 
      icon: House, 
      label: t('dashboard'),
      key: 'home'
    },
    { 
      path: '/query', 
      icon: Mic, 
      label: t('askQuestion'),
      key: 'ask'
    },
    { 
      path: '/schemes', 
      icon: '🌾', // Using emoji instead of non-existent icon
      label: t('schemes'),
      key: 'schemes'
    },
    { 
      path: '/history', 
      icon: Clock, 
      label: t('history'),
      key: 'history'
    },
    { 
      path: '/settings', 
      icon: Settings, 
      label: t('settings'),
      key: 'settings'
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-40">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center py-2 px-3 touch-target transition-colors ${
                isActive 
                  ? 'text-farm-green' 
                  : 'text-gray-500 hover:text-farm-green'
              }`}
              aria-label={item.label}
            >
              {typeof item.icon === 'string' ? (
                <span className="text-2xl mb-1">{item.icon}</span>
              ) : (
                <item.icon className={`w-6 h-6 mb-1 ${isActive ? 'text-farm-green' : ''}`} />
              )}
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
