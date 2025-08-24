import {setGlobalOptions} from "firebase-functions";
import {onFlowRequest} from "@genkit-ai/firebase/functions";

import {dermacareFlow} from "../../src/index.js";

setGlobalOptions({maxInstances: 10});

export const dermacare = onFlowRequest(dermacareFlow);

