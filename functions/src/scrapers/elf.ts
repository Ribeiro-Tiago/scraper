import { JSDOM } from "jsdom";

import { emailRecipients, emailAdmin } from "../utils/mailer";
import { getLastPost, updateLastPost } from "../firestore";
import { Scrapers } from "../types";
import axios from "../utils/axios";

const url =
	"https://11.be/vacatures?f%5B0%5D=vacancy_region%3A28&f%5B1%5D=vacancy_region%3A30&f%5B2%5D=vacancy_sector%3A11&f%5B3%5D=vacancy_sector%3A12&f%5B4%5D=vacancy_sector%3A15&f%5B5%5D=vacancy_sector%3A16&f%5B6%5D=vacancy_sector%3A19&f%5B7%5D=vacancy_type%3A20";

export default async () => {
	try {
		const [result, lastDateChecked] = await Promise.all([
			axios.get<string, string>(url),
			getLastPost(Scrapers.ELF),
		]);

		let scraped = "";
		let elem: Element;

		const elems = new JSDOM(result).window.document
			.querySelector(".view-vacancy-overview")
			.querySelectorAll(".views-row");

		let link: string;
		let title: string;
		let date: string;
		let company: string;
		let location: string;
		let type: string;
		let sector: string;
		let filters: Element;

		for (elem of elems) {
			date = elem
				.querySelector(".field--name-field-date")
				.textContent.split(" ")[2];

			if (date === lastDateChecked) {
				await updateLastPost(Scrapers.ELF, date);
				break;
			}

			link = elem.querySelector("a").getAttribute("href");
			title = elem.querySelector("h3").textContent;

			company = elem.querySelector(".field--name-field-employer").textContent;

			filters = elem.querySelector(".vacancy-filters");

			location =
				filters.querySelector(".field--name-field-vacancy-address")
					.textContent || "No location specified";

			type = filters.querySelector(
				".field--name-field-vacancy-statute",
			).textContent;

			sector = filters.querySelector(
				".field--name-field-vacancy-sector",
			).textContent;

			if (scraped) {
				scraped += "<hr/>";
			}

			scraped += `<a href="${link}">
        <h2 style="margin-bottom:0;>${title} - ${company}</h2>
        <p>${location} - ${type} - ${sector}      
      </a>`;
		}

		if (!scraped) {
			return;
		}

		await emailRecipients(Scrapers.ELF, "Scraper - 11.be", scraped);
	} catch (err) {
		console.error("err during scrap", err);
		await emailAdmin("Scrapper error - elf", err);
	}
};
