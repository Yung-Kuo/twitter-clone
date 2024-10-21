<script setup>
const config = useRuntimeConfig();
const supabase = useSupabaseClient();
async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${config.public.baseURL}/confirm`,
    },
  });
  if (error) console.log(error);
}
</script>
<template>
  <UIButton3DGlow class="h-14 w-72 md:w-80" @mousedown="signInWithGoogle()">
    <IconsGoogle />
    Log in with Google
  </UIButton3DGlow>
</template>
