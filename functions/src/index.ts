import {onRequest} from "firebase-functions/v2/https";
import {defineSecret} from "firebase-functions/params";
import * as admin from "firebase-admin";
import {dermacareFlow} from "./flow";

export const SPACE_BASE_URL = defineSecret("SPACE_BASE_URL");
export const HF_TOKEN = defineSecret("HF_TOKEN");
export const API_NAME = defineSecret("API_NAME");

// Explicitly initialize with your Project ID to prevent any ambiguity.
admin.initializeApp({
  projectId: "dermacare-69",
});

export const dermacare = onRequest(
  {region: "us-central1", secrets: [SPACE_BASE_URL, HF_TOKEN, API_NAME]},
  async (req, res) => {
    const authHeader = req.headers.authorization || "";

    // Make the check case-insensitive to be more robust.
    if (!authHeader.toLowerCase().startsWith("bearer ")) {
      res.status(401).json({
        error: "No auth token",
        details: "Authorization header is missing or no start with 'Bearer '.",
      });
      return;
    }

    const idToken = authHeader.substring(7);

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      console.log("Successfully authenticated user:", decodedToken.uid);

      const result = await dermacareFlow(req.body);
      res.json(result);
    } catch (error) {
      // FIX: Cast the 'unknown' error to the 'Error' type
      const typedError = error as Error;

      console.error("Token verification failed:", typedError);
      res.status(401).json({
        error: "Unauthorized",
        // Now you can safely access the message property
        details: typedError.message,
      });
    }
  }
);
