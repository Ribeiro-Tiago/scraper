import { createTransport } from "nodemailer";
import { config } from "firebase-functions";

import { Scrapers } from "../types";
import { getRecipients } from "../firestore/utils";

export const sendEmail = async (
	subject: string,
	html: string,
	destination: string,
) => {
	const mailOptions = {
		from: `Tiago Ribeiro <${config().email.address}>`,
		to: destination,
		subject,
		html,
	};

	const transporter = createTransport({
		host: config().email.host,
		port: Number(config().email.port),
		secure: true,
		auth: {
			user: config().email.address,
			pass: config().email.password,
		},
	});

	return await transporter.sendMail(mailOptions);
};

export const emailRecipients = async (
	scraper: Scrapers,
	subject: string,
	html: string,
) => {
	const recepients = await getRecipients(scraper);

	if (!recepients.length) {
		console.log("No recipients found");
		return;
	}

	await Promise.all([
		recepients.map((email) => sendEmail(subject, html, email)),
	]);

	console.log("Sent email to all recipients");
};

export const emailAdmin = async (subject: string, html: string) => {
	return await sendEmail(subject, html, config().email.to);
};
