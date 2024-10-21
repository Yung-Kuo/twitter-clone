<script setup>
const config = useRuntimeConfig();
const supabase = useSupabaseClient();
async function signInWithGithub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${config.public.baseURL}/confirm`,
    },
  });
  if (error) console.log(error);
}
</script>
<template>
  <UIButton3DGlow class="h-14 w-72 md:w-80" @mousedown="signInWithGithub()">
    <IconsGithub />
    Log in with Github
  </UIButton3DGlow>
</template>
