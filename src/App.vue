<script setup>
import { ref, onMounted } from "vue";
import vRouletteStep from "@/components/steps/vRouletteStep.vue";
import vPrizeStep from "@/components/steps/vPrizeStep.vue";
import vFormStep from "@/components/steps/vFormStep2.vue";
import vEndStep from "@/components/steps/vEndStep.vue";
import { useRoute } from "vue-router";

import { checkSolvency } from "@/composable/useFormQualification.js";

const STEPS = ["roulette", "prize", "form", "end"];
const currentStep = ref("");
const route = useRoute();

async function handleFormComplete(answers) {
  const isSolvent = checkSolvency(answers);

  const payload = {
    user_id: route.query.user_id || null,
    is_solvent: isSolvent,
    answers: answers,
    username: route.query.username || null,
  };

  console.log(payload);

  currentStep.value = STEPS[3];

  try {
    fetch("/api/submit-quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("Помилка відправки:", error);
  }
}

onMounted(async () => {
  if (window.location.hostname === "localhost") {
    currentStep.value = STEPS[0];
    return;
  }

  await new Promise((resolve) => setTimeout(resolve, 0));
  const userId = route.query.user_id || null;

  if (userId) {
    try {
      const response = await fetch(`/api/check-user?user_id=${userId}`);
      const result = await response.json();

      currentStep.value = result.already_played ? STEPS[3] : STEPS[0];
    } catch (error) {
      console.error("Ошибка проверки повторного прохождения:", error);
    }
  }
});
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

    <div class="relative z-10 w-full flex flex-col items-center justify-center min-h-screen">
      <Transition v-if="currentStep = STEPS[0]" name="step-fade" mode="out-in">
        <vRouletteStep
          v-if="currentStep === 'roulette'"
          key="roulette"
          @on-complete="currentStep = STEPS[1]"
        />
        <vPrizeStep
          v-else-if="currentStep === 'prize'"
          key="prize"
          @on-complete="currentStep = STEPS[2]"
        />
        <vFormStep
          v-else-if="currentStep === 'form'"
          key="form"
          @on-complete="handleFormComplete"
        />
        <vEndStep v-else-if="currentStep === 'end'" key="end" />
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.step-fade-enter-active,
.step-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  will-change: transform, opacity;
}

.step-fade-leave-to {
  opacity: 0;
  filter: blur(2px);
}

.step-fade-enter-from {
  opacity: 0;
  filter: blur(2px);
  transform: translateY(-4px);
}

.animate-blob {
  will-change: transform;
  animation: blob-animation 14s infinite alternate ease-in-out;
}

@keyframes blob-animation {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  50% {
    transform: translate(60px, 40px) scale(1.15);
  }
  100% {
    transform: translate(-40px, -60px) scale(0.9);
  }
}

.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
