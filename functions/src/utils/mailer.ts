import { createTransport } from "nodemailer";
import { config } from "firebase-functions";

export const sendEmail = async (subject: string, html: string) => {
	const mailOptions = {
		from: `Tiago Ribeiro <${config().email.address}>`,
		to: config().email.to,
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
