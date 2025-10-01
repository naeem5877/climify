import SoundMixer from '@/components/sound-mixer';

export default function Home() {
  return (
    <main className="relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-background to-blue-950/50" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-1/2 bg-gradient-radial from-purple-600/20 via-transparent to-transparent" />
      </div>
      <div className="z-10 flex w-full max-w-7xl flex-col items-center gap-8 p-4 sm:p-6 md:p-8">
        <SoundMixer />
      </div>
    </main>
  );
}
