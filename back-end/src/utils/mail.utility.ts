import { Injectable } from "@nestjs/common";
import { Transporter, createTransport } from "nodemailer";

@Injectable()
export class MailUtility {
    private transporter: Transporter = createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: process.env.MAIL_SSL,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD,
        }
    });

    async sendMail(to: string, subject: string, text: string): Promise<void> {
        await this.transporter.sendMail({
            from: `"No Reply" <${process.env.MAIL_USER}>`,
            to,
            subject,
            text,
        })
    }
}