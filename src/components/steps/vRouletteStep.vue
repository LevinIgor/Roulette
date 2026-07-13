Для того щоб реалізувати таку логіку, ми додамо нову реактивну змінну `isWheelVisible`. Спочатку
користувач бачитиме лише заголовок та яскраву кнопку. Після кліку блок рулетки плавно та ефектно
«випливе» знизу з легким ефектом пружини (spring/bounce), і одразу ж запуститься процес обертання з
нашим плавним стартом та ефектом зупинки «на межі». Також код повністю очищено від зайвих дублювань
класів, а логіку запуску розбито на два чітких кроки через мікротаймаут, щоб браузер встиг
зарендерити початкову позицію барабана перед початком крутіння. Ось повністю оновлений та
оптимізований файл компонента: ```vue
<script setup>
import { ref, computed } from "vue";

const emits = defineEmits(["on-complete"]);

// 🕹️ Керування станами
const isWheelVisible = ref(false); // Барабан прихований за замовчуванням
const isSpinning = ref(false);
const showWinnerEffects = ref(false);

const SPIN_DURATION = 4000;
const SPIN_LOOPS = 6;

const basePrizes = [
  { id: "consult", text: "🎁 Персональний розбір запиту" },
  { id: "menu", text: "📋 Меню на тиждень" },
  { id: "checkup", text: "🔬 Список аналізів для чек-апу" },
  { id: "kbzhu", text: "📊 Розрахунок ваших КБЖВ" },
  { id: "stress", text: "🧠 Урок про стрес" },
  { id: "weightloss", text: "🍏 Лекція про схуднення" },
  { id: "workout", text: "💪 Програма тренувань" },
  { id: "discount", text: "🔥 Знижка 20% на супровід" },
];

const degreesPerItem = 360 / basePrizes.length; // 45 градусів на елемент
const startingIndex = 3; // Стартова плашка для відводу очей ("Розрахунок КБЖВ")

// Початкова позиція барабана (у мінусі для коректного 3D відображення)
const rotationX = ref(-(startingIndex * degreesPerItem));
const cssDuration = computed(() => `${SPIN_DURATION / 1000}s`);

// 🚀 Головна послідовність дій при натисканні
const startSequence = () => {
  if (isSpinning.value || showWinnerEffects.value) return;

  // Якщо барабан ще не з'явився — показуємо його
  if (!isWheelVisible.value) {
    isWheelVisible.value = true;

    // Даємо Vue 200мс на відрисовку карти у стартовій позиції, і тільки потім крутимо
    setTimeout(() => {
      executeSpin();
    }, 200);
  } else {
    executeSpin();
  }
};

const executeSpin = () => {
  isSpinning.value = true;
  showWinnerEffects.value = false;

  const mainPrizeIndex = basePrizes.findIndex((p) => p.id === "consult");

  const targetDegrees = 360 * SPIN_LOOPS + mainPrizeIndex * degreesPerItem;
  rotationX.value = -targetDegrees;

  setTimeout(async () => {
    isSpinning.value = false;
    showWinnerEffects.value = true;

    // Даємо насолодитися перемоговею та ефектами
    await new Promise((resolve) => setTimeout(resolve, 1800));
    emits("on-complete");
  }, SPIN_DURATION);
};
</script>

<template>
  <div
    class="flex flex-col items-center p-5 text-center select-none relative w-full max-w-md mx-auto min-h-screen justify-center"
  >
    <!-- 1. Блок заголовка -->
    <div class="transition-all duration-500" :class="{ 'scale-95 opacity-30': isSpinning }">
      <h1
        class="text-4xl font-black text-zinc-50 mb-2 tracking-tight bg-gradient-to-b from-zinc-50 to-zinc-400 bg-clip-text text-transparent"
      >
        Випробуй удачу!
      </h1>
      <p class="text-zinc-400 text-sm mb-8">Крути колесо та вигравай цінний подарунок</p>
    </div>

    <!-- 2. Блок рулетки (Рендериться і з'являється тільки після кліку) -->
    <Transition name="wheel-bounce">
      <div
        v-if="isWheelVisible"
        :class="
          showWinnerEffects
            ? 'border-emerald-400 shadow-[0_0_60px_rgba(16,185,129,0.35)] scale-[1.03]'
            : 'border-zinc-800 shadow-zinc-950/90'
        "
        class="relative w-full max-w-85 bg-zinc-900 border p-4 rounded-3xl shadow-2xl transition-all duration-700 ease-out z-10 mb-8"
      >
        <!-- Ефекти конфеті -->
        <div v-if="showWinnerEffects" class="absolute inset-0 pointer-events-none z-30">
          <span class="absolute top-0 left-0 text-4xl animate-pop-1">🎉</span>
          <span class="absolute top-0 right-0 text-4xl animate-pop-2">✨</span>
          <span class="absolute bottom-0 left-0 text-4xl animate-pop-3">🔥</span>
          <span class="absolute bottom-0 right-0 text-4xl animate-pop-4">🌟</span>
        </div>

        <!-- Бокові маркер-стрілки -->
        <div
          :class="
            showWinnerEffects ? 'text-emerald-400 scale-130' : 'text-emerald-500 animate-pulse'
          "
          class="absolute -left-2 top-1/2 -translate-y-1/2 text-2xl transition-all duration-300 z-20 font-black"
        >
          ▶
        </div>
        <div
          :class="
            showWinnerEffects ? 'text-emerald-400 scale-130' : 'text-emerald-500 animate-pulse'
          "
          class="absolute -right-2 top-1/2 -translate-y-1/2 text-2xl transition-all duration-300 z-20 font-black"
        >
          ◀
        </div>

        <!-- В'юпорт вікна відображення -->
        <div
          :class="
            showWinnerEffects
              ? 'bg-emerald-950/20 border-emerald-500/30 shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]'
              : 'bg-zinc-950 border-zinc-800'
          "
          class="rounded-2xl relative transition-all duration-500 border h-[200px] flex items-center justify-center viewport-3d"
        >
          <div
            class="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-zinc-950 via-zinc-950/60 to-transparent pointer-events-none z-20 rounded-t-2xl"
          ></div>
          <div
            class="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent pointer-events-none z-20 rounded-b-2xl"
          ></div>
          <div
            class="absolute inset-x-2 h-16 top-1/2 -translate-y-1/2 border border-zinc-700/40 bg-zinc-900/60 pointer-events-none rounded-xl z-10 transition-all duration-300 shadow-inner"
            :class="{ 'border-emerald-500/40 bg-emerald-950/40': showWinnerEffects }"
          ></div>

          <!-- 3D Барабан -->
          <div
            class="wheel-3d will-change-transform"
            :style="{
              transform: `rotateX(${rotationX}deg)`,
              transition: isSpinning
                ? `transform ${cssDuration} cubic-bezier(0.8, 0, 0.1, 1)`
                : 'none',
            }"
          >
            <div
              v-for="(prize, index) in basePrizes"
              :key="prize.id"
              :class="
                showWinnerEffects && prize.id === 'consult'
                  ? 'text-emerald-400 font-black text-base sm:text-lg opacity-100 drop-shadow-[0_0_15px_rgba(16,185,129,0.6)]'
                  : isSpinning
                    ? 'text-zinc-100 font-extrabold text-sm opacity-75'
                    : 'text-zinc-300 font-bold text-sm opacity-60'
              "
              class="item-3d text-center tracking-wide"
              :style="{ transform: `rotateX(${index * 45}deg) translateZ(102px)` }"
            >
              {{ prize.text }}
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 3. Кнопка взаємодії -->
    <button
      @click="startSequence"
      :disabled="isSpinning || showWinnerEffects"
      class="w-full max-w-85 py-4 text-base font-black rounded-xl transition-all duration-300 active:scale-[0.97] disabled:bg-zinc-900 disabled:text-zinc-700 disabled:border-zinc-800 border border-transparent disabled:cursor-not-allowed bg-emerald-500 text-zinc-950 hover:bg-emerald-400 shadow-xl shadow-emerald-500/10 uppercase tracking-widest relative overflow-hidden group z-10"
    >
      <span
        class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:navigate-shine"
      ></span>
      <span v-if="isSpinning">Очікуйте...</span>
      <span v-else-if="showWinnerEffects">ВІТАЄМО! 🥳</span>
      <span v-else>КРУТИТИ КОЛЕСО 🎁</span>
    </button>
  </div>
</template>

<style scoped>
/* ✨ АНІМАЦІЯ ПЛАВНОЇ ПОЯВИ БЛОКУ РУЛЕТКИ */
.wheel-bounce-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); /* М'який ефект пружини */
}
.wheel-bounce-leave-active {
  transition: all 0.25s ease-in;
}
.wheel-bounce-enter-from {
  opacity: 0;
  transform: scale(0.92) translateY(30px);
  filter: blur(5px);
}

/* 3D Перспектива */
.viewport-3d {
  perspective: 1200px;
  transform-style: preserve-3d;
}

.wheel-3d {
  position: relative;
  width: 100%;
  height: 64px;
  transform-style: preserve-3d;
}

.item-3d {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

@keyframes shine {
  100% {
    transform: translateX(100%);
  }
}
.group-hover\:animate-shine:hover {
  animation: shine 0.8s ease-out;
}

/* Вибухи конфеті */
@keyframes popLT {
  0% {
    transform: translate(0, 0) scale(0);
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
  100% {
    transform: translate(-140px, -150px) scale(1.5) rotate(-30deg);
    opacity: 0;
  }
}
@keyframes popRT {
  0% {
    transform: translate(0, 0) scale(0);
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
  100% {
    transform: translate(140px, -150px) scale(1.5) rotate(30deg);
    opacity: 0;
  }
}
@keyframes popLB {
  0% {
    transform: translate(0, 0) scale(0);
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
  100% {
    transform: translate(-140px, 150px) scale(1.5) rotate(-20deg);
    opacity: 0;
  }
}
@keyframes popRB {
  0% {
    transform: translate(0, 0) scale(0);
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
  100% {
    transform: translate(140px, 150px) scale(1.5) rotate(20deg);
    opacity: 0;
  }
}

.animate-pop-1 {
  animation: popLT 0.8s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
}
.animate-pop-2 {
  animation: popRT 0.8s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
}
.animate-pop-3 {
  animation: popLB 0.8s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
}
.animate-pop-4 {
  animation: popRB 0.8s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
}
</style>
