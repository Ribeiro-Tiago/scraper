import "./firestore/utils";
import * as functions from "firebase-functions";

import CDT from "./scrapers/cargadetrabalhos";

export const cargaDeTrabalhos = functions
	.region("europe-west1")
	.pubsub.schedule("0 0 * * *")
	.onRun(() => CDT());

export const cargaDeTrabalhosRequest = functions
	.region("europe-west1")
	.https.onRequest(() => CDT());
