import nodemailer from 'nodemailer'
import { env } from '../config/env.config'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS
    }
});

export const sendEmail = async (to: string, subject: string, text: string, html?: string): Promise<void> => {
    await transporter.sendMail({
        from: env.EMAIL_USER,
        to,
        subject,
        text,
        html,
    })
}