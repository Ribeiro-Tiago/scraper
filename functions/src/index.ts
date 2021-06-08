import "./firestore/utils";
import * as functions from "firebase-functions";

import CDT from "./scrapers/cargadetrabalhos";
import ELF from "./scrapers/elf";

export const cargaDeTrabalhos = functions.pubsub
	.schedule("0 0 * * *")
	.onRun(() => CDT());

export const elf = functions.pubsub.schedule("0 0 * * *").onRun(() => ELF());

// used for testing locally
// export const cargaDeTrabalhosRequest = functions.https.onRequest(() => CDT());

// export const elfRequest = functions.https.onRequest(() => ELF());
