<script setup>
async function signInWithApple() {
  const supabase = useSupabaseClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "apple",
    options: {
      redirectTo: "http://localhost:3000/confirm",
    },
  });
  if (error) console.log(error);
}
</script>
<template>
  <UIButton3DGlow class="h-14 w-72 md:w-80" @mousedown="">
    <IconsApple />
    Log in with Apple
  </UIButton3DGlow>
</template>
