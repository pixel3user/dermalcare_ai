// functions/src/index.ts
import {onRequest} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import {dermacareFlow} from "./flow";
import {setGlobalOptions} from "firebase-functions";

admin.initializeApp();
// If you keep setGlobalOptions, use it so it isn't "unused"
setGlobalOptions({region: "asia-east1"}); // pick your region

export const dermacare = onRequest(async (req, res) => {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    res.status(401).json({error: "No auth token"});
    return;
  }

  const idToken = authHeader.substring(7);
  try {
    await admin.auth().verifyIdToken(idToken); // token valid
    const result = await dermacareFlow(req.body);
    res.json(result);
  } catch (error) {
    console.error("dermacare error:", error); // now it's “used”
    res.status(401).json({error: "Unauthorized"});
  }
});
