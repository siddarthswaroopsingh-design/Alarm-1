
export type Theme = 'cyber' | 'minimal' | 'matrix' | 'nebula';

export type SoundSource = {
  id: string;
  name: string;
  type: 'inbuilt' | 'uploaded';
  url?: string;
  blob?: File;
};

export interface Alarm {
  id: string;
  time: string; // HH:mm
  label: string;
  active: boolean;
  days: number[]; // 0-6
  sound: SoundSource;
  aiBriefing: boolean;
  date?: string; // YYYY-MM-DD for one-time future events
}

export interface Lap {
  id: number;
  time: number;
  delta: number;
}

export interface WorldClock {
  id: string;
  city: string;
  timezone: string;
}

export interface SleepTimerConfig {
  isActive: boolean;
  timeLeft: number; // seconds
  totalTime: number;
}
