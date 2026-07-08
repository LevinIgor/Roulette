export async function triggerManyChatFlow(userId, isSolvent) {
  const token = process.env.MANYCHAT_TOKEN;
  const flowNs = isSolvent ? process.env.FLOW_FOR_SOLVENT : process.env.FLOW_FOR_NON_SOLVENT;

  if (!token || !flowNs) {
    console.error("ManyChat credentials missing");
    return null;
  }

  const response = await fetch("https://api.manychat.com/fb/sending/sendFlow", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subscriber_id: String(userId),
      flow_ns: flowNs,
    }),
  });

  return response.json();
}
