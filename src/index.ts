import { googleAI } from '@genkit-ai/googleai';
import { genkit, z } from 'genkit';
import { Client, handle_file } from '@gradio/client';
import 'dotenv/config';
import { enableFirebaseTelemetry } from '@genkit-ai/firebase';

enableFirebaseTelemetry();
// Initialize Genkit with the Google AI plugin
const ai = genkit({
  plugins: [googleAI()],
  model: googleAI.model('gemini-2.5-flash', {
    temperature: 0.8
  }),
});

// Define input schema for DermalCare LLM
const DermacareInputSchema = z.object({
  question: z.string().describe('User question about skin issues'),
  image: z.string().optional().describe('Optional path or URL to an image'),
});

// Define output schema for DermalCare LLM
const DermacareOutputSchema = z.object({
  answer: z.string(),
});

// Define a flow that calls the DermalCare LLM hosted on Hugging Face Spaces
export const dermacareFlow = ai.defineFlow(
  {
    name: 'dermacareFlow',
    inputSchema: DermacareInputSchema,
    outputSchema: DermacareOutputSchema,
  },
  async ({ question, image }) => {
    const app = await Client.connect('ColdSlim/DermalCare', {
      hf_token: process.env.HF_TOKEN,
    });

    const result = await app.predict('/generate_answer', {
      image: image ? handle_file(image) : null,
      question,
      temperature: 0.7,
      top_p: 0.95,
      max_tokens: 256,
    });

    const answer = (result.data?.[0] as string) || '';
    return { answer };
  }
);

// Run the flow
async function main() {
  return
}

main().catch(console.error);