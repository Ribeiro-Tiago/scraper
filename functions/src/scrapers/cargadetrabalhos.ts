import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import dayjs, { Dayjs } from "dayjs";

import { emailRecipients, emailAdmin } from "../utils/mailer";
import { getLastPost, updateLastPost } from "../firestore/cargadetrabalhos";
import { Scrapers } from "../types";

const url =
	"http://www.cargadetrabalhos.net:80/category/web-design-programacao?s=+freelance";

const MONTH_MAPPER = {
	Janeiro: 1,
	Fevereiro: 2,
	Março: 3,
	Abril: 4,
	Maio: 5,
	Junho: 6,
	Julho: 7,
	Agosto: 8,
	Setembro: 9,
	Outubro: 10,
	Novembro: 11,
	Dezembro: 12,
} as { [month: string]: number };

const parseDate = (str: string): Dayjs => {
	const [day, month, year] = str.split(" / ");

	return dayjs(`${year}-${MONTH_MAPPER[month]}-${day}`);
};

export default async () => {
	try {
		const result = await (await fetch(url)).text();
		let link: string;
		let scraped = "";
		let elem: Element;
		let firstResultLink: string;
		let pie: Element;
		let date: Dayjs;

		const elems = new JSDOM(result).window.document.querySelectorAll(
			".entrycontent",
		);

		const { link: lastPostLink, updated } = await getLastPost();

		for (elem of elems) {
			pie = elem.querySelector(".pie");
			link = pie.querySelector("a").getAttribute("href").split("/print")[0];

			date = parseDate(pie.querySelector(".date").textContent);

			if (!firstResultLink) {
				firstResultLink = link;
			}

			if (lastPostLink === link || date.isBefore(updated, "day")) {
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

		await emailRecipients(
			Scrapers.CARGA_DE_TRABALHOS,
			"Scraper - carga de trabalhos",
			scraped,
		);
	} catch (err) {
		console.error("err during scrap", err);
		await emailAdmin("Scrapper error - carga de trabalhos", err as string);
	}
};
