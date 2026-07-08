<script setup>
import { ref } from "vue";
import vRouletteStep from "@/components/steps/vRouletteStep.vue";
import vPrizeStep from "@/components/steps/vPrizeStep.vue";
import vFormStep from "@/components/steps/vFormStep2.vue";
import vEndStep from "@/components/steps/vEndStep.vue";
import { useRoute } from "vue-router";

import { checkSolvency } from "@/composable/useFormQualification.js";

const STEPS = ["roulette", "prize", "form", "end"];
const currentStep = ref(STEPS[0]);
const route = useRoute();

async function handleFormComplete(answers) {
  const isSolvent = checkSolvency(answers);

  const payload = {
    user_id: route.query.user_id || null,
    is_solvent: isSolvent,
  };

  currentStep.value = "end";

  try {
    const response = await fetch("/api/send-to-manychat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log("Сервер Vercel відповів:", result);
  } catch (error) {
    console.error("Помилка відправки:", error);
  }
}
</script>

<template>
  <div
    class="flex flex-col items-center p-5 text-center select-none relative w-full min-h-screen justify-center bg-zinc-950 overflow-hidden"
  >
    <div class="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-zinc-950">
      <div
        class="absolute -top-32 -left-20 w-96 h-96 bg-emerald-500/25 rounded-full blur-[90px] animate-blob transform-gpu"
      ></div>

      <div
        class="absolute top-1/4 -right-32 w-96 h-96 bg-zinc-700/40 rounded-full blur-[110px] animate-blob animation-delay-2000 transform-gpu"
      ></div>

      <div
        class="absolute -bottom-32 -left-20 w-96 h-96 bg-emerald-600/20 rounded-full blur-[100px] animate-blob animation-delay-4000 transform-gpu"
      ></div>
    </div>

    <div class="relative z-10 w-full flex flex-col items-center min-h-full">
      <vRouletteStep v-if="currentStep === 'roulette'" @on-complete="currentStep = 'prize'" />
      <vPrizeStep v-else-if="currentStep === 'prize'" @on-complete="currentStep = 'form'" />
      <vFormStep v-else-if="currentStep === 'form'" @on-complete="handleFormComplete" />
      <vEndStep v-else-if="currentStep === 'end'" />
    </div>
  </div>
</template>

<style scoped>
/* Додаємо вказівку для браузера, що ці елементи будуть постійно рухатися */
.animate-blob {
  will-change: transform;
  animation: blob-animation 12s infinite alternate ease-in-out;
}

@keyframes blob-animation {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  50% {
    /* Робимо рух більш помітним — зсув на 40-60 пікселів */
    transform: translate(100px, 60px) scale(1.2);
  }
  100% {
    transform: translate(-150px, -40px) scale(0.9);
  }
}

.animation-delay-2000 {
  animation-delay: 1s;
}
.animation-delay-4000 {
  animation-delay: 1s;
}
</style>
