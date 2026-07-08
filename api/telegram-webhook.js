import { processTelegramCallback } from "./_lib/telegram.js";

export default async function handler(req, res) {
  // Ми приймаємо тільки POST від Телеграму
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Телеграм присилає всю інформацію про клік у тілі запиту
  const update = req.body;

  // Нас цікавить тільки блок `callback_query`, якщо людина натиснула кнопку
  if (update && update.callback_query) {
    const callbackQuery = update.callback_query;
    const message = callbackQuery.message;

    // Дістаємо всі потрібні ID та дані
    const chatId = message.chat.id;
    const messageId = message.message_id;
    const callbackQueryId = callbackQuery.id;
    const data = callbackQuery.data; // Наприклад: 'status_confirm:user123'
    const originalText = message.text; // Поточний текст повідомлення

    console.log(`Telegram Callback: action=${data}, messageId=${messageId}`);

    // Передаємо на обробку в наш внутрішній модуль (З Кроку 1)
    await processTelegramCallback(chatId, messageId, callbackQueryId, data, originalText);
  }

  // Завжди повертаємо Телеграму 200 OK, щоб вони не пробували перевідправляти
  return res.status(200).json({ success: true });
}
