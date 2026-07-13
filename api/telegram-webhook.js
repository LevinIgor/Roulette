import { processTelegramCallback } from "./_lib/telegram.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const update = req.body;

  if (update && update.callback_query) {
    const callbackQuery = update.callback_query;
    const message = callbackQuery.message;

    const chatId = message.chat.id;
    const messageId = message.message_id;
    const callbackQueryId = callbackQuery.id;
    const data = callbackQuery.data;
    const originalText = message.text;

    await processTelegramCallback(chatId, messageId, callbackQueryId, data, originalText);
  }

  return res.status(200).json({ success: true });
}
