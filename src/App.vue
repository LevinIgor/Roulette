<script setup>
import { ref } from "vue";
import vRouletteStep from "@/components/steps/vRouletteStep.vue";
import vPrizeStep from "@/components/steps/vPrizeStep.vue";
import VFormStep from "@/components/steps/VFormStep.vue";
import vEndStep from "@/components/steps/vEndStep.vue";

const STEPS = ["roulette", "prize", "form", "end"];
const currentStep = ref(STEPS[0]);
</script>

<template>
  <div
    class="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col justify-center items-center px-4 py-6 font-sans select-none"
  >
    <vRouletteStep v-if="currentStep === 'roulette'" @spin-complete="currentStep = 'prize'" />
    <vPrizeStep v-else-if="currentStep === 'prize'" @on-complete="currentStep = 'form'" />
    <VFormStep v-else-if="currentStep === 'form'" @on-complete="currentStep = 'end'" />
    <vEndStep v-else-if="currentStep === 'end'" />
  </div>
</template>
