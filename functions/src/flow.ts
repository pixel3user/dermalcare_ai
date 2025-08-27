// functions/src/flow.ts
import {googleAI} from "@genkit-ai/googleai";
import {genkit, z} from "genkit";
import "dotenv/config"; // For local development only
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
    // --- START: Environment Variable Validation ---
    const spaceBaseUrl = process.env.SPACE_BASE_URL;
    const hfToken = process.env.HF_TOKEN;
    const apiName = process.env.API_NAME;

    if (!spaceBaseUrl) {
      // This provides a clear error if a variable is missing.
      throw new Error(
        "Missing required environment spaceurl"
      );
    }
    if (!hfToken) {
      // This provides a clear error if a variable is missing.
      throw new Error(
        "Missing required environment hftoken"
      );
    }
    if (!apiName) {
      // This provides a clear error if a variable is missing.
      throw new Error(
        "Missing required environment apiname"
      );
    }
    // --- END: Environment Variable Validation ---

    const {Client, handle_file: handleFile} = await import("@gradio/client");

    const app = await Client.connect(spaceBaseUrl, {
      hf_token: hfToken,
    });

    const result = await app.predict(apiName, {
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
