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
