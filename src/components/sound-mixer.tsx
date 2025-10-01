"use client";

import * as React from "react";
import * as Tone from "tone";
import { Pause, Play, Volume2 } from "lucide-react";

import { sounds, type Sound, type SoundId } from "@/lib/sounds";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import SoundControl from "@/components/sound-control";
import AiSuggester from "@/components/ai-suggester";

type Volumes = Record<SoundId, number>;

const initialVolumes: Volumes = sounds.reduce((acc, sound) => {
  acc[sound.id] = 0;
  return acc;
}, {} as Volumes);

export default function SoundMixer() {
  const [isMounted, setIsMounted] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [volumes, setVolumes] = React.useState<Volumes>(initialVolumes);
  const [activeSuggestions, setActiveSuggestions] = React.useState<SoundId[]>([]);
  const playersRef = React.useRef<Record<SoundId, Tone.Player>>({} as Record<SoundId, Tone.Player>);

  React.useEffect(() => {
    setIsMounted(true);
    const playerInstances = sounds.reduce((acc, sound) => {
      acc[sound.id] = new Tone.Player({
        url: sound.audioSrc,
        loop: true,
        volume: -Infinity,
        fadeOut: 0.5,
        fadeIn: 0.5,
      }).toDestination();
      return acc;
    }, {} as Record<SoundId, Tone.Player>);
    playersRef.current = playerInstances;

    return () => {
      Object.values(playersRef.current).forEach(player => player.dispose());
      if (Tone.Transport.state === "started") {
        Tone.Transport.stop();
        Tone.Transport.cancel();
      }
    };
  }, []);

  const handleVolumeChange = (id: SoundId, value: number) => {
    const newVolumes = { ...volumes, [id]: value };
    setVolumes(newVolumes);

    const player = playersRef.current[id];
    if (player) {
      if (value > 0) {
        player.volume.value = Tone.gainToDb(value / 100);
        if (isPlaying && player.state !== "started") {
          player.sync().start(0);
        }
      } else {
        player.volume.value = -Infinity;
      }
    }
  };

  const togglePlay = async () => {
    if (Tone.context.state !== "running") {
      await Tone.start();
    }
    await Tone.loaded();

    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);

    if (nextIsPlaying) {
      Tone.Transport.start();
      Object.entries(volumes).forEach(([id, vol]) => {
        if (vol > 0) {
          const player = playersRef.current[id as SoundId];
          if (player.state !== "started") {
            player.sync().start(0);
          }
        }
      });
    } else {
      Tone.Transport.pause();
    }
  };

  const handleSuggestions = (suggestedIds: SoundId[]) => {
    const newVolumes: Volumes = { ...initialVolumes };
    suggestedIds.forEach(id => {
      if (sounds.some(s => s.id === id)) {
        newVolumes[id] = 50; // Set suggested sounds to a default volume
      }
    });
    setVolumes(newVolumes);

    Object.entries(newVolumes).forEach(([id, vol]) => {
        const player = playersRef.current[id as SoundId];
        if (player) {
            if (vol > 0) {
                player.volume.value = Tone.gainToDb(vol / 100);
                if (isPlaying && player.state !== "started") {
                    player.sync().start(0);
                }
            } else {
                player.volume.value = -Infinity;
            }
        }
    });

    setActiveSuggestions(suggestedIds);
    setTimeout(() => setActiveSuggestions([]), 6000); // Animation is 3*2s
  };

  if (!isMounted) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      <Card className="w-full max-w-5xl bg-card/50 backdrop-blur-sm border-2">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-4xl md:text-5xl tracking-wider">
            Soundscape Mixer
          </CardTitle>
          <CardDescription className="text-lg">
            Craft your perfect ambient sound environment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {sounds.map((sound) => (
              <SoundControl
                key={sound.id}
                sound={sound}
                volume={volumes[sound.id]}
                onVolumeChange={(value) => handleVolumeChange(sound.id, value)}
                isSoundPlaying={isPlaying && volumes[sound.id] > 0}
                isSuggested={activeSuggestions.includes(sound.id)}
              />
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4 pt-6">
          <Button
            onClick={togglePlay}
            size="lg"
            className="w-48 h-16 text-2xl rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow duration-300"
            aria-label={isPlaying ? "Pause all sounds" : "Play all sounds"}
          >
            {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
          </Button>
          <div className="flex items-center gap-2 text-muted-foreground mt-2">
            <Volume2 className="h-4 w-4" />
            <span className="text-xs">Adjust individual volumes above</span>
          </div>
        </CardFooter>
      </Card>
      <AiSuggester onSuggestions={handleSuggestions} />
    </>
  );
}

const LoadingSkeleton = () => (
  <div className="w-full max-w-5xl space-y-8">
    <Card className="w-full bg-card/50 backdrop-blur-sm border-2">
      <CardHeader className="text-center">
        <Skeleton className="h-12 w-3/4 mx-auto" />
        <Skeleton className="h-6 w-1/2 mx-auto" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {sounds.map((sound) => (
            <Card key={sound.id} className="flex flex-col items-center justify-center p-4 gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-full" />
            </Card>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-4 pt-6">
        <Skeleton className="w-48 h-16 rounded-full" />
        <Skeleton className="h-4 w-48" />
      </CardFooter>
    </Card>
    <Card className="w-full max-w-xl self-center bg-card/50 backdrop-blur-sm border-2">
        <CardHeader><Skeleton className="h-8 w-48" /></CardHeader>
        <CardContent><Skeleton className="h-24 w-full" /></CardContent>
        <CardFooter><Skeleton className="h-10 w-32" /></CardFooter>
    </Card>
  </div>
);
