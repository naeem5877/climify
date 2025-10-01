"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import type { Sound } from "@/lib/sounds";

interface SoundControlProps {
  sound: Sound;
  volume: number;
  onVolumeChange: (value: number) => void;
  isSoundPlaying: boolean;
  isSuggested: boolean;
}

export default function SoundControl({
  sound,
  volume,
  onVolumeChange,
  isSoundPlaying,
  isSuggested,
}: SoundControlProps) {
  const { Icon, name } = sound;
  const isActive = isSoundPlaying && volume > 0;

  return (
    <Card
      className={cn(
        "flex flex-col items-center justify-start text-center p-4 gap-4 transition-all duration-300 transform",
        "bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl",
        "hover:bg-white/10 hover:border-white/20 hover:-translate-y-1",
        isActive && "bg-purple-600/10 border-purple-400/30",
        isSuggested && "animate-border-pulse border-primary/80"
      )}
    >
      <CardHeader className="p-0 items-center gap-2">
        <div className="relative">
          <Icon
            className={cn(
              "h-10 w-10 text-gray-300 transition-all duration-500",
              isActive && "text-primary-foreground animate-pulse-glow"
            )}
            strokeWidth={1.5}
          />
        </div>
        <CardTitle className="text-sm font-medium font-headline tracking-wide text-gray-200">{name}</CardTitle>
      </CardHeader>
      <CardContent className="w-full p-0">
        <Slider
          value={[volume]}
          onValueChange={(values) => onVolumeChange(values[0])}
          max={100}
          step={1}
          aria-label={`${name} volume`}
          className="w-full"
        />
      </CardContent>
    </Card>
  );
}
