<script setup>
import { ref, onMounted, computed } from "vue";

const emits = defineEmits(["spin-complete"]);

const isSpinning = ref(false);
const offset = ref(0);
const itemHeight = 80;

// ==========================================
// ⚙️ НАСТРОЙКИ БАРАБАНА (МЕНЯЙ СКОРОСТЬ И ВРЕМЯ ЗДЕСЬ)
// ==========================================
const SPIN_DURATION = 4000; // Длительность вращения в миллисекундах (4000 мс = 4 секунды)
const SPIN_LOOPS = 12; // Количество прокручиваемых кругов. Больше число = быстрее крутится!
// ==========================================

const basePrizes = [
  { id: "guide", text: "📘 Гайд по питанию" },
  { id: "discount", text: "🔥 Скидка 20% на чек-ап" },
  { id: "consult", text: "🎁 Бесплатная консультация" }, // Наш главный приз
  { id: "checklist", text: "✅ Чек-лист дефицитов" },
];

const repeatedPrizes = ref([]);

// Вычисляем длительность для CSS в секундах (например, "4s")
const cssDuration = computed(() => `${SPIN_DURATION / 1000}s`);

onMounted(() => {
  // Динамически заполняем ленту в зависимости от настройки SPIN_LOOPS
  for (let i = 0; i < SPIN_LOOPS; i++) {
    repeatedPrizes.value.push(...basePrizes);
  }
});

const spinDrum = async () => {
  if (isSpinning.value) return;
  isSpinning.value = true;

  const targetIndex = repeatedPrizes.value.length - 2;
  offset.value = targetIndex * itemHeight;

  setTimeout(async () => {
    isSpinning.value = false;

    await new Promise((resolve) => setTimeout(resolve, 500));

    emits("spin-complete");
  }, SPIN_DURATION);
};
</script>

<template>
  <div class="flex flex-col items-center p-5 text-center select-none">
    <h1 class="text-3xl font-black text-zinc-50 mb-2">Испытай удачу!</h1>
    <p class="text-zinc-400 text-sm mb-8">Крути барабан и выигрывай ценный подарок</p>

    <div
      class="relative w-full max-w-[340px] bg-zinc-900 border-2 border-emerald-500 p-2.5 rounded-2xl shadow-2xl shadow-emerald-950/30"
    >
      <div
        class="absolute left-[-20px] top-1/2 -translate-y-1/2 text-emerald-400 text-xl animate-pulse"
      >
        ▶
      </div>
      <div
        class="absolute right-[-20px] top-1/2 -translate-y-1/2 text-emerald-400 text-xl animate-pulse"
      >
        ◀
      </div>

      <div
        class="overflow-hidden bg-zinc-950 rounded-lg relative"
        :style="{ height: itemHeight + 'px' }"
      >
        <div
          class="flex flex-col will-change-transform"
          :style="{
            transform: `translateY(-${offset}px)`,
            transition: isSpinning
              ? `transform ${cssDuration} cubic-bezier(0.1, 0.8, 0.1, 1)`
              : 'none',
          }"
        >
          <div
            v-for="(prize, index) in repeatedPrizes"
            :key="index"
            class="text-center text-lg font-bold text-zinc-100 flex items-center justify-center"
            :style="{ height: itemHeight + 'px' }"
          >
            {{ prize.text }}
          </div>
        </div>
      </div>
    </div>

    <button
      @click="spinDrum"
      :disabled="isSpinning"
      class="mt-8 w-full max-w-[340px] py-4 text-lg font-extrabold rounded-xl transition-all duration-200 active:scale-[0.98] disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed bg-emerald-500 text-zinc-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
    >
      {{ isSpinning ? "Барабан крутится..." : "ПОЛУЧИТЬ ПОДАРОК 🎁" }}
    </button>
  </div>
</template>
