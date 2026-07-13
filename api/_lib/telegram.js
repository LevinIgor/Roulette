/* eslint-env node */
import { createClient } from "@supabase/supabase-js";

const TG_API_BASE = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

// Ініціалізація Supabase (використовує сервісну роль для безпечного запису)
const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
);

// --- 1. ГОЛОВНИЙ ХЕНДЛЕР КЛІКІВ (Опрацювання єдиної кнопки) ---
export async function processTelegramCallback(chatId, messageId, callbackQueryId, data) {
  const parts = data.split(":");
  const prefix = parts[0];

  // ✅ Кнопка "Опрацьовано" — просто чистить чат
  if (prefix === "action_processed") {
    await deleteMessageHelper(chatId, messageId);
    await answerCallbackQueryHelper(callbackQueryId, "Заявку видалено з чату");
  }
}

// --- 2. ВІДПРАВКА КАРТКИ ЛІДА ТА АВТОМАТИЧНИЙ ЗАПИС В БД ---
export async function sendTelegramNotification(userId, isSolvent, answers, username) {
  if (!isSolvent) return;

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("Telegram credentials missing (TOKEN or CHAT_ID)");
    return null;
  }

  // 1. Формуємо посилання на інстаграм клієнта
  const instaUrl = username
    ? `https://instagram.com/${username}`
    : `https://instagram.com/id_${userId}`;

  // 2. 🔥 МИТТЄВИЙ ЗАПИС В БАЗУ ДАНИХ (Відбувається автоматично при надходженні анкети)
  try {
    // Перевіряємо, чи існує вже такий користувач у таблиці users
    const { data: existingUser, error: userCheckError } = await supabase
      .from("users")
      .select("name")
      .eq("name", instaUrl)
      .maybeSingle();

    if (userCheckError) throw userCheckError;

    // Якщо користувача немає — створюємо його
    if (!existingUser) {
      const { error: userInsertError } = await supabase.from("users").insert([{ name: instaUrl }]);

      if (userInsertError) throw userInsertError;
      console.log(`[DB] Автоматично створено нового користувача: ${instaUrl}`);
    } else {
      console.log(`[DB] Користувач уже є в базі, дублювання users пропущено: ${instaUrl}`);
    }

    // У будь-якому випадку створюємо новий запис у consultations зі статусом "Підбираємо час"
    const { error: consultInsertError } = await supabase.from("consultations").insert([
      {
        user: instaUrl,
        status: "Підбираємо час",
        source: "Шорти",
      },
    ]);

    if (consultInsertError) throw consultInsertError;
    console.log(`[DB] Автоматично створено консультацію зі статусом "Підбираємо час"`);
  } catch (dbError) {
    // Логуємо помилку бази, але код не перериваємо, щоб картка в ТГ усе одно прилетіла
    console.error("Помилка автоматичного збереження в БД Supabase:", dbError);
  }

  // 3. ФОРМУВАННЯ ПОВІДОМЛЕННЯ ДЛЯ ГРУПИ
  let message = `🚀 <b>Лід для підбору часу</b>\n\n`;
  if (username) {
    message += `🏷️ <b>Нікнейм:</b> <a href="https://instagram.com/${username}">@${username}</a>\n`;
  }
  message += `📋 <b>Відповіді:</b> \n`;

  if (answers && typeof answers === "object") {
    Object.entries(answers).forEach(([question, answer]) => {
      message += `🔹 <b>${question}:</b> ${answer}\n`;
    });
  }

  // 🎛️ Залишаємо лише одну кнопку для видалення повідомлення
  const replyMarkup = {
    inline_keyboard: [
      [
        {
          text: "✅ Опрацьовано",
          callback_data: `action_processed:${userId}`,
        },
      ],
    ],
  };

  return fetch(`${TG_API_BASE}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: "html",
      disable_web_page_preview: true,
      reply_markup: replyMarkup,
    }),
  });
}

// --- 3. СИСТЕМНІ ХЕЛПЕРИ ТЕЛЕГРАМУ ---
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
