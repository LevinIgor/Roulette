/* eslint-env node */
import { createClient } from "@supabase/supabase-js";

const TG_API_BASE = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

// Ініціалізація Supabase (використовує сервісну роль для безпечного запису без політик RLS)
const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
);

// --- 1. ГОЛОВНИЙ ХЕНДЛЕР КЛІКІВ ---
export async function processTelegramCallback(chatId, messageId, callbackQueryId, data) {
  const parts = data.split(":");
  const prefix = parts[0];

  // 📞 Кнопка "Дзвінок призначено"
  if (prefix === "call_assigned") {
    const userId = parts[1];
    const username = parts[2] !== "none" ? parts[2] : null;

    // Формуємо посилання на інстаграм, як у старій базі даних
    const instaUrl = username
      ? `https://instagram.com/${username}`
      : `https://instagram.com/id_${userId}`;

    try {
      // 1. Перевіряємо, чи існує вже такий користувач у таблиці users
      const { data: existingUser, error: userCheckError } = await supabase
        .from("users")
        .select("name")
        .eq("name", instaUrl)
        .maybeSingle();

      if (userCheckError) throw userCheckError;

      // 2. Якщо користувача немає — створюємо його
      if (!existingUser) {
        const { error: userInsertError } = await supabase
          .from("users")
          .insert([{ name: instaUrl }]);

        if (userInsertError) throw userInsertError;
        console.log(`[DB] Створено нового користувача: ${instaUrl}`);
      } else {
        console.log(`[DB] Користувач уже існує в базі: ${instaUrl}`);
      }

      // 3. У будь-якому випадку створюємо новий запис у таблиці consultations
      const { error: consultInsertError } = await supabase.from("consultations").insert([
        {
          user: instaUrl,
          status: "Дзвінок призначено",
          source: "Шорти",
        },
      ]);

      if (consultInsertError) throw consultInsertError;
      console.log(`[DB] Створено консультацію зі статусом "Дзвінок призначено"`);

      // 4. Сповіщаємо менеджера у спливаючому вікні та видаляємо повідомлення з групи
      await answerCallbackQueryHelper(callbackQueryId, "Дзвінок зафіксовано в базі! ✅");
      await deleteMessageHelper(chatId, messageId);
    } catch (dbError) {
      console.error("Помилка роботи з базою даних Supabase:", dbError);
      await answerCallbackQueryHelper(callbackQueryId, "⚠️ Помилка збереження в БД!");
    }
  }

  // ❌ Кнопка "Видалити"
  if (prefix === "action_delete") {
    await deleteMessageHelper(chatId, messageId);
    await answerCallbackQueryHelper(callbackQueryId, "Заявку видалено з чату");
  }
}

// --- 2. ВІДПРАВКА КАРТКИ ЛІДА В ГРУПУ ---
export async function sendTelegramNotification(userId, isSolvent, answers, username) {
  if (!isSolvent) return;

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("Telegram credentials missing (TOKEN or CHAT_ID)");
    return null;
  }

  let message = `🚀 <b>Нова заповнена анкета!</b>\n\n`;
  if (username) {
    message += `🏷️ <b>Нікнейм:</b> <a href="https://instagram.com/${username}">@${username}</a>\n`;
  }
  message += `💰 <b>Тип ліда:</b> ${isSolvent ? "🟢 Цільовий" : "🟡 Нецільовий"}\n\n`;
  message += `📋 <b>Відповіді:</b> \n`;

  if (answers && typeof answers === "object") {
    Object.entries(answers).forEach(([question, answer]) => {
      message += `🔹 <b>${question}:</b> ${answer}\n`;
    });
  }

  // 🎛️ Рівно дві кнопки в один ряд для компактності та швидкості роботи
  const replyMarkup = {
    inline_keyboard: [
      [
        {
          text: "📞 Дзвінок призначено",
          callback_data: `call_assigned:${userId}:${username || "none"}`,
        },
        {
          text: "❌ Видалити",
          callback_data: `action_delete:${userId}`,
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
