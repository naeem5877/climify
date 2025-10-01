"use server";
import { generateSoundscapeSuggestion } from '@/ai/flows/generate-soundscape-suggestion';
import { soundIds } from '@/lib/sounds';
import { z } from 'zod';

const suggestionSchema = z.object({
  environmentDescription: z.string().min(10, 'Please describe your environment in a bit more detail (at least 10 characters).'),
});

type SuggestionState = {
  error: string | null;
  suggestions: string[] | null;
}

export async function getSoundSuggestion(prevState: SuggestionState, formData: FormData): Promise<SuggestionState> {
  const validatedFields = suggestionSchema.safeParse({
    environmentDescription: formData.get('environmentDescription'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.environmentDescription?.join(', ') || "Invalid input.",
      suggestions: null,
    };
  }

  try {
    const result = await generateSoundscapeSuggestion(validatedFields.data);

    // Filter suggestions to only include valid sound IDs
    const validSuggestions = result.suggestedSoundscapes.filter(s => soundIds.includes(s as any));
    
    return {
      error: null,
      suggestions: validSuggestions,
    };
  } catch (e) {
    console.error(e);
    return {
      error: 'An unexpected error occurred while getting suggestions. Please try again later.',
      suggestions: null,
    };
  }
}
