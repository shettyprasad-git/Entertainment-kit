'use server';
/**
 * @fileOverview A Genkit flow for generating AI-powered movie and TV show recommendations based on a user's viewing history.
 *
 * - aiPoweredRecommendations - A function that handles the recommendation generation process.
 * - RecommendationInput - The input type for the aiPoweredRecommendations function.
 * - RecommendationOutput - The return type for the aiPoweredRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendationInputSchema = z.object({
  viewingHistory: z.array(
    z.object({
      title: z.string().describe("The title of the watched movie or TV show."),
      type: z.enum(['movie', 'tv']).describe("The type of content: 'movie' or 'tv'."),
      genres: z.array(z.string()).describe("A list of genres associated with the content."),
    })
  ).describe("A list of the user's previously watched movies and TV shows, including their titles, types, and genres."),
});
export type RecommendationInput = z.infer<typeof RecommendationInputSchema>;

const RecommendationOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      title: z.string().describe("The title of the recommended movie or TV show."),
      type: z.enum(['movie', 'tv']).describe("The type of content recommended: 'movie' or 'tv'."),
      reason: z.string().describe("A brief explanation for why this content is recommended based on the user's viewing history."),
    })
  ).describe("A list of recommended movies and TV shows, each with a title, type, and a reason for the recommendation."),
});
export type RecommendationOutput = z.infer<typeof RecommendationOutputSchema>;

export async function aiPoweredRecommendations(input: RecommendationInput): Promise<RecommendationOutput> {
  return aiPoweredRecommendationsFlow(input);
}

const recommendationPrompt = ai.definePrompt({
  name: 'recommendationPrompt',
  input: {schema: RecommendationInputSchema},
  output: {schema: RecommendationOutputSchema},
  prompt: `You are an expert movie and TV show recommender. Based on the provided viewing history, suggest 5 movies or TV shows the user might enjoy. For each recommendation, provide a title, whether it's a 'movie' or 'tv' show, and a brief reason for the recommendation based on their viewing preferences, focusing on themes, genres, and overall style.

Viewing History:
{{#each viewingHistory}}
- Title: {{{title}}} (Type: {{{type}}}, Genres: {{#each genres}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}})
{{/each}}

Please output the recommendations in JSON format matching the provided schema.`,
});

const aiPoweredRecommendationsFlow = ai.defineFlow(
  {
    name: 'aiPoweredRecommendationsFlow',
    inputSchema: RecommendationInputSchema,
    outputSchema: RecommendationOutputSchema,
  },
  async (input) => {
    const {output} = await recommendationPrompt(input);
    return output!;
  }
);
