import { processTelegramCallback } from "./_lib/telegram.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const update = req.body;

  try {
    // 🎛️ ЛОВИМО НАТИСКАННЯ КНОПОК
    if (update.callback_query) {
      const query = update.callback_query;
      const chatId = query.message.chat.id;
      const messageId = query.message.message_id;
      const callbackQueryId = query.id;
      const data = query.data;

      await processTelegramCallback(chatId, messageId, callbackQueryId, data);
    }
  } catch (error) {
    console.error("[Webhook Error]:", error);
  }

  return res.status(200).send("OK");
}
