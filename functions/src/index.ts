import * as functions from "firebase-functions";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { createTransport } from "nodemailer";
import cors from "cors";

import { ResultObj } from "../types/index";

cors({ origin: true });

// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

/* hashmap to get the current-date.getMonth()-compatible month "number" according to the specified month name in portuguese */
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

/**
 * Checks the post date to see if it was created today or not. Seeing as we're only interested in posts from today
 * @param {string[]} date - an array containing date we want to check against today's date
 * @param {number} currDay - current day
 * @param {number} currDay - current month (index)
 * @returns {boolean} true if the post was created today, false otherwise
 */
const isNewPost = (
	date: string[],
	currDay: number,
	currMonth: number,
): boolean => {
	const getMonthIndex = months.get(date[1].trim());

	if (currMonth === getMonthIndex) {
		return parseInt(date[0]) === currDay;
	}

	return false;
};

const sendEmail = async (subject: string, isErr: boolean, payload: any) => {
	const mailOptions = {
		from: process.env.EMAIL_USER,
		to: process.env.TO,
		subject,
		html: isErr
			? payload
			: payload.map((item) => {
					return `<a href="${item.link}">${item.title} - ${item.contractType}</a>`;
			  }),
	};

	const transporter = createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASSWORD,
		},
	});

	await transporter.sendMail(mailOptions);
};
export const crawl = functions
	.region("europe-west1")
	.https.onRequest(async (req, res) => {
		try {
			const result = await (
				await fetch(
					"http://www.cargadetrabalhos.net:80/category/web-design-programacao?s=+freelance",
				)
			).text();
			const results: ResultObj[] = [];
			/* today's date variables, to avoid having to define them every single iteration */
			const d = new Date();
			const currDay = d.getDate();
			const currMonth = d.getMonth();

			let date: string;
			let pElems: any;
			let bElems: any;
			let contractType: string;
			let local: string;
			let link: string;

			new JSDOM(result).window.document
				.querySelectorAll(".entrycontent")
				.forEach((elem) => {
					date = (elem.querySelector(".date") as HTMLAnchorElement)
						.textContent as string;

					if (!isNewPost(date.split("/"), currDay, currMonth)) {
						return;
					}

					pElems = elem.querySelectorAll("p");
					bElems = pElems[pElems.length - 3].querySelectorAll("b");
					contractType = bElems[2] && bElems[2].textContent;
					local = bElems[1].textContent;
					link = elem
						.querySelector(".pie")
						.querySelector("a")
						.getAttribute("href")
						.split("/print")[0];

					results.push({
						title: elem.querySelector("h2").textContent,
						contractType,
						local,
						link,
					});
				});

			sendEmail("Crawler - carga de trabalhos", false, results);
			res.status(200).json(results);
		} catch (err) {
			sendEmail("Crawler error - carga de trabalhos", true, err);
			console.error("err during crawl", err);
			res.status(500).json(err);
		}
	});
