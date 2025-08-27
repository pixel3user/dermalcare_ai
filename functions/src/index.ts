import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { defineSecret } from "firebase-functions/params";
import { dermacareFlow } from "./flow";

admin.initializeApp();

export const dermacare = onRequest(async (req, res) => {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "No auth token" });
    return;
  }

  const idToken = authHeader.substring(7);
  try {
    await admin.auth().verifyIdToken(idToken);   // token valid
    const result = await dermacareFlow(req.body);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
  }
});
