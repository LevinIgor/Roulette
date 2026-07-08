<script setup>
import { ref } from "vue";
import vRouletteStep from "@/components/steps/vRouletteStep.vue";
import vPrizeStep from "@/components/steps/vPrizeStep.vue";
import vFormStep from "@/components/steps/vFormStep.vue";
import vEndStep from "@/components/steps/vEndStep.vue";
import { useRoute } from "vue-router";

import { checkSolvency } from "@/composable/useFormQualification.js";
import sendToManyChat from "@/api/send-to-manychat.js";

const STEPS = ["roulette", "prize", "form", "end"];
const currentStep = ref(STEPS[0]);
const route = useRoute();

const isSolvent = ref(false);

function onFormSubmit(formData) {
  console.log(formData);

  isSolvent.value = checkSolvency(formData);

  sendToManyChat({ manychat_id: route.query.manychat_id, is_solvent: isSolvent.value });

  alert(isSolvent.value ? "+" : "-");
  currentStep.value = "end";
}
</script>

<template>
  <div
    class="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col justify-center items-center px-4 py-6 font-sans select-none"
  >
    <vRouletteStep v-if="currentStep === 'roulette'" @on-complete="currentStep = 'prize'" />
    <vPrizeStep v-else-if="currentStep === 'prize'" @on-complete="currentStep = 'form'" />
    <vFormStep v-else-if="currentStep === 'form'" @on-complete="onFormSubmit" />
    <vEndStep v-else-if="currentStep === 'end'" />
  </div>
</template>
