import { db } from "../configs/index";
import { Scrapers } from "../types";

type Collection = "cargadetrabalhos" | "recipients";

const collection = (collection: Collection) => db.collection(collection);

export const getLastEntry = async (collName: Collection) => {
	return (await collection(collName).doc("entries").get()).data();
};

export const updateLastEntry = async (collName: Collection, data: object) => {
	return await collection(collName).doc("entries").set(data);
};

export const getRecipients = async (scraper: Scrapers) => {
	return (
		await collection("recipients")
			.where("scrapers", "array-contains", scraper)
			.get()
	).docs.map((doc) => doc.data().email);
};
