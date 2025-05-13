'use server';

/**
 * @fileOverview A flow to fetch the price of a product from a URL using Browse.
 *
 * - fetchPriceFromURL - A function that handles the price fetching process.
 * - FetchPriceFromURLInput - The input type for the fetchPriceFromURL function.
 * - FetchPriceFromURLOutput - The return type for the fetchPriceFromURL function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FetchPriceFromURLInputSchema = z.object({
  url: z.string().describe('The URL of the product to fetch the price from.'),
});
export type FetchPriceFromURLInput = z.infer<typeof FetchPriceFromURLInputSchema>;

const FetchPriceFromURLOutputSchema = z.object({
  price: z.number().describe('The price of the product fetched from the URL.'),
});
export type FetchPriceFromURLOutput = z.infer<typeof FetchPriceFromURLOutputSchema>;

export async function fetchPriceFromURL(input: FetchPriceFromURLInput): Promise<FetchPriceFromURLOutput> {
  return fetchPriceFromURLFlow(input);
}

const getPriceFromURL = ai.defineTool({
  name: 'getPriceFromURL',
  description: 'Retrieves the price of a product from a given URL using web browsing.',
  inputSchema: z.object({
    url: z.string().describe('The URL of the product.'),
  }),
  outputSchema: z.number().describe('The price of the product.'),
},
async (input) => {
  // Implementation of the web scraping logic using Browse.
  // This is a placeholder; replace with actual scraping implementation.
  // The below return value is just to satisfy the typescript compiler.
  // A real implementation would scrape the URL and return the price as a number.
  return 0;
});

const prompt = ai.definePrompt({
  name: 'fetchPriceFromURLPrompt',
  input: {schema: FetchPriceFromURLInputSchema},
  output: {schema: FetchPriceFromURLOutputSchema},
  tools: [getPriceFromURL],
  prompt: `You are an assistant that retrieves the price of a product from a URL.

  The user will provide a URL. You should use the getPriceFromURL tool to get the price from the URL.
  Return the price in the output.
  URL: {{{url}}}
  `,
});

const fetchPriceFromURLFlow = ai.defineFlow(
  {
    name: 'fetchPriceFromURLFlow',
    inputSchema: FetchPriceFromURLInputSchema,
    outputSchema: FetchPriceFromURLOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
