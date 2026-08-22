import dotenv from 'dotenv'
dotenv.config()
import nodemailer from'nodemailer'

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		type: 'OAuth2',
		user: process.env.EMAIL_USER,
		clientId: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        
	},
});

// Optional connectivity check at startup
transporter.verify((error) => {
	if (error) {
		console.error('Email server connection failed:', error.message,error);
		return;
	}
	console.log('Email server is ready to send messages');
});

const sendEmail = async (to, subject, text, html) => {
	try {
		const info = await transporter.sendMail({
			from: `"discord" <${process.env.EMAIL_USER}>`,
			to,
			subject,
			text,
			html,
		});

		console.log('Message sent:', info.messageId);
	} catch (error) {
		console.error('Error sending email:', error.message);
		throw error;
	}
};

export default sendEmail