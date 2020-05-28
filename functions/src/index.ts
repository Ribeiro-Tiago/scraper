import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { config as dotenv } from "dotenv";
import { resolve } from "path";

admin.initializeApp();

dotenv({ path: resolve(__dirname, "../.env") });

import CDT from "./scrapers/cargadetrabalhos";

export const cargaDeTrabalhos = functions
	.region("europe-west1")
	.pubsub.schedule("0 0 * * *")
	.timeZone("Europe/Belgium")
	.onRun(() => CDT());
