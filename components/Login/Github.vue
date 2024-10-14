<script setup>
const supabase = useSupabaseClient();
async function signInWithGithub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    // options: {
    //   redirectTo: "/",
    // },
  });
}
</script>
<template>
  <LoginOAuthButton @mousedown="signInWithGithub()">
    <IconsGithub />
    Log in with Github
  </LoginOAuthButton>
</template>
