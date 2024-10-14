<script setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const store = useProfileStore();
// alert module
const { alertMode, alertMessage, errorTimeout, hasError } = useAlert();
</script>

<template>
  <div
    class="flex h-screen w-screen items-center justify-center bg-gray-700 md:overflow-y-scroll md:py-20"
  >
    <UIAlert :mode="alertMode" :message="alertMessage" />
    <!-- center black block -->
    <div
      class="flex h-full w-full flex-col items-center justify-center gap-10 bg-black pb-20 pt-16 md:h-min md:w-3/5 md:rounded-xl lg:h-min lg:w-2/5"
    >
      <div class="flex flex-col gap-5">
        <LoginGoogle />
        <LoginGithub />
      </div>
      <LoginLocal />
    </div>
  </div>
</template>

<style scoped>
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 100px black inset;
  -webkit-text-fill-color: #e4e4e7;
  -webkit-text-fill-caret-color: #e4e4e7;
  caret-color: #e4e4e7;
}
</style>
