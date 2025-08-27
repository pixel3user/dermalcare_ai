// functions/src/flow.ts
import {googleAI} from "@genkit-ai/googleai";
import {genkit, z} from "genkit";
import {enableFirebaseTelemetry} from "@genkit-ai/firebase";
import {SPACE_BASE_URL, HF_TOKEN, API_NAME} from "./index";

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
    // --- START: Secret Value Validation ---
    const spaceBaseUrl = SPACE_BASE_URL.value();
    const hfToken = HF_TOKEN.value();
    const apiName = API_NAME.value();

    if (!spaceBaseUrl) {
      // This provides a clear error if a secret is missing.
      throw new Error(
        "Missing required secret SPACE_BASE_URL"
      );
    }
    if (!hfToken) {
      // This provides a clear error if a secret is missing.
      throw new Error(
        "Missing required secret HF_TOKEN"
      );
    }
    if (!apiName) {
      // This provides a clear error if a secret is missing.
      throw new Error(
        "Missing required secret API_NAME"
      );
    }
    // --- END: Secret Value Validation ---

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
