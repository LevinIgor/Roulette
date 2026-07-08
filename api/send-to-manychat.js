export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { user_id, is_solvent } = req.body;

  if (!user_id) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Сайт не передал user_id.",
    });
  }

  const MANYCHAT_TOKEN = process.env.MANYCHAT_TOKEN;
  const FLOW_FOR_SOLVENT = process.env.FLOW_FOR_SOLVENT;
  const FLOW_FOR_NON_SOLVENT = process.env.FLOW_FOR_NON_SOLVENT;

  if (!MANYCHAT_TOKEN) {
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Токен MANYCHAT_TOKEN не найден в настройках Vercel!",
    });
  }

  // Выбираем нужный FLOW_NS в зависимости от платежеспособности
  const targetFlowNs = is_solvent ? FLOW_FOR_SOLVENT : FLOW_FOR_NON_SOLVENT;

  try {
    // 🔥 Используем ОФИЦИАЛЬНО РАБОЧИЙ URL и заголовки из твоего примера
    const mcResponse = await fetch("https://api.manychat.com/fb/sending/sendFlow", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MANYCHAT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subscriber_id: String(user_id), // Принудительно в строку, как в твоем примере
        flow_ns: targetFlowNs, // Ключ изменен с flow_uuid на flow_ns
      }),
    });

    const contentType = mcResponse.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      const rawHtmlError = await mcResponse.text();
      return res.status(mcResponse.status).json({
        error: "ManyChat вернул ошибку (не JSON)",
        status: mcResponse.status,
        raw_error: rawHtmlError.substring(0, 300),
      });
    }

    const mcData = await mcResponse.json();
    return res.status(200).json({ success: true, data: mcData });
  } catch (error) {
    return res.status(500).json({ error: "Server Crash", message: error.message });
  }
}
