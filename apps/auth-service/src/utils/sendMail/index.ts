import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import ejs from 'ejs';
import path from 'path';

dotenv.config();

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  service: process.env.SMTP_SERVICE,
  secure: process.env.MAIL_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Render an EJS email template
const renderEmailTemplate = async (
  templatename: string,
  data: Record<string, any>
): Promise<string> => {
  try {
    const templatePath = path.join(
      process.cwd(),
      'apps',
      'auth-service',
      'src',
      'utils',
      'email_templates',
      `${templatename}.ejs`
    );
    return await ejs.renderFile(templatePath, data);
  } catch (err) {
    console.error('Template rendering error:', err);
    throw new Error(`Failed to render email template: ${templatename}`);
  }
};

// Send email using Nodemailer
export const sendEmail = async (
  to: string,
  subject: string,
  templatename: string,
  data: Record<string, any>
) => {
  try {
    const html = await renderEmailTemplate(templatename, data);
    const mailOptions = {
      from: `${process.env.SMTP_USER}`,
      to,
      subject,
      html,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};
