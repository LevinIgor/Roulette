export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { user_id } = req.query;

  // Если ID нет, то проверять некого — пускаем на сайт (например, для тестов)
  if (!user_id) {
    return res.status(200).json({ already_played: false });
  }

  const MANYCHAT_TOKEN = process.env.MANYCHAT_TOKEN;
  const TARGET_TAG = "has_been_roulette"; // Название тега, который ты ставишь в ManyChat

  if (!MANYCHAT_TOKEN) {
    console.error("ManyChat Token missing in Vercel env");
    return res.status(500).json({ error: "Server configuration missing" });
  }

  try {
    // Запрашиваем информацию о тегах лида из ManyChat
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

    // Возвращаем true, если тег найден, и false, если тега нет
    const alreadyPlayed = userTags.includes(TARGET_TAG);
    return res.status(200).json({ already_played: alreadyPlayed });
  } catch (error) {
    console.error("ManyChat check error:", error);
    return res.status(200).json({ already_played: false });
  }
}
