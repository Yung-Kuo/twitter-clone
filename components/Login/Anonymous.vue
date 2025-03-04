<script setup>
const supabase = useSupabaseClient();
const captchaToken = ref("");
async function signInAnonymously() {
  const { data, error } = await supabase.auth.signInAnonymously({
    options: {
      captchaToken: captchaToken.value,
    },
  });

  if (error) console.log(error);
  if (data) console.log(data);
}
</script>
<template>
  <UIButton3DGlow
    class="h-12 w-72 md:h-14 md:w-80"
    @mousedown="signInAnonymously()"
  >
    <!-- <NuxtTurnstile v-model="captchaToken" /> -->
    Sign In Anonymously
  </UIButton3DGlow>
</template>
