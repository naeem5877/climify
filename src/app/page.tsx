import SoundMixer from '@/components/sound-mixer';

export default function Home() {
  return (
    <div className="flex min-h-svh w-full items-start justify-center bg-background p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-5xl flex flex-col gap-8 items-center">
        <SoundMixer />
      </div>
    </div>
  );
}
