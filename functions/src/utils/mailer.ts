import { createTransport } from "nodemailer";

export const sendEmail = async (subject: string, html: string) => {
	const mailOptions = {
		from: `Tiago Ribeiro <${process.env.EMAIL}>`,
		to: process.env.TO,
		subject,
		html,
	};

	const transporter = createTransport({
		host: process.env.HOST,
		port: Number(process.env.PORT),
		secure: true,
		auth: {
			user: process.env.EMAIL,
			pass: process.env.PASSWORD,
		},
	});

	return await transporter.sendMail(mailOptions);
};
