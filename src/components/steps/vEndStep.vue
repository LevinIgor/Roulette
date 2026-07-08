<!-- src/components/SuccessScreen.vue -->
<script setup>
// Замени 'твой_ник_инсты' на реальный юзернейм твоего аккаунта.
// Эта ссылка заставит приложение Instagram на телефоне сразу открыть Директ с тобой.
const instaDirectUrl = "https://ig.me/m/n_nutriition";
</script>

<template>
  <div
    class="w-full max-w-md bg-transparent sm:bg-zinc-900 border border-transparent sm:border-zinc-800 p-4 sm:p-6 rounded-none sm:rounded-2xl shadow-none sm:shadow-2xl text-center select-none relative overflow-hidden animate-fade-in flex flex-col justify-center min-h-[85vh] sm:min-h-0"
  >
    <div
      class="relative w-18 h-18 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-5 flex items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
    >
      <span class="text-3xl sm:text-4xl animate-bounce">🎁</span>
      <div
        class="absolute inset-0 rounded-full border border-emerald-500/20 animate-ping opacity-35"
      ></div>
    </div>

    <div>
      <h2
        class="text-xl sm:text-2xl font-black text-emerald-400 uppercase tracking-wide mb-2 drop-shadow-[0_0_15px_rgba(16,185,129,0.2)]"
      >
        Бонус зафіксовано!
      </h2>
      <p class="text-xs sm:text-sm text-zinc-300 font-medium px-2 mb-4 sm:mb-6 leading-relaxed">
        Ваш
        <span class="text-zinc-50 font-extrabold underline decoration-emerald-500/50 decoration-2"
          >Персональний розбір (2500 грн)</span
        >
        успішно закріплено за вашим профілем!
      </p>
    </div>

    <div
      class="w-full h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent my-3 sm:my-4"
    ></div>

    <div>
      <h3
        class="text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest text-left mb-3.5 px-1"
      >
        Що робити далі:
      </h3>

      <div class="space-y-3.5 text-left mb-5 sm:mb-6 px-1">
        <div
          class="flex gap-3.5 items-start bg-zinc-950/30 p-3 rounded-xl border border-zinc-850/40"
        >
          <div
            class="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[11px] font-black text-emerald-400 shrink-0 mt-0.5"
          >
            1
          </div>
          <div>
            <h4 class="text-xs sm:text-sm font-bold text-zinc-200">Перевірте свій Директ</h4>
            <p class="text-[11px] sm:text-xs text-zinc-400 mt-0.5 leading-normal">
              Бот уже надіслав вам автоматичне підтвердження виграшу та перші інструкції у приватні
              повідомлення.
            </p>
          </div>
        </div>

        <div
          class="flex gap-3.5 items-start bg-zinc-950/30 p-3 rounded-xl border border-zinc-850/40"
        >
          <div
            class="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[11px] font-black text-emerald-400 shrink-0 mt-0.5"
          >
            2
          </div>
          <div>
            <h4 class="text-xs sm:text-sm font-bold text-zinc-200">
              Очікуйте на особисте повідомлення
            </h4>
            <p class="text-[11px] sm:text-xs text-zinc-400 mt-0.5 leading-normal">
              Я вивчу вашу анкету найближчим часом, і ми погодимо зручну дату та час для нашої
              зустрічі в Zoom.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-amber-500/5 border border-amber-500/10 p-3 rounded-xl mb-5 sm:mb-6 text-left">
      <p class="text-[11px] text-amber-400/90 leading-relaxed">
        ⚠️ <strong class="text-zinc-200 font-bold">Важливо:</strong> Якщо ми не підписані взаємно,
        повідомлення може потрапити в папку <span class="font-bold underline">«Запити»</span>.
        Обов'язково загляньте туди!
      </p>
    </div>

    <div class="mt-auto sm:mt-0">
      <a
        :href="instaDirectUrl"
        target="_blank"
        class="inline-flex items-center justify-center gap-2 w-full py-4 bg-emerald-500 text-zinc-950 font-black text-sm sm:text-base rounded-xl hover:bg-emerald-400 active:scale-[0.98] transition-all shadow-xl shadow-emerald-500/20 uppercase tracking-widest relative overflow-hidden group"
      >
        <span
          class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine"
        ></span>

        <span>Відкрити мій Директ</span>
        <span class="text-base sm:text-lg">💬</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
/* Анімація відблиску на кнопці для єдиного стилю з барабаном */
@keyframes shine {
  100% {
    transform: translateX(100%);
  }
}
.group-hover\:animate-shine:hover {
  animation: shine 0.8s ease-out;
}
</style>
