import React, { useState, useEffect } from 'react';
import { 
  CloudRain, Sun, Wind, Cloud, Zap, Moon, 
  BarChart3, Heart, ThermometerSun
} from 'lucide-react';
import { EmotionalWeather, CompanionId } from '../types';

interface MentalWeatherProps {
  onCheckIn?: (log: EmotionalWeather) => void;
  activeCompanionId: CompanionId;
  key?: React.Key;
}

const WEATHER_OPTIONS = [
  { id: 'sunny', label: '晴朗', icon: <Sun className="w-6 h-6 text-amber-500" />, color: 'text-amber-500', bg: 'bg-amber-500/10', desc: '心情明媚，充满能量' },
  { id: 'misty', label: '多云', icon: <Cloud className="w-6 h-6 text-stone-500" />, color: 'text-stone-500', bg: 'bg-stone-500/10', desc: '略显沉闷，平静自然' },
  { id: 'rainy', label: '细雨', icon: <CloudRain className="w-6 h-6 text-blue-500" />, color: 'text-blue-500', bg: 'bg-blue-500/10', desc: '思绪万千，感性忧郁' },
  { id: 'stormy', label: '雷雨', icon: <Zap className="w-6 h-6 text-purple-500" />, color: 'text-purple-500', bg: 'bg-purple-500/10', desc: '焦躁不安，压力重重' },
  { id: 'windy', label: '微风', icon: <Wind className="w-6 h-6 text-emerald-500" />, color: 'text-emerald-500', bg: 'bg-emerald-500/10', desc: '轻松自在，向往自由' },
  { id: 'starry', label: '星空', icon: <Moon className="w-6 h-6 text-indigo-500" />, color: 'text-indigo-500', bg: 'bg-indigo-500/10', desc: '宁静深邃，探索未知' },
];

export default function MentalWeather({ onCheckIn, activeCompanionId }: MentalWeatherProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [logs, setLogs] = useState<EmotionalWeather[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('soul_companion_weather_logs');
    if (saved) {
      try {
        setLogs(JSON.parse(saved).slice(-5).reverse());
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLog = (weatherId: string) => {
    const option = WEATHER_OPTIONS.find(o => o.id === weatherId);
    if (!option) return;

    const newLog: EmotionalWeather = {
      type: weatherId as any,
      energy: 50,
      anxiety: 30,
      social: 40,
      checkedInAt: new Date().toISOString(),
    };

    const updatedLogs = [newLog, ...logs].slice(0, 50);
    setLogs(updatedLogs.slice(0, 5));
    localStorage.setItem('soul_companion_weather_logs', JSON.stringify(updatedLogs));
    
    setSelected(weatherId);
    if (onCheckIn) onCheckIn(newLog);
  };

  return (
    <div className="space-y-8 animate-fade-in p-2">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-black font-extrabold">今日心灵气象</h2>
          <p className="text-sm opacity-100 text-black mt-1 font-semibold">记录此刻波动的频率</p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-black/10 text-black font-bold">
          <ThermometerSun className="w-4 h-4 text-black" />
          <span className="text-xs font-mono font-bold">26°C 恒温守护</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {WEATHER_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => handleLog(option.id)}
            className={`flex flex-col items-center p-4 rounded-3xl border transition-all duration-300 relative group cursor-pointer ${
              selected === option.id 
                ? 'bg-white shadow-xl border-black/30 -translate-y-1 scale-[1.02] text-black' 
                : 'bg-white/50 border-black/20 hover:border-black/30 text-black font-semibold'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${option.bg}`}>
              {option.icon}
            </div>
            <span className="text-sm font-extrabold">{option.label}</span>
            <span className="text-[10px] opacity-100 mt-1 text-center leading-tight font-black text-black">{option.desc}</span>
            
            {selected === option.id && (
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-black animate-pulse" />
            )}
          </button>
        ))}
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-widest opacity-90 text-black flex items-center gap-2 animate-pulse">
            <BarChart3 className="w-3.5 h-3.5" />
            最近气象波动
          </h3>
        </div>

        {logs.length === 0 ? (
          <div className="py-10 border-2 border-dashed border-black/10 rounded-3xl flex flex-col items-center justify-center opacity-85 text-black">
            <Moon className="w-8 h-8 mb-2 animate-bounce" />
            <span className="text-[10px] font-mono">尚无心灵信风记录</span>
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => {
              const option = WEATHER_OPTIONS.find(o => o.id === log.type) || WEATHER_OPTIONS[0];
              return (
                <div key={log.checkedInAt} className="flex items-center justify-between p-3 rounded-2xl bg-white/40 border border-black/10 text-black">
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${option.bg}`}>
                      {React.cloneElement(option.icon as React.ReactElement, { className: 'w-4 h-4 ' + option.color })}
                    </div>
                    <span className="text-xs font-extrabold">{option.label}</span>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] opacity-100 font-mono text-black font-bold">
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-black" />
                      <span>{activeCompanionId} 调频中</span>
                    </div>
                    <span>{new Date(log.checkedInAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
