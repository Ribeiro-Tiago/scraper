import { db } from "../configs/index";
import { Scrapers } from "../types";

type Collection = "scrapers" | "recipients";

const collection = (collection: Collection) => db.collection(collection);

export const getLastEntry = async (scraper: Scrapers) => {
	return (await collection("scrapers").doc(scraper).get()).data();
};

export const updateLastEntry = async (scraper: Scrapers, data: object) => {
	return await collection("scrapers").doc(scraper).set(data);
};

export const getRecipients = async (scraper: Scrapers) => {
	return (
		await collection("recipients")
			.where("scrapers", "array-contains", scraper)
			.get()
	).docs.map((doc) => doc.data().email);
};
