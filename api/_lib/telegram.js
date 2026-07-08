/* eslint-env node */
export async function sendTelegramNotification(userId, isSolvent, answers, username) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  // 📸 Берём никнейм из env (или ставим заглушку, если забыли добавить)
  const instaUsername = process.env.INSTAGRAM_USERNAME || "your_nickname";

  if (!token || !chatId) {
    console.error("Telegram credentials missing");
    return null;
  }

  let message = `🚀 *Нова заповнена анкетка!*\n\n`;
  message += `👤 *Instagram ID:* \`${userId}\`\n`;
  message += `💰 *Тип ліда:* ${isSolvent ? "🟢 Цільовий" : "🟡 Нецільовий"}\n\n`;
  message += `📋 *Відповіді:* \n`;

  if (answers && typeof answers === "object") {
    Object.entries(answers).forEach(([question, answer]) => {
      message += `🔹 *${question}:* ${answer}\n`;
    });
  }

  // 🎛 Настройка инлайн-кнопок под сообщением
  const replyMarkup = {
    inline_keyboard: [
      // 1 ряд: Ссылка на инсту (работает сразу)
      [
        {
          text: "📸 Відкрити Instagram клієнта",
          url: `https://instagram.com/${username}`, // Відкриє профіль клієнта в додатку
        },
      ],
      // 2 ряд: Интерактивные кнопки статуса
      [
        { text: "✅ Підтвердили час", callback_data: `status_confirm:${userId}` },
        { text: "🟡 Нецільовий", callback_data: `status_nontarget:${userId}` },
      ],
      // 3 ряд: Кнопка удаления заявки из группы
      [{ text: "❌ Видалити", callback_data: `action_delete:${userId}` }],
    ],
  };

  return fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown",
      reply_markup: replyMarkup, // 🔥 Передаем кнопки в Телеграм
    }),
  });
}
