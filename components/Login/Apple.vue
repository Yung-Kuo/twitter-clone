<script setup>
async function signInWithApple() {
  const supabase = useSupabaseClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "apple",
    options: {
      redirectTo: "http://localhost:3000/confirm",
    },
  });
  if (error) console.error(error);
}
</script>
<template>
  <UIButton3DGlow
    class="h-12 w-72 md:h-14 md:w-80"
    @mousedown="signInWithApple()"
  >
    <IconsApple />
    Log in with Apple
  </UIButton3DGlow>
</template>
