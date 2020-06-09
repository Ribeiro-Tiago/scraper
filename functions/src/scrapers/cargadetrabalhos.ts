import fetch from "node-fetch";
import { JSDOM } from "jsdom";

import { sendEmail } from "../utils/mailer";
import { getLastPost, updateLastPost } from "../firestore/cargadetrabalhos";

const url =
	"http://www.cargadetrabalhos.net:80/category/web-design-programacao?s=+freelance";

export default async () => {
	try {
		const result = await (await fetch(url)).text();
		let link: string;
		let scraped = "";
		let elem: Element;
		let firstResultLink: string;

		const elems = new JSDOM(result).window.document.querySelectorAll(
			".entrycontent",
		);

		const lastPostLink = await getLastPost();

		for (elem of elems) {
			link = elem
				.querySelector(".pie")
				.querySelector("a")
				.getAttribute("href")
				.split("/print")[0];

			if (!firstResultLink) {
				firstResultLink = link;
			}

			if (lastPostLink === link) {
				await updateLastPost(firstResultLink);
				break;
			}

			scraped += `<a href="${link}"><h2>${
				elem.querySelector("h2").textContent
			}</h2></a>`;
		}

		if (!scraped) {
			return;
		}

		await sendEmail("Scraper - carga de trabalhos", scraped);
	} catch (err) {
		sendEmail("Scrapper error - carga de trabalhos", err);
		console.error("err during scrap", err);
	}
};
