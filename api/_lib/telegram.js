export async function sendTelegramNotification(userId, isSolvent, answers) {
  return;
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("Telegram credentials missing");
    return null;
  }

  // Форматуємо текст повідомлення
  let message = `🚀 *Нова заповнена анкетка!*\n\n`;
  message += `👤 *Instagram ID:* \`${userId}\`\n`;
  message += `💰 *Тип ліда:* ${isSolvent ? "🟢 Цільовий" : "🟡 Нецільовий"}\n\n`;
  message += `📋 *Відповіді:* \n`;

  if (answers && typeof answers === "object") {
    Object.entries(answers).forEach(([question, answer]) => {
      message += `🔹 *${question}:* ${answer}\n`;
    });
  }

  return fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown",
    }),
  });
}
