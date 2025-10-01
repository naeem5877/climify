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

  return (
    <Card
      className={cn(
        "flex flex-col items-center justify-start text-center p-4 gap-4 transition-all duration-300 transform hover:scale-105 hover:bg-secondary/20",
        isSoundPlaying ? "bg-secondary/10" : "bg-transparent",
        isSuggested && "animate-border-pulse"
      )}
    >
      <CardHeader className="p-0 items-center gap-2">
        <div className="relative">
          <Icon
            className={cn(
              "h-12 w-12 text-foreground/80 transition-all duration-500",
              isSoundPlaying && "text-primary animate-pulse-glow"
            )}
            strokeWidth={1.5}
          />
        </div>
        <CardTitle className="text-base font-medium font-headline tracking-wide">{name}</CardTitle>
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
