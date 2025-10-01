"use client";

import * as React from 'react';
import * as Tone from 'tone';
import {Pause, Play} from 'lucide-react';
import {useFormState} from 'react-dom';

import {getSoundSuggestion} from '@/app/actions';
import AiSuggester from '@/components/ai-suggester';
import SoundControl from '@/components/sound-control';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import {soundIds, sounds, type SoundId} from '@/lib/sounds';

type Volumes = Record<SoundId, number>;

const initialVolumes: Volumes = sounds.reduce((acc, sound) => {
  acc[sound.id] = 0;
  return acc;
}, {} as Volumes);

export default function SoundMixer() {
  const [isMounted, setIsMounted] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [volumes, setVolumes] = React.useState<Volumes>(initialVolumes);
  const [activeSuggestions, setActiveSuggestions] = React.useState<SoundId[]>(
    []
  );
  const playersRef = React.useRef<Record<SoundId, Tone.Player>>(
    {} as Record<SoundId, Tone.Player>
  );

  React.useEffect(() => {
    const setupPlayers = async () => {
      const playerInstances = await Promise.all(
        sounds.map(
          sound =>
            new Promise<[SoundId, Tone.Player]>((resolve, reject) => {
              const player = new Tone.Player({
                url: sound.audioSrc,
                loop: true,
                volume: -Infinity,
                fadeOut: 0.5,
                fadeIn: 0.5,
                onload: () => resolve([sound.id, player]),
                onerror: err =>
                  reject(new Error(`Failed to load ${sound.audioSrc}: ${err}`)),
              }).toDestination();
            })
        )
      );

      playersRef.current = Object.fromEntries(playerInstances) as Record<
        SoundId,
        Tone.Player
      >;
      setIsMounted(true);
    };

    setupPlayers().catch(console.error);

    return () => {
      Object.values(playersRef.current).forEach(player => player.dispose());
      if (Tone.Transport.state === 'started') {
        Tone.Transport.stop();
        Tone.Transport.cancel();
      }
    };
  }, []);

  const handleVolumeChange = (id: SoundId, value: number) => {
    const newVolumes = {...volumes, [id]: value};
    setVolumes(newVolumes);

    const player = playersRef.current[id];
    if (player && player.loaded) {
      if (value > 0) {
        player.volume.value = Tone.gainToDb(value / 100);
        if (isPlaying && player.state !== 'started') {
          player.sync().start(0);
        }
      } else {
        // Fade out and stop the player to conserve resources if volume is 0
        player.volume.linearRampTo(-Infinity, 0.5);
      }
    }
  };

  const togglePlay = async () => {
    if (Tone.context.state !== 'running') {
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
          if (player && player.loaded && player.state !== 'started') {
            player.sync().start(0);
          }
        }
      });
    } else {
      Tone.Transport.pause();
    }
  };

  const handleSuggestions = async (suggestedIds: SoundId[]) => {
    const newVolumes: Volumes = {...initialVolumes};
    const suggestionVolume = 60; // Set suggested sounds to a default volume
    suggestedIds.forEach(id => {
      if (sounds.some(s => s.id === id)) {
        newVolumes[id] = suggestionVolume;
      }
    });

    await Tone.loaded();

    // First, apply all volume changes immediately for a smooth transition
    setVolumes(newVolumes);

    Object.entries(newVolumes).forEach(([id, vol]) => {
      const player = playersRef.current[id as SoundId];
      if (player && player.loaded) {
        player.volume.linearRampTo(
          vol > 0 ? Tone.gainToDb(vol / 100) : -Infinity,
          0.5
        );
        if (vol > 0 && isPlaying && player.state !== 'started') {
          player.sync().start(0);
        }
      }
    });

    setActiveSuggestions(suggestedIds);
    setTimeout(() => setActiveSuggestions([]), 4000); // Animation is 2*2s
  };

  if (!isMounted) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full">
      <Card className="w-full lg:w-3/5 bg-black/30 backdrop-blur-lg border-white/10 shadow-2xl shadow-purple-900/20">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">
            Ambient Sound Mixer
          </CardTitle>
          <CardDescription className="text-base">
            Craft your perfect audio environment for focus or relaxation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
            {sounds.map(sound => (
              <SoundControl
                key={sound.id}
                sound={sound}
                volume={volumes[sound.id]}
                onVolumeChange={value => handleVolumeChange(sound.id, value)}
                isSoundPlaying={isPlaying}
                isSuggested={activeSuggestions.includes(sound.id)}
              />
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4 pt-6">
          <Button
            onClick={togglePlay}
            size="lg"
            variant={isPlaying ? 'secondary' : 'default'}
            className="w-48 h-16 text-2xl rounded-full shadow-lg hover:shadow-primary/40 transition-all duration-300 group"
            aria-label={isPlaying ? 'Pause all sounds' : 'Play all sounds'}
          >
            {isPlaying ? (
              <Pause className="h-8 w-8 text-primary-foreground group-hover:scale-110 transition-transform" />
            ) : (
              <Play className="h-8 w-8 text-primary-foreground group-hover:scale-110 transition-transform" />
            )}
          </Button>
        </CardFooter>
      </Card>

      <div className="w-full lg:w-2/5 flex flex-col gap-8">
        <AiSuggester onSuggestions={handleSuggestions} />
      </div>
    </div>
  );
}

const LoadingSkeleton = () => (
  <div className="w-full max-w-5xl space-y-8">
    <Card className="w-full bg-black/30 backdrop-blur-lg border-white/10">
      <CardHeader className="text-center">
        <Skeleton className="h-10 w-3/4 mx-auto bg-white/10" />
        <Skeleton className="h-6 w-1/2 mx-auto bg-white/10" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
          {sounds.map(sound => (
            <Card
              key={sound.id}
              className="flex flex-col items-center justify-center p-4 gap-4 bg-white/5 border-white/10"
            >
              <Skeleton className="h-10 w-10 rounded-full bg-white/10" />
              <Skeleton className="h-5 w-20 bg-white/10" />
              <Skeleton className="h-2 w-full bg-white/10" />
            </Card>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-4 pt-6">
        <Skeleton className="w-48 h-16 rounded-full bg-white/10" />
      </CardFooter>
    </Card>
  </div>
);