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
  if (data) console.log(data);
}
</script>
<template>
  <UIButton3DGlow
    class="h-12 w-72 md:h-14 md:w-80"
    @mousedown="signInWithGithub()"
  >
    <IconsGithub />
    Log in with Github
  </UIButton3DGlow>
</template>
