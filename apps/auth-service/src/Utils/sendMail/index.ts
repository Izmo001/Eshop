import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import ejs from 'ejs';
import path from 'path';

dotenv.config();
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Render an EJS email template
const renderEmailTemplate = async (
    templateName:string, data: Record<string, unknown>
): Promise<string> => {
    const templatePath = path.join(
        process.cwd(),
        "apps",
        'auth-service',
        'apps/auth-service',
        "src",
        "Utils",
        'email-templates',
        `${templateName}.ejs`
    );
    return ejs.renderFile(templatePath, data);
}; 
// Send an email using the transporter from nodemailer
const sendEmail = async ( to: string, subject: string, templateName: string, data: Record<string, unknown>) => {
    try {
        const html = await renderEmailTemplate(templateName, data);
        const mailOptions = {
            from: process.env.SMTP_USER,
            to,
            subject,
            html,
        };
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully'); 
        return true;
    }
    catch (error) { 

        console.error('Error sending email:', error);
        return false;
    }
}
export { sendEmail, renderEmailTemplate };



