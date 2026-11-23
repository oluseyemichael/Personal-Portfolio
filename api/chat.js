import { handleChat } from '../server/chat.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const { status, json } = await handleChat(req.body, ip);
  res.status(status).json(json);
}
