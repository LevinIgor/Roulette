<!-- src/components/VerticalDrum.vue -->
<script setup>
import { ref, onMounted, computed } from "vue";

const emits = defineEmits(["on-complete"]);

const isSpinning = ref(false);
const showWinnerEffects = ref(false); // Новий стан для активації святкових ефектів
const offset = ref(0);
const itemHeight = 80;

const SPIN_DURATION = 4000;
const SPIN_LOOPS = 8;

const basePrizes = [
  { id: "consult", text: "🎁 Персональний розбір запиту" },
  { id: "menu", text: "📋 Меню на тиждень" },
  { id: "checkup", text: "🔬 Список аналізів для чек-апу" },
  { id: "kbzhu", text: "📊 Розрахунок ваших КБЖВ" },
  { id: "stress", text: "🧠 Урок про стрес" },
  { id: "weightloss", text: "🍏 Лекція про схуднення" },
  { id: "workout", text: "💪 Програма тренувань" },
  { id: "discount", text: "🔥 Знижка 20% на індивідуальний супровід" },
];

const repeatedPrizes = ref([]);
const cssDuration = computed(() => `${SPIN_DURATION / 1000}s`);

onMounted(() => {
  for (let i = 0; i < SPIN_LOOPS; i++) {
    repeatedPrizes.value.push(...basePrizes);
  }
});

const spinDrum = async () => {
  if (isSpinning.value) return;
  isSpinning.value = true;
  showWinnerEffects.value = false; // Скидаємо ефекти перед новим стартом

  const mainPrizeIndex = basePrizes.findIndex((p) => p.id === "consult");
  const targetIndex = repeatedPrizes.value.length - basePrizes.length + mainPrizeIndex;

  offset.value = targetIndex * itemHeight;

  setTimeout(async () => {
    isSpinning.value = false;
    showWinnerEffects.value = true; // 🔥 Вмикаємо салют та сяйво в момент зупинки!

    // Подовжуємо паузу до 1.5 секунди, щоб користувач насолодився моментом виграшу
    await new Promise((resolve) => setTimeout(resolve, 1500));

    emits("on-complete");
  }, SPIN_DURATION);
};
</script>

<template>
  <div
    class="flex flex-col items-center p-5 text-center select-none relative w-full max-w-md mx-auto"
  >
    <h1 class="text-3xl font-black text-zinc-50 mb-2">Випробуй удачу!</h1>
    <p class="text-zinc-400 text-sm mb-8">Крути барабан та вигравай цінний подарунок</p>

    <!-- ГОЛОВНИЙ КОНТЕЙНЕР БАРАБАНА -->
    <div
      :class="
        showWinnerEffects
          ? 'border-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.4)] scale-[1.02]'
          : 'border-emerald-500 shadow-emerald-950/30'
      "
      class="relative w-full max-w-85 bg-zinc-900 border-2 p-2.5 rounded-2xl shadow-2xl transition-all duration-500 ease-out z-10"
    >
      <!-- ДЕКОРАТИВНІ СВЯТКОВІ ЕЛЕМЕНТИ (ВИЛІТАЮТЬ ПРИ ВИГРАШІ) -->
      <div v-if="showWinnerEffects" class="absolute inset-0 pointer-events-none z-20">
        <span class="absolute -top-12 -left-6 text-3xl animate-pop-1">🎉</span>
        <span class="absolute -top-10 -right-8 text-4xl animate-pop-2">✨</span>
        <span class="absolute -bottom-10 -left-8 text-3xl animate-pop-3">🔥</span>
        <span class="absolute -bottom-12 -right-6 text-4xl animate-pop-4">🌟</span>
      </div>

      <!-- Бічні маркери-стрілочки (блимають червоним/зеленим під час виграшу) -->
      <div
        :class="showWinnerEffects ? 'text-emerald-400 scale-125' : 'text-emerald-500 animate-pulse'"
        class="absolute -left-5 top-1/2 -translate-y-1/2 text-xl transition-all duration-300"
      >
        ▶
      </div>
      <div
        :class="showWinnerEffects ? 'text-emerald-400 scale-125' : 'text-emerald-500 animate-pulse'"
        class="absolute -right-5 top-1/2 -translate-y-1/2 text-xl transition-all duration-300"
      >
        ◀
      </div>

      <!-- ВІКОНЦЕ ПЕРЕГЛЯДУ ПРИЗУ -->
      <div
        :class="
          showWinnerEffects
            ? 'bg-emerald-950/20 border border-emerald-500/30 animate-winner-bounce'
            : 'bg-zinc-950 border-transparent'
        "
        class="overflow-hidden rounded-lg relative transition-all duration-300"
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
            :class="
              showWinnerEffects && prize.id === 'consult'
                ? 'text-emerald-400 font-black'
                : 'text-zinc-100'
            "
            class="text-center text-sm sm:text-base font-bold flex items-center justify-center px-2 transition-colors duration-300"
            :style="{ height: itemHeight + 'px' }"
          >
            {{ prize.text }}
          </div>
        </div>
      </div>
    </div>

    <!-- КНОПКА ЗАПУСКУ -->
    <button
      @click="spinDrum"
      :disabled="isSpinning || showWinnerEffects"
      class="mt-8 w-full max-w-85 py-4 text-lg font-extrabold rounded-xl transition-all duration-200 active:scale-[0.98] disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed bg-emerald-500 text-zinc-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
    >
      <span v-if="isSpinning">Барабан крутиться...</span>
      <span v-else-if="showWinnerEffects">ВІТАЄМО З ВИГРАШЕМ! 🥳</span>
      <span v-else>ОТРИМАТИ ПОДАРУНОК 🎁</span>
    </button>
  </div>
</template>

<style scoped>
/* Анімація поштовху виграшного віконця */
@keyframes winnerBounce {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
.animate-winner-bounce {
  animation: winnerBounce 0.6s cubic-bezier(0.25, 1, 0.5, 1) 2;
}

/* Кастомні мікро-анімації вилітаючих емоджі (святковий вибух) */
@keyframes popLeftTop {
  0% {
    transform: translate(0, 0) scale(0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translate(-20px, -25px) scale(1.3) rotate(-15deg);
    opacity: 1;
  }
}
@keyframes popRightTop {
  0% {
    transform: translate(0, 0) scale(0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translate(20px, -25px) scale(1.3) rotate(15deg);
    opacity: 1;
  }
}
@keyframes popLeftBottom {
  0% {
    transform: translate(0, 0) scale(0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translate(-20px, 25px) scale(1.3) rotate(-10deg);
    opacity: 1;
  }
}
@keyframes popRightBottom {
  0% {
    transform: translate(0, 0) scale(0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translate(20px, 25px) scale(1.3) rotate(10deg);
    opacity: 1;
  }
}

.animate-pop-1 {
  animation: popLeftTop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
.animate-pop-2 {
  animation: popRightTop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
.animate-pop-3 {
  animation: popLeftBottom 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
.animate-pop-4 {
  animation: popRightBottom 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
</style>
