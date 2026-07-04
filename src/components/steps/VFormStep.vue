<!-- src/components/LeadQuiz.vue -->
<script setup>
import { ref, computed } from "vue";

const emit = defineEmits(["on-complete"]);

// Індекс поточного запитання
const currentQuestionIndex = ref(0);

// Збір відповідей користувача
const answers = ref({
  worry: "", // Запитання 1
  readiness: null, // Запитання 2
  attempts: "", // Запитання 3
  hardest: "", // Запитання 4
  activity: "", // Запитання 5
});

// Конфігурація запитань для гнучкості та легкого редагування текстів
const totalQuestions = 5;

// Обчислюємо прогрес у відсотках для смужки зверху
const progressPercentage = computed(() => {
  return ((currentQuestionIndex.value + 1) / totalQuestions) * 100;
});

// Функції навігації
const nextQuestion = () => {
  if (currentQuestionIndex.value < totalQuestions - 1) {
    currentQuestionIndex.value++;
  } else {
    // Якщо це було останнє запитання — віддаємо зібрані дані наверх в App.vue
    emit("on-complete", answers.value);
  }
};

const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  }
};

// Функція для автоматичного переходу далі при кліку на плитку (прискорює UX)
const selectTileOption = (field, value) => {
  answers.value[field] = value;
  // Робимо мікро-паузу, щоб користувач встиг побачити підсвітку кліку
  setTimeout(() => {
    nextQuestion();
  }, 250);
};
</script>

<template>
  <div
    class="w-full max-w-md bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-2xl relative select-none min-h-[460px] flex flex-col justify-between"
  >
    <!-- ВЕРХНЯ ЧАСТИНА: Прогрес і Кнопка "Назад" -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <button
          v-if="currentQuestionIndex > 0"
          @click="prevQuestion"
          class="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-colors"
        >
          ← Назад
        </button>
        <div v-else class="w-4"></div>
        <!-- Заглушка для симетрії -->

        <span class="text-xs font-bold text-emerald-400 tracking-wider uppercase">
          Крок {{ currentQuestionIndex + 1 }} з {{ totalQuestions }}
        </span>
      </div>

      <!-- Лінія прогресу (Progress Bar) -->
      <div class="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden mb-6">
        <div
          class="h-full bg-emerald-500 transition-all duration-300 ease-out"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>

      <!-- ДИНАМІЧНІ ЕКРАНИ ЗАПИТАНЬ -->

      <!-- 1. Що вас зараз найбільше турбує? -->
      <div v-if="currentQuestionIndex === 0" class="space-y-4 animate-slide-in">
        <h3 class="text-lg font-black text-zinc-100 leading-snug">
          Що вас зараз найбільше турбує?
        </h3>
        <p class="text-xs text-zinc-400">Оберіть найбільш близький варіант:</p>

        <div class="grid grid-cols-1 gap-2.5 pt-2">
          <button
            v-for="opt in [
              'Зайва вага та втрата тонусу',
              'Постійна втома та брак енергії',
              'Хаотичне харчування та зриви',
              'Проблеми з ШКТ та дискомфорт',
            ]"
            :key="opt"
            @click="selectTileOption('worry', opt)"
            :class="
              answers.worry === opt
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                : 'border-zinc-800 bg-zinc-950/40 text-zinc-300 hover:border-zinc-700'
            "
            class="w-full p-4 text-left text-sm font-semibold border rounded-xl transition-all active:scale-[0.99]"
          >
            {{ opt }}
          </button>
        </div>
      </div>

      <!-- 2. Готовність діяти (Шкала 1-10) -->
      <div v-if="currentQuestionIndex === 1" class="space-y-4 animate-slide-in">
        <h3 class="text-lg font-black text-zinc-100 leading-snug">
          Як ви оцінюєте свою готовність діяти для вирішення вашого запиту?
        </h3>
        <p class="text-xs text-zinc-400 mb-4">
          Де 1 — «просто подивитися», а 10 — «готовий рвати і метати»
        </p>

        <!-- Сітка кнопок від 1 до 10 -->
        <div class="grid grid-cols-5 gap-2 pt-2">
          <button
            v-for="n in 10"
            :key="n"
            @click="answers.readiness = n"
            :class="
              answers.readiness === n
                ? 'bg-emerald-500 text-zinc-950 font-black border-emerald-500'
                : 'bg-zinc-950/50 border-zinc-800 text-zinc-300'
            "
            class="h-12 rounded-xl border flex items-center justify-center font-bold text-base transition-all active:scale-95"
          >
            {{ n }}
          </button>
        </div>
      </div>

      <!-- 3. Як ви вже пробували це вирішувати? -->
      <div v-if="currentQuestionIndex === 2" class="space-y-4 animate-slide-in">
        <h3 class="text-lg font-black text-zinc-100 leading-snug">
          Як ви вже пробували це вирішувати?
        </h3>
        <p class="text-xs text-zinc-400">
          Розкажіть про ваш попередній досвід (дієти, марафони, тренування тощо):
        </p>

        <textarea
          v-model="answers.attempts"
          placeholder="Наприклад: Пробувала рахувати калорії, сиділа на інтервальному голодуванні, але вага повертається..."
          class="w-full h-32 mt-2 bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
        ></textarea>
      </div>

      <!-- 4. Що вам дається найскладніше? -->
      <div v-if="currentQuestionIndex === 3" class="space-y-4 animate-slide-in">
        <h3 class="text-lg font-black text-zinc-100 leading-snug">Що вам дається найскладніше?</h3>
        <p class="text-xs text-zinc-400">
          Який головний внутрішній чи зовнішній бар'єр ви відчуваєте:
        </p>

        <div class="grid grid-cols-1 gap-2.5 pt-2">
          <button
            v-for="opt in [
              'Тримати дисципліну регулярно',
              'Брак часу на готування та спорт',
              'Контролювати потяг до солодкого / мучного',
              'Нерозуміння з чого почати саме мені',
            ]"
            :key="opt"
            @click="selectTileOption('hardest', opt)"
            :class="
              answers.hardest === opt
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                : 'border-zinc-800 bg-zinc-950/40 text-zinc-300 hover:border-zinc-700'
            "
            class="w-full p-4 text-left text-sm font-semibold border rounded-xl transition-all active:scale-[0.99]"
          >
            {{ opt }}
          </button>
        </div>
      </div>

      <!-- 5. Чим ви зараз займаєтесь? -->
      <div v-if="currentQuestionIndex === 4" class="space-y-4 animate-slide-in">
        <h3 class="text-lg font-black text-zinc-100 leading-snug">Чим ви зараз займаєтесь?</h3>
        <p class="text-xs text-zinc-400">
          Це важливо для розуміння рівня щоденного стресу та побутової активності:
        </p>

        <div class="grid grid-cols-1 gap-2.5 pt-2">
          <button
            v-for="opt in [
              'Офісна робота (переважно сидяча)',
              'Фріланс / Робота з дому',
              'Активна робота (постійно на ногах)',
              'Мама в декреті / Домашнє господарство',
            ]"
            :key="opt"
            @click="answers.activity = opt"
            :class="
              answers.activity === opt
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                : 'border-zinc-800 bg-zinc-950/40 text-zinc-300 hover:border-zinc-700'
            "
            class="w-full p-4 text-left text-sm font-semibold border rounded-xl transition-all active:scale-[0.99]"
          >
            {{ opt }}
          </button>
        </div>
      </div>
    </div>

    <!-- НИЖНЯ ЧАСТИНА: Кнопка дії -->
    <div class="mt-8">
      <!-- Показуємо кнопку "Далі" тільки для кроків з текстовим вводом або шкалою, де немає авто-переходу -->
      <button
        v-if="
          currentQuestionIndex === 1 || currentQuestionIndex === 2 || currentQuestionIndex === 4
        "
        @click="nextQuestion"
        :disabled="
          (currentQuestionIndex === 1 && !answers.readiness) ||
          (currentQuestionIndex === 2 && !answers.attempts.trim()) ||
          (currentQuestionIndex === 4 && !answers.activity)
        "
        class="w-full py-4 bg-emerald-500 text-zinc-950 font-black text-base rounded-xl hover:bg-emerald-400 active:scale-[0.99] disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/10 uppercase tracking-wide"
      >
        {{ currentQuestionIndex === totalQuestions - 1 ? "Завершити реєстрацію 🚀" : "Далі →" }}
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Анімація появи контенту запитання з легким зсувом вбік */
.animate-slide-in {
  animation: slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(12px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
