/* eslint-env node */
// api/send-to-manychat.js

export default async function handler(req, res) {
  // Разрешаем только POST запросы от твоего сайта
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Vercel автоматически парсит JSON и кладет его в req.body
  const { user_id, is_solvent } = req.body;

  // На сервере Vercel секреты берутся исключительно из process.env
  const MANYCHAT_TOKEN = process.env.MANYCHAT_TOKEN;
  const FLOW_FOR_SOLVENT = process.env.FLOW_FOR_SOLVENT;
  const FLOW_FOR_NON_SOLVENT = process.env.FLOW_FOR_NON_SOLVENT;

  const targetFlowUuid = is_solvent ? FLOW_FOR_SOLVENT : FLOW_FOR_NON_SOLVENT;

  try {
    // Отправляем запрос от имени сервера (CORS здесь не существует)
    const mcResponse = await fetch("https://api.manychat.com/fb/subscriber/startFlow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MANYCHAT_TOKEN}`,
      },
      body: JSON.stringify({
        subscriber_id: user_id,
        flow_uuid: targetFlowUuid,
      }),
    });

    const mcData = await mcResponse.json();

    if (!mcResponse.ok) {
      return res.status(400).json({ error: "ManyChat API error", details: mcData });
    }

    // Обязательно возвращаем успешный ответ сайту, чтобы он переключил экран на "Финал"
    return res.status(200).json({ success: true, data: mcData });
  } catch (error) {
    console.error("Помилка при відправці запиту в ManyChat:", error);
    return res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}
