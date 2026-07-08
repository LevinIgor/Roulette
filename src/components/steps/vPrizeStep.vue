<script setup>
// Оголошуємо подію для локального переключення етапів в App.vue
defineEmits(["on-complete"]);
</script>

<template>
  <div
    class="w-full max-w-md bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-2xl shadow-emerald-950/20 text-center select-none animate-fade-in"
  >
    <div
      class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-5 tracking-wide uppercase"
    >
      🥳 Вау, вітаю!
    </div>

    <h2 class="text-xl font-black text-zinc-100 mb-5 leading-snug px-1">Ви виграли</h2>

    <div class="relative bg-zinc-950 border border-zinc-800/80 rounded-xl p-5 mb-6 overflow-hidden">
      <div
        class="absolute left-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-zinc-900 rounded-full border-r border-zinc-800"
      ></div>
      <div
        class="absolute right-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-zinc-900 rounded-full border-l border-zinc-800"
      ></div>

      <h3 class="text-base font-extrabold text-zinc-200 uppercase tracking-wide">
        <span class="text-emerald-400">ПЕРСОНАЛЬНИЙ РОЗБІР</span> вашого запиту з побудовою чіткого
        плану дій!
      </h3>

      <div class="mt-3 flex items-center justify-center gap-3 text-sm">
        <span class="text-zinc-500 line-through font-medium">Звичайна вартість: 2500 грн</span>
        <span
          class="bg-emerald-500 text-zinc-950 px-2 py-0.5 rounded text-xs font-black uppercase tracking-wider animate-pulse"
        >
          Для вас: 0 грн 🎁
        </span>
      </div>
    </div>

    <h4 class="text-xs font-bold text-zinc-400 uppercase tracking-wider text-left mb-3.5 px-1">
      За результатами персонального розбору ми:
    </h4>

    <div class="space-y-3 text-left mb-6 px-1">
      <div class="flex items-start gap-3 bg-zinc-950/40 p-3.5 rounded-xl border border-zinc-800/40">
        <div class="text-xl mt-0.5 select-none">⚙️</div>
        <div>
          <p class="text-sm font-semibold text-zinc-200 leading-snug">
            Зрозуміємо головні причини, які гальмують ваш прогрес
          </p>
        </div>
      </div>

      <div class="flex items-start gap-3 bg-zinc-950/40 p-3.5 rounded-xl border border-zinc-800/40">
        <div class="text-xl mt-0.5 select-none">🎯</div>
        <div>
          <p class="text-sm font-semibold text-zinc-200 leading-snug">
            Визначимо, на що вам треба вплинути в першу чергу
          </p>
        </div>
      </div>

      <div class="flex items-start gap-3 bg-zinc-950/40 p-3.5 rounded-xl border border-zinc-800/40">
        <div class="text-xl mt-0.5 select-none">📝</div>
        <div>
          <p class="text-sm font-semibold text-zinc-200 leading-snug">
            Складемо чіткий план наступних кроків саме під ваш випадок 👌
          </p>
        </div>
      </div>
    </div>

    <p class="text-xs text-zinc-100 mb-5 leading-relaxed px-1">
      Щоб впевнитись, що я можу бути вам корисна у вирішенні вашого запиту, я прошу вас заповнити
      коротеньку анкету.
    </p>

    <button
      @click="$emit('on-complete')"
      class="w-full py-4 bg-emerald-500 text-zinc-950 font-black text-base rounded-xl hover:bg-emerald-400 active:scale-[0.99] transition-all shadow-lg shadow-emerald-500/10 tracking-wide uppercase"
    >
      Заповнити анкету 🚀
    </button>
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
