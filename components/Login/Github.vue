<script setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();
async function signInWithGithub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: "http://localhost:3000/confirm",
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
