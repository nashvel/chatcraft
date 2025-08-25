import React, { useState, useEffect } from 'react';
import { QuestionMarkCircleIcon, ChevronDownIcon, InformationCircleIcon, ChartBarIcon, ArrowRightIcon, CloudIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Header = ({ onShowTutorial, onShowAboutUs }) => {
  const [showStats, setShowStats] = useState(false);
  const [currentView, setCurrentView] = useState('weekly'); // 'weekly' or 'weather'
  const [weatherData, setWeatherData] = useState(null);
  const [showWeatherModal, setShowWeatherModal] = useState(false);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    try {
      // Using enhanced Open-Meteo API with all selected variables
      const response = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=8.5&longitude=124.625&hourly=temperature_2m,relative_humidity_2m,weather_code,precipitation_probability,precipitation,cloud_cover,wind_speed_10m,apparent_temperature&timezone=Asia%2FSingapore&forecast_days=1'
      );
      
      if (response.ok) {
        const data = await response.json();
        const hourly = data.hourly;
        const currentHour = new Date().getHours();
        
        // Convert weather code to description
        const getWeatherDescription = (code) => {
          const codes = {
            0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
            45: 'Fog', 48: 'Depositing rime fog', 51: 'Light drizzle', 53: 'Moderate drizzle',
            55: 'Dense drizzle', 61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
            80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
            95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Heavy thunderstorm'
          };
          return codes[code] || 'Unknown';
        };
        
        setWeatherData({
          main: { 
            temp: Math.round(hourly.temperature_2m[currentHour]), 
            humidity: hourly.relative_humidity_2m[currentHour],
            feels_like: Math.round(hourly.apparent_temperature[currentHour])
          },
          weather: [{ 
            main: getWeatherDescription(hourly.weather_code[currentHour]), 
            description: getWeatherDescription(hourly.weather_code[currentHour]).toLowerCase() 
          }],
          name: 'Tagoloan',
          rain: { 
            probability: hourly.precipitation_probability[currentHour],
            amount: hourly.precipitation[currentHour]
          },
          wind: {
            speed: hourly.wind_speed_10m[currentHour]
          },
          clouds: {
            all: hourly.cloud_cover[currentHour]
          }
        });
      } else {
        throw new Error('API failed');
      }
    } catch (error) {
      // Fallback to wttr.in as backup
      try {
        const response = await fetch('https://wttr.in/Tagoloan?format=j1');
        if (response.ok) {
          const data = await response.json();
          const current = data.current_condition[0];
          setWeatherData({
            main: { temp: parseInt(current.temp_C), humidity: parseInt(current.humidity), feels_like: parseInt(current.FeelsLikeC) },
            weather: [{ main: current.weatherDesc[0].value, description: current.weatherDesc[0].value.toLowerCase() }],
            name: 'Tagoloan',
            rain: { probability: 0, amount: parseInt(current.precipMM) },
            wind: { speed: parseInt(current.windspeedKmph) },
            clouds: { all: parseInt(current.cloudcover) }
          });
        } else {
          throw new Error('Backup API failed');
        }
      } catch (backupError) {
        // Final fallback to mock data
        setWeatherData({
          main: { temp: 28, humidity: 75, feels_like: 32 },
          weather: [{ main: 'Partly Cloudy', description: 'partly cloudy' }],
          name: 'Tagoloan',
          rain: { probability: 20, amount: 0 },
          wind: { speed: 5 },
          clouds: { all: 60 }
        });
      }
    }
  };

  return (
    <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 sticky top-0 z-50 group">
      <div className="container mx-auto px-6 py-4 transition-all duration-500 group-hover:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 group-hover:scale-105 transition-all duration-500">
            <div className="w-8 h-8 rounded-full border-2 border-white/30 p-0.5 group-hover:border-white/50 group-hover:shadow-lg transition-all duration-500">
              <img 
                src="/icon.png" 
                alt="Timely" 
                className="w-full h-full rounded-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <h1 className="text-xl font-medium text-white group-hover:text-white/95 group-hover:tracking-wider transition-all duration-500">
              Timely
            </h1>
          </div>
          
          <div className="relative md:hidden">
            <button
              onClick={() => setShowStats(!showStats)}
              className="text-white/70 hover:text-white transition-all duration-300 p-2 rounded-full hover:bg-white/10"
              title="Weekly Stats"
            >
              <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${showStats ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={onShowTutorial}
              className="text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
              title="Tutorial"
            >
              <QuestionMarkCircleIcon className="w-5 h-5" />
            </button>
            
            <button
              onClick={onShowAboutUs}
              className="text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
              title="About Us"
            >
              <InformationCircleIcon className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setShowStats(!showStats)}
              className="text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
              title="Weekly Stats"
            >
              <ChartBarIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Collapsible Content */}
        <div className={`transition-all duration-500 overflow-hidden ${showStats ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="container mx-auto px-6 pb-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              
              {/* Header with Next Button */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  {currentView === 'weekly' ? 'Weekly Activity' : 'Weather Tracker'}
                </h3>
                <button
                  onClick={() => setCurrentView(currentView === 'weekly' ? 'weather' : 'weekly')}
                  className="flex items-center gap-1 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-1 text-white/80 hover:text-white transition-all duration-300"
                >
                  {currentView === 'weekly' ? <CloudIcon className="w-4 h-4" /> : <ChartBarIcon className="w-4 h-4" />}
                  <ArrowRightIcon className="w-3 h-3" />
                </button>
              </div>

              {currentView === 'weekly' ? (
                <>
                  {/* Weekly Activity Chart with Line Graph */}
                  <div className="relative h-32 mb-4">
                    <div className="flex items-end justify-between h-full space-x-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                        const heights = [60, 80, 45, 90, 75, 30, 20];
                        return (
                          <div key={day} className="flex flex-col items-center flex-1">
                            <div 
                              className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg w-full transition-all duration-300 hover:from-blue-400 hover:to-purple-400"
                              style={{ height: `${heights[index]}%` }}
                            ></div>
                            <div className="text-white/70 text-xs mt-2">{day}</div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Line Graph Overlay */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <polyline
                        points="7,40 21,20 35,55 49,10 63,25 77,70 91,80"
                        fill="none"
                        stroke="rgba(255,255,255,0.8)"
                        strokeWidth="0.5"
                        className="drop-shadow-sm"
                      />
                      {/* Data Points */}
                      <circle cx="7" cy="40" r="0.8" fill="white" className="drop-shadow-sm" />
                      <circle cx="21" cy="20" r="0.8" fill="white" className="drop-shadow-sm" />
                      <circle cx="35" cy="55" r="0.8" fill="white" className="drop-shadow-sm" />
                      <circle cx="49" cy="10" r="0.8" fill="white" className="drop-shadow-sm" />
                      <circle cx="63" cy="25" r="0.8" fill="white" className="drop-shadow-sm" />
                    </svg>
                  </div>
                </>
              ) : (
                <>
                  {/* Weather Tracker - Simplified */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <CloudIcon className="h-5 w-5 text-blue-400" />
                      <span className="text-lg font-semibold text-white">Weather Tracker</span>
                    </div>
                    
                    {weatherData ? (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Temperature</span>
                          <span className="text-white font-semibold">{weatherData.main.temp}°C</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Condition</span>
                          <span className="text-white font-semibold">{weatherData.weather[0].main}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Rain Chance</span>
                          <span className="text-white font-semibold">{weatherData.rain.probability}%</span>
                        </div>
                        <div className="flex justify-center mt-4">
                          <button
                            onClick={() => setShowWeatherModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Show All
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-400">Loading weather data...</div>
                    )}
                  </div>
                </>
              )}
              
              
              {/* Tutorial and About Us Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={onShowTutorial}
                  className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-xl px-4 py-3 border border-white/20 text-white transition-all duration-300"
                >
                  <QuestionMarkCircleIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">Tutorial</span>
                </button>
                
                <button
                  onClick={onShowAboutUs}
                  className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-xl px-4 py-3 border border-white/20 text-white transition-all duration-300"
                >
                  <InformationCircleIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">About Us</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Waving Bottom Line */}
          <div className="relative overflow-hidden">
            <svg className="w-full h-3" viewBox="0 0 100 12" preserveAspectRatio="none">
              <path
                d="M0,6 Q25,2 50,6 T100,6"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1"
                fill="none"
              >
                <animate
                  attributeName="d"
                  values="M0,6 Q25,2 50,6 T100,6;M0,6 Q25,10 50,6 T100,6;M0,6 Q25,2 50,6 T100,6"
                  dur="2.5s"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          </div>
        </div>
      </div>

      {/* Weather Modal */}
      {showWeatherModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-slate-800 to-blue-900 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <CloudIcon className="h-6 w-6 text-blue-400" />
                <h2 className="text-xl font-bold text-white">Complete Weather Details</h2>
              </div>
              <button
                onClick={() => setShowWeatherModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            {weatherData && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-gray-300 text-sm">Temperature</div>
                    <div className="text-white font-bold text-lg">{weatherData.main.temp}°C</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-gray-300 text-sm">Feels Like</div>
                    <div className="text-white font-bold text-lg">{weatherData.main.feels_like}°C</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-gray-300 text-sm">Humidity</div>
                    <div className="text-white font-bold text-lg">{weatherData.main.humidity}%</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-gray-300 text-sm">Rain Chance</div>
                    <div className="text-white font-bold text-lg">{weatherData.rain.probability}%</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-gray-300 text-sm">Wind Speed</div>
                    <div className="text-white font-bold text-lg">{weatherData.wind.speed} km/h</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-gray-300 text-sm">Cloud Cover</div>
                    <div className="text-white font-bold text-lg">{weatherData.clouds.all}%</div>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-gray-300 text-sm mb-1">Location</div>
                  <div className="text-white font-bold">{weatherData.name}, Misamis Oriental, Philippines</div>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-gray-300 text-sm mb-1">Current Condition</div>
                  <div className="text-white font-bold">{weatherData.weather[0].main}</div>
                  <div className="text-gray-300 text-sm capitalize">{weatherData.weather[0].description}</div>
                </div>
                
                {weatherData.rain.amount > 0 && (
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="text-gray-300 text-sm mb-1">Precipitation</div>
                    <div className="text-white font-bold">{weatherData.rain.amount}mm</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
