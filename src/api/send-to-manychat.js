export default async function handler({ manychat_id, is_solvent }) {
  const MANYCHAT_TOKEN = import.meta.env.MANYCHAT_TOKEN;
  const FLOW_FOR_SOLVENT = import.meta.env.FLOW_FOR_SOLVENT;
  const FLOW_FOR_NON_SOLVENT = import.meta.env.FLOW_FOR_NON_SOLVENT;

  const targetFlowUuid = is_solvent ? FLOW_FOR_SOLVENT : FLOW_FOR_NON_SOLVENT;

  try {
    // Відправляємо запит в офіційне API ManyChat для запуску потоку повідомлень
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

    const mcData = await mcResponse.json();

    console.log("Відповідь від ManyChat:", mcData);
  } catch (error) {
    console.error("Помилка при відправці запиту в ManyChat:", error);
  }
}
