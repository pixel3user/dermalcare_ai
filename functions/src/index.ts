import {setGlobalOptions} from "firebase-functions";
import {onFlowRequest} from "@genkit-ai/firebase/functions";
import {defineSecret} from "firebase-functions/params";

import {dermacareFlow} from "../../src/index.js";

setGlobalOptions({maxInstances: 10});

const SPACE_BASE_URL = defineSecret("SPACE_BASE_URL");
const API_NAME = defineSecret("API_NAME");
const HF_TOKEN = defineSecret("HF_TOKEN");

export const dermacare = onFlowRequest(dermacareFlow, {
  secrets: [SPACE_BASE_URL, API_NAME, HF_TOKEN],
});
