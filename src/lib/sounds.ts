import type { LucideProps } from 'lucide-react';
import { CloudLightning, CloudRain, Flame, TrainFront, Wind } from 'lucide-react';

export type SoundId = 'rain' | 'campfire' | 'train' | 'wind' | 'thunderstorm';

export type Sound = {
  id: SoundId;
  name: string;
  Icon: React.ComponentType<LucideProps>;
  audioSrc: string;
};

export const sounds: Sound[] = [
  { id: 'rain', name: 'Rain', Icon: CloudRain, audioSrc: 'https://cdn.jsdelivr.net/gh/naeem5877/audiocdn@main/Rain_Umbrella.wav' },
  { id: 'campfire', name: 'Campfire', Icon: Flame, audioSrc: 'https://cdn.jsdelivr.net/gh/naeem5877/audiocdn@main/Crackling_campfire.wav' },
  { id: 'train', name: 'Train', Icon: TrainFront, audioSrc: 'https://cdn.jsdelivr.net/gh/naeem5877/audiocdn@main/Interior_train_ambie.wav' },
  { id: 'wind', name: 'Wind', Icon: Wind, audioSrc: 'https://cdn.jsdelivr.net/gh/naeem5877/audiocdn@main/Strong_gusty_wind.wav' },
  { id: 'thunderstorm', name: 'Thunderstorm', Icon: CloudLightning, audioSrc: 'https://cdn.jsdelivr.net/gh/naeem5877/audiocdn@main/thunderstorm.mp3' },
];

export const soundIds = sounds.map(s => s.id);
