import { createClient } from "@supabase/supabase-js";

const TG_API_BASE = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
);

export async function processTelegramCallback(chatId, messageId, callbackQueryId, data) {
  const parts = data.split(":");
  const prefix = parts[0];

  if (prefix === "action_processed") {
    await deleteMessageHelper(chatId, messageId);
    await answerCallbackQueryHelper(callbackQueryId, "Заявку видалено з чату");
  }
}

export async function sendTelegramNotification(userId, isSolvent, answers, username) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const historyChatId = process.env.TELEGRAM_HISTORY_CHAT_ID;

  if (!token || !chatId || !historyChatId) {
    console.error("Telegram credentials missing");
    return null;
  }

  let message = `🚀 <b>Нова анкета</b>\n\n`;
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

  try {
    await fetch(`${TG_API_BASE}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: historyChatId,
        text: message,
        parse_mode: "html",
        disable_web_page_preview: true,
      }),
    });
  } catch (e) {
    console.error("History group transfer error:", e);
  }

  if (!isSolvent) return;

  const instaUrl = username
    ? `https://instagram.com/${username}`
    : `https://instagram.com/id_${userId}`;

  try {
    const { data: existingUser, error: userCheckError } = await supabase
      .from("users")
      .select("name")
      .eq("name", instaUrl)
      .maybeSingle();

    if (userCheckError) throw userCheckError;

    if (!existingUser) {
      const { error: userInsertError } = await supabase.from("users").insert([{ name: instaUrl }]);
      if (userInsertError) throw userInsertError;
    }

    const { error: consultInsertError } = await supabase.from("consultations").insert([
      {
        user: instaUrl,
        status: "Підбираємо час",
        source: "Шорти",
      },
    ]);

    if (consultInsertError) throw consultInsertError;
  } catch (dbError) {
    console.error("Supabase automatic logging error:", dbError);
  }

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
