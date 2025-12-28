
import React, { useState, useEffect } from 'react';
import { Globe, Plus, Trash2, Search, X } from 'lucide-react';
import { WorldClock } from '../types';

const COMMON_TIMEZONES = [
  { city: 'London', timezone: 'Europe/London' },
  { city: 'New York', timezone: 'America/New_York' },
  { city: 'Tokyo', timezone: 'Asia/Tokyo' },
  { city: 'Dubai', timezone: 'Asia/Dubai' },
  { city: 'Singapore', timezone: 'Asia/Singapore' },
  { city: 'Paris', timezone: 'Europe/Paris' },
  { city: 'Berlin', timezone: 'Europe/Berlin' },
  { city: 'Sydney', timezone: 'Australia/Sydney' },
  { city: 'San Francisco', timezone: 'America/Los_Angeles' },
  { city: 'Hong Kong', timezone: 'Asia/Hong_Kong' },
  { city: 'Mumbai', timezone: 'Asia/Kolkata' },
  { city: 'Seoul', timezone: 'Asia/Seoul' },
  { city: 'Cairo', timezone: 'Africa/Cairo' },
  { city: 'Sao Paulo', timezone: 'America/Sao_Paulo' },
  { city: 'Moscow', timezone: 'Europe/Moscow' },
];

const WorldClockView: React.FC = () => {
  const [clocks, setClocks] = useState<WorldClock[]>(() => {
    const saved = localStorage.getItem('chronos_world_clocks');
    return saved ? JSON.parse(saved) : [
      { id: '1', city: 'London', timezone: 'Europe/London' },
      { id: '2', city: 'Tokyo', timezone: 'Asia/Tokyo' },
      { id: '3', city: 'New York', timezone: 'America/New_York' }
    ];
  });
  const [time, setTime] = useState(new Date());
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('chronos_world_clocks', JSON.stringify(clocks));
  }, [clocks]);

  const formatCityTime = (timezone: string) => {
    try {
      return time.toLocaleTimeString('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    } catch (e) {
      return "--:--:--";
    }
  };

  const getTimeOffset = (timezone: string) => {
    try {
      const cityTime = new Date(time.toLocaleString('en-US', { timeZone: timezone }));
      const diff = (cityTime.getTime() - time.getTime()) / 3600000;
      const rounded = Math.round(diff);
      return rounded >= 0 ? `+${rounded}h` : `${rounded}h`;
    } catch (e) {
      return "0h";
    }
  };

  const addClock = (city: string, timezone: string) => {
    if (clocks.find(c => c.timezone === timezone)) {
      setIsSearching(false);
      setSearchQuery('');
      return;
    }
    const newClock: WorldClock = {
      id: Date.now().toString(),
      city,
      timezone
    };
    setClocks([...clocks, newClock]);
    setIsSearching(false);
    setSearchQuery('');
  };

  const removeClock = (id: string) => {
    setClocks(clocks.filter(c => c.id !== id));
  };

  const filteredTimezones = COMMON_TIMEZONES.filter(tz => 
    tz.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-white uppercase tracking-tighter">Global Uplink</h2>
          <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Synchronized multi-sector temporal tracking</p>
        </div>
        <button 
          onClick={() => setIsSearching(true)}
          className="bg-cyan-500 text-slate-950 p-4 rounded-2xl hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
        >
          <Plus size={24} />
        </button>
      </div>

      {isSearching && (
        <div className="glass-panel p-6 rounded-[2rem] border-cyan-500/30 animate-in zoom-in duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                autoFocus
                type="text"
                placeholder="Search global sector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-cyan-500 transition-all"
              />
            </div>
            <button onClick={() => setIsSearching(false)} className="p-3 text-slate-500 hover:text-white">
              <X size={24} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto pr-2 no-scrollbar">
            {filteredTimezones.map(tz => (
              <button
                key={tz.timezone}
                onClick={() => addClock(tz.city, tz.timezone)}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-400 hover:border-cyan-500 hover:text-cyan-400 transition-all text-left truncate"
              >
                {tz.city}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clocks.map(clock => (
          <div key={clock.id} className="glass-panel p-8 rounded-[2rem] border-white/5 relative group overflow-hidden hover:border-cyan-500/30 transition-all duration-500 shadow-xl">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => removeClock(clock.id)}
                className="text-slate-600 hover:text-red-400 p-2 rounded-lg bg-slate-900/50"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-cyan-500 uppercase tracking-widest">{clock.city}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                  {getTimeOffset(clock.timezone)}
                </span>
              </div>
              <div className="text-4xl font-orbitron font-bold text-white my-4 glow-text">
                {formatCityTime(clock.timezone)}
              </div>
              <div className="mt-auto pt-4 border-t border-white/5 text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center justify-between">
                <span>Sector: {clock.timezone.split('/')[0]}</span>
                <Globe size={12} className="text-cyan-500/30" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {!isSearching && (
        <div 
          onClick={() => setIsSearching(true)}
          className="glass-panel p-6 rounded-3xl border-dashed border-slate-800 flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity cursor-pointer group hover:border-cyan-500/50"
        >
          <div className="flex items-center gap-3 text-slate-400 group-hover:text-cyan-400 font-bold uppercase text-xs tracking-widest">
             <Globe size={20} />
             Link Additional Temporal Sector
          </div>
        </div>
      )}
    </div>
  );
};

export default WorldClockView;
