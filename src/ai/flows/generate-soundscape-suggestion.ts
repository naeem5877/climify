'use server';
/**
 * @fileOverview AI-powered soundscape suggestion flow.
 *
 * - generateSoundscapeSuggestion - A function that suggests a soundscape based on the user's environment description.
 * - GenerateSoundscapeSuggestionInput - The input type for the generateSoundscapeSuggestion function.
 * - GenerateSoundscapeSuggestionOutput - The return type for the generateSoundscapeSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSoundscapeSuggestionInputSchema = z.object({
  environmentDescription: z
    .string()
    .describe('A description of the user\'s current environment.'),
});
export type GenerateSoundscapeSuggestionInput = z.infer<
  typeof GenerateSoundscapeSuggestionInputSchema
>;

const GenerateSoundscapeSuggestionOutputSchema = z.object({
  suggestedSoundscapes: z
    .array(z.string())
    .describe(
      'An array of suggested soundscapes (rain, campfire, train, wind, thunderstorm) based on the environment description, optimized for focus, relaxation, or sleep.'
    ),
});
export type GenerateSoundscapeSuggestionOutput = z.infer<
  typeof GenerateSoundscapeSuggestionOutputSchema
>;

export async function generateSoundscapeSuggestion(
  input: GenerateSoundscapeSuggestionInput
): Promise<GenerateSoundscapeSuggestionOutput> {
  return generateSoundscapeSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSoundscapeSuggestionPrompt',
  input: {schema: GenerateSoundscapeSuggestionInputSchema},
  output: {schema: GenerateSoundscapeSuggestionOutputSchema},
  prompt: `You are an AI soundscape expert. Given the following environment description, suggest the best soundscapes from the list (rain, campfire, train, wind, thunderstorm) for focus, relaxation, or sleep. Only select soundscapes appropriate for the environment.

Environment Description: {{{environmentDescription}}}

Output the suggested soundscapes as a JSON array of strings.`,
});

const generateSoundscapeSuggestionFlow = ai.defineFlow(
  {
    name: 'generateSoundscapeSuggestionFlow',
    inputSchema: GenerateSoundscapeSuggestionInputSchema,
    outputSchema: GenerateSoundscapeSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
