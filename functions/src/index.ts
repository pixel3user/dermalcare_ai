import {setGlobalOptions} from "firebase-functions";
import {onRequest} from "firebase-functions/v2/https";
import {defineSecret} from "firebase-functions/params";

import {dermacareFlow} from "./flow";

const SPACE_BASE_URL = defineSecret("SPACE_BASE_URL");
const API_NAME = defineSecret("API_NAME");
const HF_TOKEN = defineSecret("HF_TOKEN");

setGlobalOptions({
  maxInstances: 10,
  secrets: [SPACE_BASE_URL, API_NAME, HF_TOKEN],
});

export const dermacare = onRequest(async (req, res) => {
  const result = await dermacareFlow(req.body);
  res.json(result);
});


// No need for setGlobalOptions or defineSecret here,
// they are handled by the runtime when you deploy.

// Define the runtime options for this specific function
const runtimeOpts = {
  memory: "1GiB" as const, // Allocate 1 GiB of memory
  timeoutSeconds: 120, // Set a 2-minute timeout
  secrets: ["SPACE_BASE_URL", "API_NAME", "HF_TOKEN"], // Declare secrets
};

// Apply the runtime options directly to the onRequest function
export const dermacare = onRequest(runtimeOpts, async (req, res) => {
  // It's good practice to handle potential errors
  try {
    // Check if the request body is valid before calling the flow
    if (!req.body || !req.body.question) {
      res.status(400).json({error: "Missing 'question' in request body."});
      return;
    }

    const result = await dermacareFlow(req.body);
    res.json(result);
  } catch (error) {
    console.error("Error executing flow:", error);
    res.status(500).json({error: "An internal server error occurred."});
  }
});
