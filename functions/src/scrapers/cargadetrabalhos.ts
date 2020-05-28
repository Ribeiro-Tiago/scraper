import fetch from "node-fetch";
import { JSDOM } from "jsdom";

import { sendEmail } from "../utils/mailer";
import { DateValidator } from "../types/cargadetrabalhos";

// hashmap to get the current-date.getMonth()-compatible month "number"
// according to the specified month name in portuguese
const months = new Map([
	["Janeiro", 0],
	["Fevereiro", 1],
	["Março", 2],
	["Abril", 3],
	["Maio", 4],
	["Junho", 5],
	["Julho", 6],
	["Agosto", 7],
	["Setembro", 8],
	["Outubro", 9],
	["Novembro", 10],
	["Dezembro", 11],
]);

const isNewPost = ({ post, today }: DateValidator): boolean => {
	const getMonthNumber = months.get(post.month);

	return today.month === getMonthNumber
		? parseInt(post.day) === today.day
		: false;
};

const url =
	"http://www.cargadetrabalhos.net:80/category/web-design-programacao?s=+freelance";

export default async () => {
	try {
		const result = await (await fetch(url)).text();

		/* today's date variables, to avoid having to define them every single iteration */
		const d = new Date();
		const today = {
			day: d.getDate(),
			month: d.getMonth(),
		};

		let postDate: string[];
		let link: string;
		let scraped = "";
		let elem;

		const elems = new JSDOM(result).window.document.querySelectorAll(
			".entrycontent",
		);

		for (elem of elems) {
			postDate = elem.querySelector(".date").textContent.split(" / ");

			if (
				!isNewPost({
					today,
					post: {
						day: postDate[0],
						month: postDate[1],
					},
				})
			) {
				break;
			}

			link = elem
				.querySelector(".pie")
				.querySelector("a")
				.getAttribute("href")
				.split("/print")[0];

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
