// functions/src/index.ts
import {onRequest} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import {dermacareFlow} from "./flow";
import {setGlobalOptions} from "firebase-functions";
import cors from "cors";

const corsHandler = cors({
  origin: ["https://<your-webapp-domain>", "http://localhost:3000"],
  methods: ["POST", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type"],
});

// Explicitly initialize with your Project ID to prevent any ambiguity.
admin.initializeApp({
  projectId: "dermalcare-69",
});

setGlobalOptions({region: "us-central1"});

export const dermacare = onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

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
  });
});
