import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Use GEMINI_API_KEY if available, otherwise fall back to the Firebase API key.
// This ensures Genkit works both locally and on Vercel.
const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: apiKey,
    }),
  ],
  model: 'googleai/gemini-2.5-flash',
});
