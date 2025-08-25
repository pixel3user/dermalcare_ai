import {googleAI} from "@genkit-ai/googleai";
import {genkit, z} from "genkit";
// CHANGE 1: We no longer import Client and handleFile from here.
import "dotenv/config";
import {enableFirebaseTelemetry} from "@genkit-ai/firebase";

enableFirebaseTelemetry();

const ai = genkit({
  plugins: [googleAI()],
  model: googleAI.model("gemini-1.5-flash", {
    temperature: 0.8,
  }),
});

const DermacareInputSchema = z.object({
  question: z.string().describe("User question about skin issues"),
  image: z.string().optional().describe("Optional path or URL to an image"),
});

const DermacareOutputSchema = z.object({
  answer: z.string(),
});

export const dermacareFlow = ai.defineFlow(
  {
    name: "dermacareFlow",
    inputSchema: DermacareInputSchema,
    outputSchema: DermacareOutputSchema,
  },
  async ({question, image}) => {
    // CHANGE 2: We dynamically import the library here, inside the function.
    const {Client, handle_file: handleFile} = await import("@gradio/client");

    const app = await Client.connect(process.env.SPACE_BASE_URL!, {
      hf_token: process.env.HF_TOKEN,
    });

    const result = await app.predict(process.env.API_NAME!, {
      image: image ? handleFile(image) : null,
      question,
      temperature: 0.7,
      top_p: 0.95,
      max_tokens: 256,
    });

    const answer = (result.data?.[0] as string) || "";
    return {answer};
  }
);
