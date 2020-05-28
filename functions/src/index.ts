import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

import CDT from "./scrapers/cargadetrabalhos";

export const cargaDeTrabalhos = functions
	.region("europe-west1")
	.pubsub.schedule("0 0 * * *")
	.onRun(() => CDT());
