import Mailgun from 'mailgun.js';
import formData from 'form-data'
import { config } from 'dotenv';


config();
const mailgunClient = new Mailgun(formData);
const mgtest = mailgunClient.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY || " ",
    url: process.env.MAILGUN_URL
})

const sendTestMail = async (to: string, subject: string, text: string, html: string) => {
    const domain = "codlead.ma"
    const data = {
        from: `Noreply <no-reply@${domain}>`,
        to,
        subject,
        text,
        html,
    }

    try {
        const response = await mgtest.messages.create(domain, data);
        return response;
    } catch (error) {
        throw new Error(`Failed to send email: ${error}`);
    }
}

export default sendTestMail;
