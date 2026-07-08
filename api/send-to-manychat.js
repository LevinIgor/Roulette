export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { manychat_id, is_solvent } = req.body;

  // Проверяем, передал ли фронтенд ID пользователя
  if (!manychat_id) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Сайт не передал user_id. Убедись, что в ссылке есть ?user_id=...",
    });
  }

  const MANYCHAT_TOKEN = process.env.MANYCHAT_TOKEN;
  const FLOW_FOR_SOLVENT = process.env.FLOW_FOR_SOLVENT;
  const FLOW_FOR_NON_SOLVENT = process.env.FLOW_FOR_NON_SOLVENT;

  // Проверяем, загрузились ли секреты на Vercel
  if (!MANYCHAT_TOKEN) {
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Токен MANYCHAT_TOKEN не найден в настройках Vercel!",
    });
  }

  const targetFlowUuid = is_solvent ? FLOW_FOR_SOLVENT : FLOW_FOR_NON_SOLVENT;

  try {
    const mcResponse = await fetch("https://api.manychat.com/fb/subscriber/startFlow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MANYCHAT_TOKEN}`,
      },
      body: JSON.stringify({
        subscriber_id: manychat_id,
        flow_uuid: targetFlowUuid,
      }),
    });

    // 🔥 КРИТИЧЕСКИЙ ФИКС: Проверяем, что вернул ManyChat перед тем как превращать в JSON
    const contentType = mcResponse.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      // Если пришел HTML, забираем его как обычный текст
      const rawHtmlError = await mcResponse.text();
      return res.status(mcResponse.status).json({
        error: "ManyChat заблокировал запрос или выдал ошибку",
        status: mcResponse.status,
        raw_error: rawHtmlError.substring(0, 300), // Покажет первые 300 символов ошибки (там будет понятен текст)
      });
    }

    const mcData = await mcResponse.json();
    return res.status(200).json({ success: true, data: mcData });
  } catch (error) {
    return res.status(500).json({ error: "Server Crash", message: error.message });
  }
}
