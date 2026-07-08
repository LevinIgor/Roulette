<script setup>
// Оголошуємо подію для локального переключення етапів в App.vue
defineEmits(["on-complete"]);
</script>

<template>
  <div
    class="w-full max-w-md bg-transparent sm:bg-zinc-900 border border-transparent sm:border-zinc-800 p-4 sm:p-6 rounded-none sm:rounded-2xl shadow-none sm:shadow-2xl text-center select-none animate-fade-in flex flex-col justify-center min-h-[85vh] sm:min-h-0"
  >
    <div>
      <div
        class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] sm:text-xs font-bold mb-3 sm:mb-5 tracking-wide uppercase"
      >
        🥳 Вау, вітаю!
      </div>

      <h2 class="text-lg sm:text-xl font-black text-zinc-100 mb-3 sm:mb-5 leading-snug px-1">
        Ви виграли
      </h2>
    </div>

    <div
      class="relative bg-zinc-950 border border-zinc-850 rounded-xl p-4 sm:p-5 mb-4 sm:mb-6 overflow-hidden shadow-inner"
    >
      <div
        class="absolute left-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-zinc-900 sm:bg-zinc-900 rounded-full border-r border-zinc-850"
      ></div>
      <div
        class="absolute right-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-zinc-900 sm:bg-zinc-900 rounded-full border-l border-zinc-850"
      ></div>

      <h3
        class="text-sm sm:text-base font-extrabold text-zinc-200 uppercase tracking-wide leading-snug"
      >
        <span class="text-emerald-400 block sm:inline">ПЕРСОНАЛЬНИЙ РОЗБІР</span> вашого запиту з
        побудовою чіткого плану дій!
      </h3>

      <div
        class="mt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm"
      >
        <span class="text-zinc-500 line-through font-medium">Вартість: 2500 грн</span>
        <span
          class="bg-emerald-500 text-zinc-950 px-2 py-0.5 rounded text-[10px] sm:text-xs font-black uppercase tracking-wider animate-pulse"
        >
          Для вас: 0 грн 🎁
        </span>
      </div>
    </div>

    <div>
      <h4
        class="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-wider text-left mb-2.5 px-1"
      >
        За результатами розбору ми:
      </h4>

      <div class="space-y-2 sm:space-y-3 text-left mb-5 sm:mb-6 px-1">
        <div
          class="flex items-center gap-3 bg-zinc-950/30 p-3 rounded-xl border border-zinc-850/50"
        >
          <div class="text-lg select-none flex-shrink-0">⚙️</div>
          <p class="text-xs sm:text-sm font-semibold text-zinc-300 leading-tight">
            Зрозуміємо головні причини, які гальмують ваш прогрес
          </p>
        </div>

        <div
          class="flex items-center gap-3 bg-zinc-950/30 p-3 rounded-xl border border-zinc-850/50"
        >
          <div class="text-lg select-none flex-shrink-0">🎯</div>
          <p class="text-xs sm:text-sm font-semibold text-zinc-300 leading-tight">
            Визначимо, на що вам треба вплинути в першу чергу
          </p>
        </div>

        <div
          class="flex items-center gap-3 bg-zinc-950/30 p-3 rounded-xl border border-zinc-850/50"
        >
          <div class="text-lg select-none flex-shrink-0">📝</div>
          <p class="text-xs sm:text-sm font-semibold text-zinc-300 leading-tight">
            Складемо чіткий план наступних кроків саме під ваш випадок
          </p>
        </div>
      </div>
    </div>

    <div class="mt-auto sm:mt-0">
      <p class="text-[11px] sm:text-xs text-zinc-400 mb-4 leading-relaxed px-2">
        Щоб впевнитись, що я можу бути вам корисна у вирішенні вашого запиту, прошу вас заповнити
        коротеньку анкету.
      </p>

      <button
        @click="$emit('on-complete')"
        class="w-full py-3.5 sm:py-4 bg-emerald-500 text-zinc-950 font-black text-sm sm:text-base rounded-xl hover:bg-emerald-400 active:scale-[0.98] transition-all shadow-lg shadow-emerald-500/10 tracking-wide uppercase"
      >
        Заповнити анкету 🚀
      </button>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
