<script setup>
import { ref, computed } from "vue";

const emit = defineEmits(["on-complete"]);

const currentQuestionIndex = ref(0);
const totalQuestions = 5;

// Збір відповідей користувача (масиви для множинного вибору, рядки для поодинокого)
const answers = ref({
  worry: [], // Крок 1 (Множинний) - Завжди масив
  readiness: null, // Крок 2 (Поодинокий)
  attempts: [], // Крок 3 (Множинний) - Завжди масив
  hardest: [], // Крок 4 (Множинний) - Завжди масив
  activity: "", // Крок 5 (Поодинокий)
});

// Обчислюємо прогрес у відсотках для смужки зверху
const progressPercentage = computed(() => {
  return ((currentQuestionIndex.value + 1) / totalQuestions) * 100;
});

// Перевірка, чи заповнено поточний крок (для валідації кнопки "Далі")
const isCurrentStepValid = computed(() => {
  switch (currentQuestionIndex.value) {
    case 0:
      return answers.value.worry.length > 0;
    case 1:
      return answers.value.readiness !== null;
    case 2:
      return answers.value.attempts.length > 0;
    case 3:
      return answers.value.hardest.length > 0;
    case 4:
      return answers.value.activity !== "";
    default:
      return false;
  }
});

// Функції навігації
const nextQuestion = () => {
  if (currentQuestionIndex.value < totalQuestions - 1) {
    currentQuestionIndex.value++;
  } else {
    emit("on-complete", answers.value);
  }
};

const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  }
};

// 🔥 Розумний менеджер множинного вибору (Тільки чисті мутації масиву)
const toggleMultiSelect = (field, option) => {
  const arr = answers.value[field];
  const index = arr.indexOf(option);

  // Карта виключних опцій для кожного кроку
  const exclusiveRules = {
    worry: ["Нічого не трубує - просто цікавлюсь"],
    attempts: ["Все вищеперераховане", "Нічого системного"],
    hardest: ["Нема складнощів - все йде гладко👌"],
  };

  const exclusives = exclusiveRules[field] || [];
  const isClickedExclusive = exclusives.includes(option);

  if (isClickedExclusive) {
    // Варіант А: Клікнули на ексклюзивну опцію ("Нічого не турбує", "Все вищеперераховане" тощо)
    if (index === -1) {
      arr.length = 0; // Чистимо весь масив, зберігаючи посилання
      arr.push(option); // Залишаємо тільки цю опцію
    } else {
      arr.splice(index, 1); // Якщо вже була вибрана — просто прибираємо
    }
  } else {
    // Варіант Б: Клікнули на звичайну опцію
    if (index === -1) {
      // Перед додаванням звичайної опції, видаляємо виключні, якщо вони були обрані
      exclusives.forEach((exOption) => {
        const exIndex = arr.indexOf(exOption);
        if (exIndex !== -1) arr.splice(exIndex, 1);
      });
      arr.push(option); // Додаємо нову опцію в масив
    } else {
      arr.splice(index, 1); // Видаляємо, якщо клікнули повторно
    }
  }
};
</script>

<template>
  <div
    class="w-full max-w-md bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-2xl relative select-none min-h-[520px] flex flex-col justify-between"
  >
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

        <span class="text-xs font-bold text-emerald-400 tracking-wider uppercase">
          Крок {{ currentQuestionIndex + 1 }} з {{ totalQuestions }}
        </span>
      </div>

      <div class="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden mb-6">
        <div
          class="h-full bg-emerald-500 transition-all duration-300 ease-out"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>

      <div v-if="currentQuestionIndex === 0" class="space-y-4 animate-slide-in">
        <h3 class="text-lg font-black text-zinc-100 leading-snug">
          Що зараз турбує вас найбільше?
        </h3>
        <p class="text-xs text-zinc-400 -mt-2">Можна обрати кілька варіантів:</p>

        <div class="grid grid-cols-1 gap-2 pt-1">
          <button
            v-for="opt in [
              'Набирається або не йде вага',
              'Нормальна вага, але не подобається якість тіла',
              'Немає енергії',
              'Мала вага - хочу набрати',
              'Проблеми зі здоров’ям через вагу',
              'Нічого не трубує - просто цікавлюсь',
            ]"
            :key="opt"
            @click="toggleMultiSelect('worry', opt)"
            :class="
              answers.worry.includes(opt)
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                : 'border-zinc-800 bg-zinc-950/40 text-zinc-300 hover:border-zinc-700'
            "
            class="w-full p-3.5 text-left text-sm font-semibold border rounded-xl transition-all active:scale-[0.99] flex items-center justify-between"
          >
            <span>{{ opt }}</span>
            <span v-if="answers.worry.includes(opt)" class="text-emerald-400 text-xs">✓</span>
          </button>
        </div>
      </div>

      <div v-if="currentQuestionIndex === 1" class="space-y-4 animate-slide-in">
        <h3 class="text-lg font-black text-zinc-100 leading-snug">
          Наскільки ви готові слідувати рекомендаціям спеціаліста, щоб вирішити свою проблему?
        </h3>
        <p class="text-xs text-zinc-400 -mt-2">Оберіть варіант, який найкраще описує ваш стан:</p>

        <div class="grid grid-cols-1 gap-2 pt-1">
          <button
            v-for="item in [
              { score: 10, text: '10 з 10 - готова діяти системно й виконувати рекомендації' },
              { score: 9, text: '8-9 з 10 - готова, якщо буде зрозумілий πлан і віра в результат' },
              { score: 7, text: '6-7 з 10 - хочу змін, але боюсь, що зіллюсь' },
              { score: 5, text: '4-5 з 10 - поки не впевнена, що готова щось змінювати' },
              { score: 3, text: '1-3 з 10 - хочу результат, але не готова до змін' },
            ]"
            :key="item.score"
            @click="answers.readiness = item.text"
            :class="
              answers.readiness === item.text
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                : 'border-zinc-800 bg-zinc-950/40 text-zinc-300 hover:border-zinc-700'
            "
            class="w-full p-3.5 text-left text-xs sm:text-sm font-semibold border rounded-xl transition-all active:scale-[0.99]"
          >
            {{ item.text }}
          </button>
        </div>
      </div>

      <div v-if="currentQuestionIndex === 2" class="space-y-4 animate-slide-in">
        <h3 class="text-lg font-black text-zinc-100 leading-snug">
          Як ви вже пробували це вирішувати?
        </h3>
        <p class="text-xs text-zinc-400 -mt-2">Можна обрати кілька варіантів:</p>

        <div class="grid grid-cols-1 gap-2 pt-1">
          <button
            v-for="opt in [
              'Дієти та обмеження (час, розмір порції і тд)',
              'Просто правильне харчування',
              'Спорт чи більше руху',
              'БАДи, уколи, інші медичні методи',
              'Все вищеперераховане',
              'Нічого системного',
            ]"
            :key="opt"
            @click="toggleMultiSelect('attempts', opt)"
            :class="
              answers.attempts.includes(opt)
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                : 'border-zinc-800 bg-zinc-950/40 text-zinc-300 hover:border-zinc-700'
            "
            class="w-full p-3.5 text-left text-sm font-semibold border rounded-xl transition-all active:scale-[0.99] flex items-center justify-between"
          >
            <span>{{ opt }}</span>
            <span v-if="answers.attempts.includes(opt)" class="text-emerald-400 text-xs">✓</span>
          </button>
        </div>
      </div>

      <div v-if="currentQuestionIndex === 3" class="space-y-4 animate-slide-in">
        <h3 class="text-lg font-black text-zinc-100 leading-snug">Що вам дається найскладніше?</h3>
        <p class="text-xs text-zinc-400 -mt-2">Можна обрати kilka варіантів:</p>

        <div class="grid grid-cols-1 gap-2 pt-1">
          <button
            v-for="opt in [
              'Наче стараюсь, а результату нема',
              'Періодично зриваюсь',
              'Не розумію, з чого почати',
              'Важко втримати результат',
              'Нема складнощів - все йде гладко👌',
            ]"
            :key="opt"
            @click="toggleMultiSelect('hardest', opt)"
            :class="
              answers.hardest.includes(opt)
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                : 'border-zinc-800 bg-zinc-950/40 text-zinc-300 hover:border-zinc-700'
            "
            class="w-full p-3.5 text-left text-sm font-semibold border rounded-xl transition-all active:scale-[0.99] flex items-center justify-between"
          >
            <span>{{ opt }}</span>
            <span v-if="answers.hardest.includes(opt)" class="text-emerald-400 text-xs">✓</span>
          </button>
        </div>
      </div>

      <div v-if="currentQuestionIndex === 4" class="space-y-4 animate-slide-in">
        <h3 class="text-lg font-black text-zinc-100 leading-snug">Чим ви зараз займаєтесь?</h3>
        <p class="text-xs text-zinc-400 -mt-2">
          Важливо для розуміння рівня стресу та фіз. активності:
        </p>

        <div class="grid grid-cols-1 gap-2 pt-1">
          <button
            v-for="opt in [
              'Працюю вдома / в офісі (більш сидяча робота)',
              'Робота на ногах / active',
              'Декрет, не працюю',
              'Знаходжусь в пошуках роботи',
              'Пенсія, не працюю',
              'Інший тип зайнятості',
            ]"
            :key="opt"
            @click="answers.activity = opt"
            :class="
              answers.activity === opt
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                : 'border-zinc-800 bg-zinc-950/40 text-zinc-300 hover:border-zinc-700'
            "
            class="w-full p-3.5 text-left text-sm font-semibold border rounded-xl transition-all active:scale-[0.99]"
          >
            {{ opt }}
          </button>
        </div>
      </div>
    </div>

    <div class="mt-6">
      <button
        @click="nextQuestion"
        :disabled="!isCurrentStepValid"
        class="w-full py-4 bg-emerald-500 text-zinc-950 font-black text-base rounded-xl hover:bg-emerald-400 active:scale-[0.99] disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/10 uppercase tracking-wide"
      >
        {{ currentQuestionIndex === totalQuestions - 1 ? "Завершити реєстрацію 🚀" : "Далі →" }}
      </button>
    </div>
  </div>
</template>

<style scoped>
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
