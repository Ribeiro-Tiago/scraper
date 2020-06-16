import { getLastEntry, updateLastEntry } from "./utils";
import { Scrapers } from "../types";

export const getLastPost = async () => {
	const post = await getLastEntry(Scrapers.CARGA_DE_TRABALHOS);

	return !!post ? post.link : null;
};

export const updateLastPost = async (link: string) => {
	return updateLastEntry(Scrapers.CARGA_DE_TRABALHOS, { link });
};
