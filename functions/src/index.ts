// functions/src/index.ts
import {onRequest} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import {dermacareFlow} from "./flow";
import {setGlobalOptions} from "firebase-functions";
import cors from "cors";

const allowedOrigins = [
  "https://dermalcare-69.web.app/",
  "http://localhost:3000",
];
const corsHandler = cors({
  origin: allowedOrigins,
  methods: ["POST", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type"],
});

// Explicitly initialize with your Project ID to prevent any ambiguity.
admin.initializeApp();

setGlobalOptions({region: "us-central1"});

export const dermacare = onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method === "OPTIONS") {
      res.status(204).send("");
      return;
    }

    const origin = req.headers.origin;
    if (!origin) {
      console.warn("Missing Origin header:", origin);
      res.status(401).json({
        error: "No origin",
        details: "Origin header is missing.",
      });
      return;
    }
    if (!allowedOrigins.includes(origin)) {
      console.warn("Rejected request from origin:", origin);
      res.status(403).json({
        error: "Forbidden",
        details: "Origin not allowed.",
      });
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
