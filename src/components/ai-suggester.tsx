"use client";

import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Wand2 } from "lucide-react";

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
    <Button type="submit" disabled={pending}>
      {pending ? "Analyzing..." : <>
        <Wand2 className="mr-2 h-4 w-4" /> Suggest Soundscape
      </>}
    </Button>
  );
}

export default function AiSuggester({ onSuggestions }: AiSuggesterProps) {
  const [state, formAction] = useFormState(getSoundSuggestion, initialState);
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
        title: "Soundscape Suggested!",
        description: "We've adjusted the sliders based on your environment.",
      });
      formRef.current?.reset();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]); // Only run when state changes

  return (
    <Card className="w-full max-w-xl self-center bg-card/50 backdrop-blur-sm border-2">
      <form action={formAction} ref={formRef}>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">AI Soundscape Assistant</CardTitle>
          <CardDescription>
            Describe your current environment or mood, and let AI suggest the perfect background sounds for you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
            <Label htmlFor="environmentDescription">Your Environment</Label>
            <Textarea
                id="environmentDescription"
                name="environmentDescription"
                placeholder="e.g., 'Working in a busy coffee shop, need to focus.' or 'Trying to fall asleep after a stressful day.'"
                rows={3}
                required
            />
            {state.error && <p className="text-sm text-destructive">{state.error}</p>}
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
