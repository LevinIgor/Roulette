<!-- src/components/SuccessScreen.vue -->
<script setup>
// Замени 'твой_ник_инсты' на реальный юзернейм твоего аккаунта.
// Эта ссылка заставит приложение Instagram на телефоне сразу открыть Директ с тобой.
const instaDirectUrl = "https://ig.me/m/твой_ник_инсты";
</script>

<template>
  <div
    class="w-full max-w-md bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-2xl shadow-emerald-950/20 text-center select-none relative overflow-hidden animate-fade-in"
  >
    <!-- Анимированная иконка подарка -->
    <div
      class="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30"
    >
      <span class="text-4xl animate-pulse">🎁</span>
      <div
        class="absolute inset-0 rounded-full border border-emerald-500/20 animate-ping opacity-40"
      ></div>
    </div>

    <!-- Главный заголовок -->
    <h2 class="text-2xl font-black text-emerald-400 uppercase tracking-wide mb-2">
      Бонус зафіксовано!
    </h2>
    <p class="text-sm text-zinc-300 font-medium px-4 mb-6 leading-relaxed">
      Ваш
      <span class="text-zinc-50 font-bold">Персональний розбір (вартістю 2500 грн)</span> успішно
      закріплено за вашим Instagram-акаунтом!
    </p>

    <!-- Разделитель -->
    <div class="w-full h-px bg-zinc-800 my-5"></div>

    <!-- Инструкция -->
    <h3 class="text-xs font-bold text-zinc-500 uppercase tracking-widest text-left mb-4 px-1">
      Що робити далі:
    </h3>

    <div class="space-y-4 text-left mb-8 px-1">
      <!-- Шаг 1 -->
      <div class="flex gap-3.5 items-start">
        <div
          class="w-6 h-6 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center text-xs font-bold text-emerald-400 shrink-0 mt-0.5"
        >
          1
        </div>
        <div>
          <h4 class="text-sm font-bold text-zinc-200">Перевірте свій Директ</h4>
          <p class="text-xs text-zinc-400 mt-0.5 leading-relaxed">
            Мій чат-бот ManyChat вже надіслав вам автоматичне підтвердження виграшу та перші
            інструкції.
          </p>
        </div>
      </div>

      <!-- Шаг 2 -->
      <div class="flex gap-3.5 items-start">
        <div
          class="w-6 h-6 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center text-xs font-bold text-emerald-400 shrink-0 mt-0.5"
        >
          2
        </div>
        <div>
          <h4 class="text-sm font-bold text-zinc-200">Чекайте на повідомлення від мене</h4>
          <p class="text-xs text-zinc-400 mt-0.5 leading-relaxed">
            Я особисто вивчу вашу анкету найближчим часом, і ми погодимо дату та час для нашої
            зустрічі в Zoom.
          </p>
        </div>
      </div>
    </div>

    <!-- Предупреждение про папку "Запросы" -->
    <div class="bg-zinc-950/60 border border-zinc-800/60 p-4 rounded-xl mb-6 text-left">
      <p class="text-xs text-zinc-400 leading-relaxed">
        💡 <strong class="text-zinc-200">Важливо:</strong> Якщо ми ще не підписані один на одного,
        повідомлення може потрапити в папку
        <span class="text-emerald-400 font-bold">«Запити»</span>. Обов'язково перевірте її.
      </p>
    </div>

    <!-- Мощная финишная кнопка-диплинк -->
    <a
      :href="instaDirectUrl"
      target="_blank"
      class="inline-flex items-center justify-center gap-2 w-full py-4 bg-emerald-500 text-zinc-950 font-black text-base rounded-xl hover:bg-emerald-400 active:scale-[0.99] transition-all shadow-lg shadow-emerald-500/20 uppercase tracking-wide"
    >
      <span>Відкрити мій Директ</span>
      <span class="text-lg">💬</span>
    </a>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
