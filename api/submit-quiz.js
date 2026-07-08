/* eslint-env node */
import { triggerManyChatFlow } from "./_lib/manychat.js";
import { sendTelegramNotification } from "./_lib/telegram.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Обов'язково дістаємо user_name, який присилає фронтенд
  const { user_id, user_name, is_solvent, answers } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "Bad Request", message: "User ID missing" });
  }

  try {
    // Запускаємо ManyChat та оновлений Telegram (передаємо user_name 4-м параметром)
    const [mcResult, tgResult] = await Promise.all([
      triggerManyChatFlow(user_id, is_solvent),
      sendTelegramNotification(user_id, is_solvent, answers, user_name),
    ]);

    return res.status(200).json({
      success: true,
      message: "Data processed successfully",
      details: { manychat: !!mcResult, telegram: !!tgResult },
    });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}
