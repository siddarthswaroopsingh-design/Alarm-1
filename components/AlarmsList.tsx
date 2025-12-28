
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Bell, BellOff, Power, BrainCircuit, Upload, Music, Calendar, Tag } from 'lucide-react';
import { Alarm, SoundSource } from '../types';
import { playInbuiltSound } from '../services/audioSynth';

const AlarmsList: React.FC = () => {
  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    const saved = localStorage.getItem('chronos_alarms');
    return saved ? JSON.parse(saved) : [];
  });
  const [isAdding, setIsAdding] = useState(false);
  const [newTime, setNewTime] = useState('08:00');
  const [newDate, setNewDate] = useState('');
  const [newLabel, setNewLabel] = useState('Morning Protocol');
  const [useAI, setUseAI] = useState(true);
  const [selectedSound, setSelectedSound] = useState<SoundSource>({ id: 'cyber-pulse', name: 'Cyber Pulse', type: 'inbuilt' });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('chronos_alarms', JSON.stringify(alarms));
  }, [alarms]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedSound({ id: file.name, name: file.name, type: 'uploaded', url });
    }
  };

  const addAlarm = () => {
    const alarm: Alarm = {
      id: Date.now().toString(),
      time: newTime,
      label: newLabel || 'Alarm',
      active: true,
      days: newDate ? [] : [0, 1, 2, 3, 4, 5, 6],
      sound: selectedSound,
      aiBriefing: useAI,
      date: newDate || undefined
    };
    setAlarms([...alarms, alarm]);
    setIsAdding(false);
    setNewDate('');
    setNewLabel('Morning Protocol');
  };

  const toggleAlarm = (id: string) => {
    setAlarms(alarms.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const deleteAlarm = (id: string) => {
    setAlarms(alarms.filter(a => a.id !== id));
  };

  const setPresetLabel = (label: string) => {
    setNewLabel(label);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-white uppercase tracking-tighter">Protocols</h2>
          <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">Deployment schedule for wake-up sequences</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 p-4 rounded-2xl transition-all shadow-lg shadow-cyan-500/20"
        >
          <Plus size={24} />
        </button>
      </div>

      {isAdding && (
        <div className="glass-panel p-8 rounded-[2.5rem] border-cyan-500/30 animate-in fade-in zoom-in duration-300">
          <h3 className="text-lg font-bold mb-6 uppercase tracking-tighter text-cyan-400 flex items-center gap-2">
            <Music size={20} /> Initialize New Protocol
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Time Index</label>
                  <input 
                    type="time" 
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-3xl font-orbitron text-white outline-none focus:border-cyan-500 transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Future Date (Optional)</label>
                  <input 
                    type="date" 
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs font-orbitron text-white outline-none focus:border-cyan-500 transition-all shadow-inner"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Protocol Identifier / Event</label>
                <div className="relative">
                   <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                   <input 
                    type="text" 
                    value={newLabel}
                    placeholder="E.g. Call Commander Sarah..."
                    onChange={(e) => setNewLabel(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 pl-12 text-white outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar pb-2">
                   {['Morning Protocol', 'Neural Sync', 'Target Contact', 'Data Sweep', 'Extraction'].map(p => (
                     <button 
                        key={p} 
                        onClick={() => setPresetLabel(p)}
                        className="whitespace-nowrap px-3 py-1 rounded-lg border border-slate-800 text-[9px] font-bold text-slate-500 hover:text-cyan-400 hover:border-cyan-500 transition-all"
                     >
                       {p}
                     </button>
                   ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Audio Uplink Selector</label>
              <div className="grid grid-cols-2 gap-2">
                {['cyber-pulse', 'neon-wake', 'system-alert'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setSelectedSound({ id: s, name: s.replace('-', ' '), type: 'inbuilt' });
                      playInbuiltSound(s);
                    }}
                    className={`p-3 rounded-xl border text-[10px] font-bold uppercase transition-all
                      ${selectedSound.id === s ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400 shadow-lg shadow-cyan-500/5' : 'border-slate-800 text-slate-500 hover:border-slate-700'}`}
                  >
                    {s.replace('-', ' ')}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-3 rounded-xl border border-dashed text-[10px] font-bold uppercase flex items-center justify-center gap-2 transition-all
                    ${selectedSound.type === 'uploaded' ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' : 'border-slate-700 text-slate-500 hover:border-slate-500'}`}
                >
                  <Upload size={14} /> {selectedSound.type === 'uploaded' ? 'Custom File' : 'Upload Audio'}
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="audio/*" />
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col md:flex-row gap-6">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={useAI} onChange={(e) => setUseAI(e.target.checked)} className="hidden" />
              <div className={`w-12 h-6 rounded-full p-1 transition-all ${useAI ? 'bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.4)]' : 'bg-slate-800'}`}>
                <div className={`w-4 h-4 bg-white rounded-full transition-all duration-300 ${useAI ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-300">Neural Briefing</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-tighter">AI Morning Synthesis</span>
              </div>
            </label>
            
            <div className="flex-1 flex gap-3">
              <button onClick={addAlarm} className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all shadow-xl shadow-cyan-500/10">
                Sync Sequence
              </button>
              <button onClick={() => setIsAdding(false)} className="px-8 py-4 rounded-2xl border border-slate-800 text-slate-500 hover:bg-slate-900 transition-all text-xs font-bold uppercase">
                Abort
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {alarms.length === 0 ? (
          <div className="text-center py-20 opacity-30 border-2 border-dashed border-slate-800 rounded-[3rem]">
            <BellOff size={64} className="mx-auto mb-4 text-slate-700" />
            <p className="font-orbitron uppercase tracking-widest text-slate-600">No active alarms in buffer</p>
          </div>
        ) : (
          alarms.map(alarm => (
            <div 
              key={alarm.id}
              className={`glass-panel p-8 rounded-[2.5rem] transition-all duration-700 group hover:shadow-2xl
                ${alarm.active ? 'border-cyan-500/30 opacity-100' : 'border-slate-900 opacity-40 grayscale-[0.5]'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <div className={`p-6 rounded-3xl transition-all duration-500 shadow-inner ${alarm.active ? 'bg-cyan-500/10 text-cyan-400 glow-border' : 'bg-slate-900 text-slate-700'}`}>
                    <Bell size={28} className={alarm.active ? 'animate-pulse' : ''} />
                  </div>
                  <div>
                    <div className="flex items-center gap-4">
                      <span className="text-5xl font-orbitron font-black text-white tracking-tighter glow-text">
                        {alarm.time}
                      </span>
                      {alarm.aiBriefing && <BrainCircuit size={20} className="text-cyan-500 animate-pulse" />}
                      {alarm.date && (
                        <div className="flex items-center gap-1 bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                          <Calendar size={12} /> {alarm.date}
                        </div>
                      )}
                    </div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
                      {alarm.label} <span className="w-1 h-1 bg-slate-700 rounded-full"></span> 
                      <span className="text-slate-600 flex items-center gap-1"><Music size={12}/> {alarm.sound.name}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => toggleAlarm(alarm.id)}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${alarm.active ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30 scale-105' : 'bg-slate-900 text-slate-600 hover:text-slate-200'}`}
                  >
                    <Power size={24} />
                  </button>
                  <button 
                    onClick={() => deleteAlarm(alarm.id)}
                    className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 text-slate-700 hover:text-red-500 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlarmsList;
