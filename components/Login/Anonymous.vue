<script setup>
import { IconsAnonymous } from "#components";

const supabase = useSupabaseClient();
const router = useRouter();
const showCaptcha = ref(false); // Show captcha immediately
const captchaToken = ref("");
const loading = ref(false);
const errorMsg = ref("");

async function signInAnonymously() {
  loading.value = true;
  errorMsg.value = "";

  try {
    const { data, error } = await supabase.auth.signInAnonymously({
      options: {
        captchaToken: captchaToken.value,
      },
    });

    if (error) {
      console.error("Supabase Error:", error);
      errorMsg.value = "Sign-in failed. Please try again.";
    } else if (data) {
      console.log("Supabase Data:", data);
      console.log("Redirecting to /");
      router.push("/");
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("Supabase Session:", session);
    }
  } catch (err) {
    console.error("Unexpected Error:", err);
    errorMsg.value = "An unexpected error occurred.";
  } finally {
    loading.value = false;
  }
}

watch(captchaToken, (newValue) => {
  if (showCaptcha.value && newValue) {
    signInAnonymously();
  }
});
</script>

<template>
  <div>
    <UIButton3DGlow
      class="h-12 w-72 md:h-14 md:w-80"
      :disabled="loading || captchaToken"
      @click="showCaptcha = true"
    >
      <IconsAnonymous />
      <span v-if="loading">Signing In...</span>
      <span v-else>Sign In Anonymously</span>
    </UIButton3DGlow>
    <div v-if="showCaptcha" class="flex w-full justify-center py-5">
      <NuxtTurnstile v-model="captchaToken" />
    </div>
    <div v-if="errorMsg" class="mt-2 text-red-500">{{ errorMsg }}</div>
  </div>
</template>
