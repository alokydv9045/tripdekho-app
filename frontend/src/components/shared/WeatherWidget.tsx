import React, { useEffect, useState } from 'react';
import { Cloud, CloudRain, Sun, Snowflake, Wind, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WeatherWidgetProps {
  location: string;
  className?: string;
}

export default function WeatherWidget({ location, className }: WeatherWidgetProps) {
  const [current, setCurrent] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!location) return;
    
    const fetchWeather = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`https://wttr.in/${location}?format=j1`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        
        if (data.current_condition && data.current_condition.length > 0) {
          const condition = data.current_condition[0];
          setCurrent({
            temp: condition.temp_C,
            desc: condition.weatherDesc[0].value,
            icon: getWeatherIcon(condition.weatherDesc[0].value)
          });
        } else {
          setError(true);
        }

        if (data.weather && data.weather.length > 0) {
          // data.weather has 3 days usually: today, tomorrow, day after
          const daily = data.weather.map((day: any) => {
            const date = new Date(day.date);
            const isToday = new Date().toDateString() === date.toDateString();
            const midday = day.hourly[4]; // ~12:00 PM
            const desc = midday?.weatherDesc?.[0]?.value || 'Clear';
            
            return {
              day: isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' }),
              temp: day.maxtempC,
              desc: desc,
              icon: getWeatherIcon(desc)
            };
          });
          setForecast(daily);
        }
      } catch (err) {
        console.error('Weather fetch error', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    const getWeatherIcon = (desc: string) => {
      const d = desc.toLowerCase();
      if (d.includes('clear')) return Sun;
      if (d.includes('cloud')) return Cloud;
      if (d.includes('rain') || d.includes('drizzle')) return CloudRain;
      if (d.includes('snow')) return Snowflake;
      if (d.includes('mist') || d.includes('fog')) return Wind;
      return Sun;
    };

    fetchWeather();
  }, [location]);


  if (loading) {
    return <div className={cn("p-4 bg-gray-50 rounded-2xl animate-pulse h-32", className)}></div>;
  }

  if (error || !current) {
    return (
      <div className={cn("p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center gap-2 text-gray-400", className)}>
        <AlertCircle size={16} />
        <span className="text-xs font-medium">Weather unavailable for {location}</span>
      </div>
    );
  }

  const CurrentIcon = current.icon;

  return (
    <div className={cn("bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow", className)}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Live Weather</p>
          <h3 className="text-lg font-bold text-gray-900 capitalize">{location}</h3>
        </div>
        <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center shrink-0">
          <CurrentIcon size={20} />
        </div>
      </div>
      
      <div className="flex items-end gap-2 mb-6">
        <span className="text-4xl font-black text-gray-900">{current.temp}°C</span>
        <span className="text-sm font-bold text-gray-500 mb-1">{current.desc}</span>
      </div>

      {forecast.length > 0 && (
        <div className="pt-4 border-t border-gray-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Forecast</p>
          <div className="grid grid-cols-3 gap-2">
            {forecast.map((f, i) => {
              const FIcon = f.icon;
              return (
                <div key={i} className="flex flex-col items-center p-2 bg-gray-50 rounded-xl hover:bg-amber-50/50 transition-colors cursor-default">
                  <span className="text-[10px] font-bold text-gray-500 mb-1">{f.day}</span>
                  <FIcon size={16} className="text-gray-400 mb-1" />
                  <span className="text-sm font-black text-gray-900">{f.temp}°</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
