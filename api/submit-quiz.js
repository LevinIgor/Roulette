/* eslint-env node */
import { triggerManyChatFlow } from "./_lib/manychat.js";
import { sendTelegramNotification } from "./_lib/telegram.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { user_id, is_solvent, answers, username } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "Bad Request", message: "User ID missing" });
  }

  try {
    // Запускаємо обидва процеси паралельно для швидкості
    await Promise.all([
      triggerManyChatFlow(user_id, is_solvent),
      sendTelegramNotification(user_id, is_solvent, answers, username),
    ]);
  } catch (error) {
    console.error("API Error:", error);
  }
}
