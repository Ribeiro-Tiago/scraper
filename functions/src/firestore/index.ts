import { Scrapers } from "../types";
import { getLastEntry, updateLastEntry } from "./utils";

export const getLastPost = async (type: Scrapers) => {
	const post = await getLastEntry(type);

	return !!post ? post.lastDateChecked : null;
};

export const updateLastPost = async (type: Scrapers, date: string) => {
	return updateLastEntry(type, { date });
};
