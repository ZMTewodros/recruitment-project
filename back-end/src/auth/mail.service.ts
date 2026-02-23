// mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ApplicationStatus } from '../applications/entities/applications.entity';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendStatusUpdateEmail(
    to: string,
    userName: string,
    jobTitle: string,
    status: ApplicationStatus,
  ) {
    let subject = '';
    let message = '';

    switch (status) {
      case ApplicationStatus.IN_REVIEW:
        subject = `Application Update: In Review for ${jobTitle}`;
        message = `Hi ${userName},\n\nGood news! An employer is currently reviewing your application for the ${jobTitle} position. We will notify you of any further updates.`;
        break;
      case ApplicationStatus.SHORTLISTED:
        subject = `Congratulations! You've been shortlisted for ${jobTitle}`;
        message = `Hi ${userName},\n\nGreat news! You have been shortlisted for the ${jobTitle} position. The employer will reach out to you soon for the next steps. Keep an eye on your dashboard!`;
        break;
      case ApplicationStatus.ACCEPTED:
        subject = `Application Accepted: ${jobTitle}`;
        message = `Hi ${userName},\n\nCongratulations! Your application for ${jobTitle} has been accepted. Welcome to the team!`;
        break;
      case ApplicationStatus.REJECTED:
        subject = `Update regarding your application for ${jobTitle}`;
        message = `Hi ${userName},\n\nThank you for your interest in the ${jobTitle} position. After careful consideration, the employer has decided to move forward with other candidates at this time. We wish you the best in your job search.`;
        break;
      default:
        return; // Don't send email for 'pending'
    }

    await this.sendEmail(to, subject, message);
  }

  async sendEmail(to: string, subject: string, text: string) {
    await this.transporter.sendMail({
      from: `"AfriHire" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
  }
}
