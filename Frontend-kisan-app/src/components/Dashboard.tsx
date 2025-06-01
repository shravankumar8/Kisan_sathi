import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { Mic, Sun, Cloud, Droplet, Zap, TrendingUp, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import BottomNav from "./BottomNav";
import LanguageSelector from "./LanguageSelector";
import axios  from "axios";
import { toast } from "react-toastify";

// Ensure ToastContainer is included in App.tsx or a parent component
// e.g., <ToastContainer position="top-right" autoClose={3000} />

interface WeatherData {
  temperature: number;
  condition: string;
  forecast: Array<{
    day: string;
    temp: string;
    icon: string;
  }>;
}

interface MarketPrice {
  crop: string;
  price: string;
  icon: string;
  change: string;
}

interface Query {
  question: string;
  answer: string;
}

const API_BASE_URL =
  import.meta.env.REACT_APP_API_URL || "http://localhost:3000";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { t, currentLanguage } = useLanguage();
  const { user, isAuthenticated, isAuthLoading } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  // const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [recentQuery, setRecentQuery] = useState<Query | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showForecast, setShowForecast] = useState<boolean>(false);

   const marketPrices = [
     { crop: "Wheat", price: "₹2,150", icon: "🌾", change: "+2.5%" },
     { crop: "Rice", price: "₹3,200", icon: "🍚", change: "+1.2%" },
     { crop: "Maize", price: "₹1,800", icon: "🌽", change: "-0.8%" },
     { crop: "Cotton", price: "₹5,500", icon: "☁️", change: "+3.1%" },
   ];
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchWithRetry = async <T,>(
    url: string,
    options: any,
    retries = 3,
    delay = 1000
  ): Promise<T> => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await axios.get<T>(url, options);
        return response.data;
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    throw new Error("Max retries reached");
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error(
            t("authTokenMissing") || "Authentication token missing"
          );
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        // Fetch weather data
        const weather = await fetchWithRetry<WeatherData>(
          `${API_BASE_URL}/api/weather`,
          { headers }
        );
        setWeatherData(weather);

        // Fetch market prices
        const prices = await fetchWithRetry<MarketPrice[]>(
          `${API_BASE_URL}/api/prices`,
          { headers, params: { region: user.state || "Punjab" } }
        );
        // setMarketPrices(prices);

        // Fetch recent query
        const query = await fetchWithRetry<Query>(
          `${API_BASE_URL}/api/queries/recent`,
          { headers }
        );
        setRecentQuery(query);
      } catch (error) {

        const errorMessage =
          error ||
          t("fetchFailed") ||
          "Failed to fetch data";
        toast.error(errorMessage);
        console.error("API error:", errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (!isAuthLoading) {
      fetchData();
    }
  }, [user, isAuthLoading, t]);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      navigate("/register");
    }
  }, [isAuthLoading, isAuthenticated, navigate]);

const quickTips = [
  {
    icon: "🌦️",
    title: t("Monitor Weather Regularly"),
    description: t(
      "Check the weather before sowing, spraying, or harvesting to avoid losses."
    ),
  },
  {
    icon: "🌿",
    title: t("Use Organic Fertilizers Wisely"),
    description: t(
      "Combine compost and green manure with balanced chemical inputs for better soil health."
    ),
  },
  {
    icon: "🐛",
    title: t("Watch for Early Signs of Pests"),
    description: t(
      "Regularly inspect crops and report issues early to control spread with minimal chemicals."
    ),
  },
  {
    icon: "💧",
    title: t("Practice Water-Smart Farming"),
    description: t(
      "Use drip irrigation and water in cooler hours to conserve resources."
    ),
  },
];


  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const tipTimer = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % quickTips.length);
    }, 5000);
    return () => clearInterval(tipTimer);
  }, [quickTips]);

  if (isAuthLoading) {
    return (
      <div className="text-center p-4">{t("loading") || "Loading..."}</div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const normalizeDay = (day: string): string => {
    const dayMap: { [key: string]: string } = {
      Today: "today",
      Tomorrow: "tomorrow",
      Mon: "mon",
      Tue: "tue",
      Wed: "wed",
      Thu: "thu",
      Fri: "fri",
      Sat: "sat",
      Sun: "sun",
    };
    return dayMap[day] || day.toLowerCase();
  };

  const getWeatherIcon = (condition: string) => {
    // Assumes backend returns lowercase conditions: 'sunny', 'cloudy', 'rainy', 'stormy'
    switch (condition.toLowerCase()) {
      case "clear":
        return <Sun className="w-8 h-8 text-yellow-500" />;
      case "cloudy":
        return <Cloud className="w-8 h-8 text-gray-500" />;
      case "rainy":
        return <Droplet className="w-8 h-8 text-blue-600" />;
      case "stormy":
        return <Zap className="w-8 h-8 text-blue-800" />;
      default:
        return <Cloud className="w-8 h-8 text-gray-500" />;
    }
  };

  const getForecastIcon = (icon: string) => {
    return icon === "sun" ? (
      <Sun className="w-4 h-4 mx-auto mt-1 text-yellow-500" />
    ) : (
      <Cloud className="w-4 h-4 mx-auto mt-1 text-gray-500" />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-farm-green text-white p-4 pb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-bold outdoor-contrast">
              {t("namaste")}, {user.name}!
            </h1>
            <p className="text-green-100 text-sm">
              {currentTime.toLocaleDateString()} •{" "}
              {currentTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <LanguageSelector />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 -mt-4 pb-20">
        {isLoading ? (
          <div className="text-center p-4">{t("loading") || "Loading..."}</div>
        ) : (
          <>
            {/* Weather Card */}
            <Card className="mb-4 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sun className="w-6 h-6 text-yellow-500" />
                  {t("weather") || "Weather"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {weatherData ? (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl font-bold">
                          {weatherData.temperature}°C
                        </div>
                        {getWeatherIcon(weatherData.condition)}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowForecast(!showForecast)}
                        className="text-sm"
                      >
                        {showForecast
                          ? t("hideForecast") || "Hide Forecast"
                          : t("forecast") || "Forecast"}
                      </Button>
                    </div>
                    {showForecast && (
                      <div className="flex gap-2 overflow-x-auto">
                        {weatherData.forecast.map((day, index) => (
                          <div
                            key={index}
                            className="flex-shrink-0 text-center p-2 bg-gray-50 rounded-lg min-w-[60px]"
                          >
                            <div className="text-xs text-gray-600 mb-1">
                              {t(normalizeDay(day.day)) || day.day}
                            </div>
                            <div className="text-sm font-medium">
                              {day.temp}
                            </div>
                            {getForecastIcon(day.icon)}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-red-600">
                    {t("weatherError") || "Unable to fetch weather data"}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Market Prices Card */}
            <Card className="mb-4 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  {t("marketPrices") || "Market Prices"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {marketPrices.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {marketPrices.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{item.icon}</span>
                          <div>
                            <div className="font-semibold">{item.crop}</div>
                            <div className="text-xs text-gray-500">
                              {t("perQuintal") || "per quintal"}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{item.price}</div>
                          <div
                            className={`text-sm ${
                              item.change.startsWith("+")
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {item.change}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-red-600">
                    {t("pricesError") || "Unable to fetch market prices"}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Recent Query Card */}
            <Card className="mb-4 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="w-6 h-6 text-blue-600" />
                  {t("recentQuery") || "Recent Query"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentQuery ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-700 mb-2">
                        {recentQuery.question}
                      </p>
                      <p className="text-sm text-blue-800">
                        {recentQuery.answer}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        const utterance = new SpeechSynthesisUtterance(
                          recentQuery.answer
                        );
                        utterance.lang = currentLanguage.code;
                        window.speechSynthesis.speak(utterance);
                      }}
                    >
                      🔊 {t("listenAgain") || "Listen Again"}
                    </Button>
                  </div>
                ) : (
                  <p className="text-gray-600">
                    {t("no Queries") || "No recent queries"}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Tips Carousel */}

            <Card className="mb-4 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                  💡 {t("Quick Tips for Farmers")}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="p-6 bg-harvest-yellow/20 rounded-xl text-center space-y-4">
                  <div className="text-3xl">{quickTips[currentTip].icon}</div>
                  <h3 className="text-lg font-bold text-farm-green">
                    {quickTips[currentTip].title}
                  </h3>
                  <p className="text-base text-gray-700">
                    {quickTips[currentTip].description}
                  </p>

                  <div className="flex justify-center gap-2 mt-4">
                    {quickTips.map((_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                          index === currentTip ? "bg-farm-green" : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Floating Action Button */}
      <Button
        onClick={() => navigate("/query")}
        className="fixed bottom-20 right-4 w-16 h-16 rounded-full bg-farm-green hover:bg-farm-green/90 shadow-2xl z-50 touch-target"
        size="icon"
      >
        <Mic className="w-8 h-8 text-white" />
      </Button>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Dashboard;
