
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { firebase } from '@genkit-ai/firebase';

export const ai = genkit({
  plugins: [
    firebase(),
    googleAI({
        // apiKey: process.env.GEMINI_API_KEY, // The Firebase plugin configured above will configure the API key for you.
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
