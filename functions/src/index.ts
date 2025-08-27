// functions/src/index.ts
import {onRequest} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import {dermacareFlow} from "./flow";
import {setGlobalOptions} from "firebase-functions";

// Explicitly initialize with your Project ID to prevent any ambiguity.
admin.initializeApp({
  projectId: "dermalcare-69",
});

setGlobalOptions({region: "us-central1"});

export const dermacare = onRequest(async (req, res) => {
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
