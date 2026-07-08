export function checkSolvency(formData) {
  if (
    formData.worry.includes("Мала вага - хочу набрати") ||
    formData.worry.includes("Нічого не трубує - просто цікавлюсь")
  ) {
    return false;
  }

  if (formData.worry.includes("Немає енергії") && formData.worry.length == 1) {
    return false;
  }

  if (
    formData.readiness == "1-3 з 10 - хочу результат, але не готова до змін" ||
    formData.readiness == "4-5 з 10 - поки не впевнена, що готова щось змінювати"
  ) {
    return false;
  }

  const readlinessBad = [
    "6-7 з 10 - хочу змін, але боюсь, що зіллюсь",
    "4-5 з 10 - поки не впевнена, що готова щось змінювати",
    "1-3 з 10 - хочу результат, але не готова до змін",
  ];

  const activityBad = ["Декрет, не працюю", "Знаходжусь в пошуках роботи"];

  if (readlinessBad.includes(formData.readiness) && activityBad.includes(formData.activity)) {
    return false;
  }

  if (formData.hardest.includes("Нема складнощів - все йде гладко👌")) {
    return false;
  }

  if (formData.activity == "Пенсія, не працюю") return false;

  return true;
}
