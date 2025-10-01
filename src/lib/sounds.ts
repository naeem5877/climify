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
  { id: 'rain', name: 'Rain', Icon: CloudRain, audioSrc: 'https://storage.googleapis.com/soundscape-mixer-sounds/rain.mp3' },
  { id: 'campfire', name: 'Campfire', Icon: Flame, audioSrc: 'https://storage.googleapis.com/soundscape-mixer-sounds/campfire.mp3' },
  { id: 'train', name: 'Train', Icon: TrainFront, audioSrc: 'https://storage.googleapis.com/soundscape-mixer-sounds/train.mp3' },
  { id: 'wind', name: 'Wind', Icon: Wind, audioSrc: 'https://storage.googleapis.com/soundscape-mixer-sounds/wind.mp3' },
  { id: 'thunderstorm', name: 'Thunderstorm', Icon: CloudLightning, audioSrc: 'https://storage.googleapis.com/soundscape-mixer-sounds/thunderstorm.mp3' },
];

export const soundIds = sounds.map(s => s.id);
