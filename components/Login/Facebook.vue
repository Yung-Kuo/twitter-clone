<script setup>
const config = useRuntimeConfig();
const supabase = useSupabaseClient();
async function signInWithFacebook() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "facebook",
    options: {
      redirectTo: `${config.public.baseURL}/confirm`,
    },
  });
  if (error) console.log(error);
}
</script>
<template>
  <UIButton3DGlow
    class="h-12 w-72 md:h-14 md:w-80"
    @mousedown="signInWithFacebook()"
  >
    <IconsFacebook />
    Log in with Facebook
  </UIButton3DGlow>
</template>
