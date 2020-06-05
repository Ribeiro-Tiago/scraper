import { db } from "../configs/index";

type Collection = "cargadetrabalhos";

const collection = (collection: Collection) => db.collection(collection);

export const getLastEntry = async (collName: Collection) => {
	return (await collection(collName).doc("entries").get()).data();
};

export const updateLastEntry = async (collName: Collection, data: object) => {
	return await collection(collName).doc("entries").set(data);
};
