import "./firestore/utils";
import * as functions from "firebase-functions";

import CDT from "./scrapers/cargadetrabalhos";

export const cargaDeTrabalhos = functions
	.pubsub.schedule("0 0 * * *")
	.onRun(() => CDT());

export const cargaDeTrabalhosRequest = functions
	.https.onRequest(() => CDT());
