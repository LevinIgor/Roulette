/* eslint-env node */

const TG_API_BASE = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

// --- 1. ГОЛОВНИЙ ХЕНДЛЕР КЛІКІВ (Для роботи кнопок) ---
export async function processTelegramCallback(
  chatId,
  messageId,
  callbackQueryId,
  data,
  originalText,
) {
  const [prefix] = data.split(":");

  if (prefix === "status_confirm" || prefix === "status_nontarget") {
    const statusText = prefix === "status_confirm" ? "✅ Підтверджено час" : "🟡 Нецільовий лід";
    await updateMessageStatusOnTelegram(
      chatId,
      messageId,
      callbackQueryId,
      statusText,
      originalText,
    );
  }

  if (prefix === "action_delete") {
    await deleteMessageFromTelegram(chatId, messageId, callbackQueryId);
  }
}

// --- 2. ВНУТРІШНЯ ЛОГІКА ЗМІНИ СТАТУСІВ ТА ВИДАТЛЕННЯ ---
async function updateMessageStatusOnTelegram(
  chatId,
  messageId,
  callbackQueryId,
  statusText,
  originalText,
) {
  const newText = `${originalText}\n\n👉 *Статус:* ${statusText}`;
  const newReplyMarkup = {
    inline_keyboard: [[{ text: "❌ Видалити", callback_data: `action_delete:${statusText}` }]],
  };
  await editMessageTextHelper(chatId, messageId, newText, newReplyMarkup);
  await answerCallbackQueryHelper(callbackQueryId, `${statusText} збережено!`);
}

async function deleteMessageFromTelegram(chatId, messageId, callbackQueryId) {
  await deleteMessageHelper(chatId, messageId);
  await answerCallbackQueryHelper(callbackQueryId, "Заявку видалено");
}

// --- 3. ТВІЙ ОНОВЛЕНИЙ КОД ВІДПРАВКИ (З інтеграцією нікнейма) ---
export async function sendTelegramNotification(userId, isSolvent, answers, username) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("Telegram credentials missing");
    return null;
  }

  let message = `🚀 *Нова заповнена анкета!*\n\n`;
  message += `👤 *Instagram ID:* \`${userId}\`\n`;
  if (username) {
    message += `🏷️ *Нікнейм:* @${username}\n`; // Додали нікнейм у текст для зручності
  }
  message += `💰 *Тип ліда:* ${isSolvent ? "🟢 Цільовий" : "🟡 Нецільовий"}\n\n`;
  message += `📋 *Відповіді:* \n`;

  if (answers && typeof answers === "object") {
    Object.entries(answers).forEach(([question, answer]) => {
      message += `🔹 *${question}:* ${answer}\n`;
    });
  }

  const replyMarkup = {
    inline_keyboard: [
      [
        {
          text: "📸 Відкрити Instagram клієнта",
          url: username ? `https://instagram.com/${username}` : `https://instagram.com/`, // Захист на випадок, якщо нікнейм не прийшов
        },
      ],
      [
        { text: "✅ Підтвердили час", callback_data: `status_confirm:${userId}` },
        { text: "🟡 Нецільовий", callback_data: `status_nontarget:${userId}` },
      ],
      [{ text: "❌ Видалити", callback_data: `action_delete:${userId}` }],
    ],
  };

  return fetch(`${TG_API_BASE}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown",
      reply_markup: replyMarkup,
    }),
  });
}

// --- 4. СИСТЕМНІ ХЕЛПЕРИ ДЛЯ ВЗАЄМОДІЇ З API ТЕЛЕГРАМУ ---
async function editMessageTextHelper(chatId, messageId, newText, newReplyMarkup) {
  return fetch(`${TG_API_BASE}/editMessageText`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      message_id: messageId,
      text: newText,
      parse_mode: "Markdown",
      reply_markup: newReplyMarkup,
    }),
  });
}

async function deleteMessageHelper(chatId, messageId) {
  return fetch(`${TG_API_BASE}/deleteMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, message_id: messageId }),
  });
}

async function answerCallbackQueryHelper(callbackQueryId, text) {
  return fetch(`${TG_API_BASE}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackQueryId, text: text }),
  });
}
