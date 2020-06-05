import { getLastEntry, updateLastEntry } from "./utils";

export const getLastPost = async () => {
	const post = await getLastEntry("cargadetrabalhos");

	return !!post ? post.link : null;
};

export const updateLastPost = async (link: string) => {
	return updateLastEntry("cargadetrabalhos", { link });
};
