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

export async function sendSubscriptionNotice(to: string, type: 'trial_started' | 'sub_active' | 'sub_canceled' | 'payment_required', meta?: Record<string, any>) {
  let subject = 'Subscription Update';
  let html = '<p>Your subscription status changed.</p>';
  if (type === 'trial_started') { subject = 'Your trial has started'; html = `<p>Your ${meta?.trial_days ?? 7}-day trial is now active.</p>`; }
  if (type === 'sub_active') { subject = 'Subscription active'; html = `<p>Your subscription is active. Plan: ${meta?.plan ?? ''}.</p>`; }
  if (type === 'sub_canceled') { subject = 'Subscription canceled'; html = `<p>Your subscription has been canceled. You will retain access until ${meta?.current_period_end ?? 'the end of your period'}.</p>`; }
  if (type === 'payment_required') { subject = 'Payment required'; html = `<p>Your subscription payment is required to continue access.</p>`; }
  await sendMail(to, subject, html);
}
