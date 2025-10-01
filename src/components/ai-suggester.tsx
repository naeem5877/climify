"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { Sparkles } from "lucide-react";

import { getSoundSuggestion } from "@/app/actions";
import type { SoundId } from "@/lib/sounds";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Label } from "./ui/label";

interface AiSuggesterProps {
  onSuggestions: (suggestions: SoundId[]) => void;
}

const initialState = {
  error: null,
  suggestions: [],
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? "Analyzing..." : <>
        <Sparkles className="mr-2 h-4 w-4" /> Generate
      </>}
    </Button>
  );
}

export default function AiSuggester({ onSuggestions }: AiSuggesterProps) {
  const [state, formAction] = React.useActionState(getSoundSuggestion, initialState);
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.error) {
      toast({
        variant: "destructive",
        title: "Suggestion Error",
        description: state.error,
      });
    }
    if (state.suggestions && state.suggestions.length > 0) {
      onSuggestions(state.suggestions as SoundId[]);
      toast({
        title: "Soundscape Generated!",
        description: "We've adjusted the sliders based on your environment.",
      });
      formRef.current?.reset();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <Card className="w-full bg-black/30 backdrop-blur-lg border-white/10 shadow-2xl shadow-purple-900/20">
      <form action={formAction} ref={formRef}>
        <CardHeader>
          <CardTitle className="font-headline text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">
            AI Soundscape Assistant
          </CardTitle>
          <CardDescription>
            Describe your current environment or mood for a personalized soundscape.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <Label htmlFor="environmentDescription" className="sr-only">Your Environment</Label>
            <Textarea
                id="environmentDescription"
                name="environmentDescription"
                placeholder="e.g., 'A quiet library, need to focus.' or 'A rainy evening, feeling cozy.'"
                rows={3}
                required
                className="bg-transparent/20 border-white/20 focus:ring-primary/80"
            />
            {state.error && <p className="text-sm text-destructive">{state.error}</p>}
        </CardContent>
        <CardFooter className="justify-end">
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
