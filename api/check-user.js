/* eslint-env node */

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { user_id } = req.query;
  console.log(`[Check User] Перевірка тегу для user_id: ${user_id}`);

  if (!user_id) {
    return res.status(200).json({ already_played: false });
  }

  const MANYCHAT_TOKEN = process.env.MANYCHAT_TOKEN;

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

    if (!mcResponse.ok) {
      return res.status(200).json({ already_played: false });
    }

    const resData = await mcResponse.json();
    const userTags = resData.data?.tags || [];

    // 🛡️ ОНОВЛЕНА ПЕРЕВІРКА ОБ'ЄКТІВ + ЗАХИСТ ВІД РІЗНИХ МОВ
    const alreadyPlayed = userTags.some((tag) => {
      if (!tag || !tag.name) return false;

      // Дістаємо текст тегу, прибираємо пробіли та переводимо в нижній регістр
      const tagName = String(tag.name).trim().toLowerCase();

      // Перевіряємо обидва варіанти написання, щоб точно не промахнутися
      return tagName === "крутил рулетку" || tagName === "крутив рулетку";
    });

    console.log(`[Check User] Результат перевірки: ${alreadyPlayed}`);

    return res.status(200).json({ already_played: alreadyPlayed });
  } catch (error) {
    console.error("[Check User] КРИТИЧНА ПОМИЛКА СКРИПТА:", error);
    return res.status(200).json({ already_played: false });
  }
}
