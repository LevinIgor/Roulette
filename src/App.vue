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
  const isSolvent = checkSolvency(answers.activity);

  const payload = {
    manychat_id: route.query.manychat_id || null,
    is_solvent: isSolvent,
  };

  try {
    // ⚠️ АДРЕСА МАЄ БУТИ САМЕ ТАКОЮ (відносною):
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

  currentStep.value = "end";
}
</script>

<template>
  <div
    class="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col justify-center items-center px-4 py-6 font-sans select-none"
  >
    <vRouletteStep v-if="currentStep === 'roulette'" @on-complete="currentStep = 'prize'" />
    <vPrizeStep v-else-if="currentStep === 'prize'" @on-complete="currentStep = 'form'" />
    <vFormStep v-else-if="currentStep === 'form'" @on-complete="handleFormComplete" />
    <vEndStep v-else-if="currentStep === 'end'" />
  </div>
</template>
