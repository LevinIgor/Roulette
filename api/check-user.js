/* eslint-env node */

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { user_id } = req.query;
  console.log(`[Check User] Перевірка тегу для user_id: ${user_id}`);

  if (!user_id) {
    return res.status(200).json({ already_played: false, debug: "no_user_id" });
  }

  const MANYCHAT_TOKEN = process.env.MANYCHAT_TOKEN;
  const TARGET_TAG = "Крутил рулетку".trim().toLowerCase();

  if (!MANYCHAT_TOKEN) {
    console.error("[Check User] ПОМИЛКА: ManyChat Token відсутній у змінних оточення Vercel!");
    return res.status(500).json({ error: "Server configuration missing" });
  }

  try {
    const mcResponse = await fetch(
      `https://api.manychat.com/fb/subscriber/getInfo?subscriber_id=${user_id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${MANYCHAT_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );

    const resData = await mcResponse.json();
    console.log(`[Check User] Реальна відповідь від ManyChat API:`, JSON.stringify(resData));

    if (!mcResponse.ok) {
      console.error(`[Check User] ManyChat API повернуло статус помилки: ${mcResponse.status}`);
      return res.status(200).json({ already_played: false, debug: "mc_api_error" });
    }

    const userTags = resData.data?.tags || [];
    console.log(`[Check User] Теги користувача в ManyChat:`, userTags);

    // 🛡️ ФІКС: Обов'язково обертаємо tag у String(), щоб уникнути падіння на числових тегах
    const alreadyPlayed = userTags.some((tag) => {
      if (tag === null || tag === undefined) return false;
      return String(tag).trim().toLowerCase() === TARGET_TAG;
    });

    console.log(`[Check User] Результат перевірки: ${alreadyPlayed}`);

    return res.status(200).json({ already_played: alreadyPlayed });
  } catch (error) {
    console.error("[Check User] КРИТИЧНА ПОМИЛКА СКРИПТА:", error);
    return res.status(200).json({ already_played: false, error: error.message });
  }
}
