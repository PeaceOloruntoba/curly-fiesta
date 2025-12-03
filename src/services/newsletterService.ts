import { query } from '../db/pool.js';
import { sendMail } from '../utils/mailer.js';
import { logger } from '../config/logger.js';

export type CreateNewsletterInput = {
  title: string;
  body_html: string;
  is_admin_only?: boolean;
  exclude_user_ids?: string[];
};

export async function createAndSend(input: CreateNewsletterInput) {
  const { title, body_html, is_admin_only = false, exclude_user_ids = [] } = input;

  const { rows } = await query<{ id: string }>(
    'INSERT INTO newsletters(title, body_html, is_admin_only) VALUES($1,$2,$3) RETURNING id',
    [title, body_html, is_admin_only]
  );
  const newsletterId = rows[0].id;

  // Build recipients list: all users unless excluded
  let sql = `SELECT id, email FROM users WHERE deleted_at IS NULL`;
  const params: any[] = [];
  if (exclude_user_ids.length) {
    // Create parameter placeholders dynamically
    const placeholders = exclude_user_ids.map((_id, i) => `$${i + 1}`).join(',');
    sql += ` AND id NOT IN (${placeholders})`;
    params.push(...exclude_user_ids);
  }
  // Prefer verified users only
  sql += ' AND verified_at IS NOT NULL';

  const rec = await query<{ id: string; email: string }>(sql, params);
  const recipients = rec.rows;

  let sent = 0;
  for (const r of recipients) {
    try {
      await sendMail(r.email, title, body_html);
      sent++;
    } catch (err) {
      logger.error({ err, to: r.email, newsletterId }, 'Failed to send newsletter email');
    }
  }
  return { id: newsletterId, recipients: recipients.length, sent } as const;
}

export async function listNewsletters(limit = 50) {
  const { rows } = await query<{ id: string; title: string; created_at: string; is_admin_only: boolean }>(
    'SELECT id, title, created_at, is_admin_only FROM newsletters ORDER BY created_at DESC LIMIT $1',
    [limit]
  );
  return rows;
}
