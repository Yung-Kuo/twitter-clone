<script setup>
import { IconsAnonymous } from "#components";

const supabase = useSupabaseClient();
const showCaptcha = ref(false);
const captchaToken = ref("");
async function signInAnonymously() {
  if (!showCaptcha.value) {
    showCaptcha.value = true;
    return;
  }
  const { data, error } = await supabase.auth.signInAnonymously({
    options: {
      captchaToken: captchaToken.value,
    },
  });

  if (error) console.log(error);
  if (data) {
    console.log(data);
    router.push("/");
  }
}
</script>
<template>
  <div>
    <UIButton3DGlow
      class="h-12 w-72 md:h-14 md:w-80"
      @mousedown="signInAnonymously()"
    >
      <IconsAnonymous />
      Sign In Anonymously
    </UIButton3DGlow>
    <Transition
      enter-active-class="transition-all duration-500 overflow-y-hidden"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-screen"
      leave-active-class="transition-all duration-500 overflow-y-hidden"
      leave-from-class="opacity-100 max-h-screen"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="showCaptcha" class="flex w-full justify-center py-5">
        <NuxtTurnstile v-model="captchaToken" />
      </div>
    </Transition>
  </div>
</template>
