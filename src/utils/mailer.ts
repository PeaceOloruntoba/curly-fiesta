import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT ? parseInt(env.SMTP_PORT, 10) : 587,
  auth: env.SMTP_USER && env.SMTP_PASS ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
});

export async function sendMail(to: string, subject: string, html: string) {
  if (!env.SMTP_HOST) {
    logger.warn({ to, subject }, 'SMTP not configured; skipping email send');
    return;
  }
  await transporter.sendMail({ from: env.EMAIL_FROM || 'no-reply@example.com', to, subject, html });
}

export async function sendOtpEmail(to: string, code: string) {
  const html = `<p>Your verification code is</p><h2>${code}</h2><p>This code expires soon.</p>`;
  await sendMail(to, 'Your Verification Code', html);
}

export async function sendResetEmail(to: string, token: string) {
  const html = `<p>Use this token to reset your password:</p><pre>${token}</pre>`;
  await sendMail(to, 'Password Reset', html);
}
