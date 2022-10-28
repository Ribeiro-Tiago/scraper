import dayjs from "dayjs";

import { getLastEntry, updateLastEntry } from "./utils";
import { Scrapers } from "../types";

export const getLastPost = async () => {
	const post = await getLastEntry(Scrapers.CARGA_DE_TRABALHOS);

	if (!post) {
		return { link: null, updated: null };
	}

	return {
		link: post.link,
		updated: dayjs(post.updated ?? Date.now()),
	};
};

export const updateLastPost = async (link: string) => {
	return updateLastEntry(Scrapers.CARGA_DE_TRABALHOS, {
		link,
		updated: Date.now(),
	});
};
