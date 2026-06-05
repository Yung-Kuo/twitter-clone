<script setup>
import { useAlertKey } from "~/composables/keys";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { showError } = inject(useAlertKey);
const loading = ref(false);
// email & password
const email = ref("");
const password = ref("");
const emailValidFlag = ref(true);
const passwordValidFlag = ref(true);
const buttonActiveFlag = computed(() => {
  // if (emailValidFlag.value && passwordValidFlag.value) return true;
  // else return false;
  return emailValidFlag.value && passwordValidFlag.value;
});
async function _signUp() {
  if (!email.value) {
    emailValidFlag.value = false;
    showError("Please enter your email address!");
  } else if (!validateEmail()) {
    emailValidFlag.value = false;
  } else if (!password.value) {
    passwordValidFlag.value = false;
    showError("Please enter password!");
  } else {
    try {
      loading.value = true;
      const { error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
      });
      if (error) throw error;
      else alert("Check your email for verification");
    } catch (error) {
      showError(error.message);
      emailValidFlag.value = false;
      passwordValidFlag.value = false;
    } finally {
      loading.value = false;
    }
  }
}

watch(
  user,
  () => {
    if (user.value) {
      // Redirect to protected page
      return navigateTo("/");
    }
  },
  { immediate: true }
);
async function login() {
  if (!email.value) {
    emailValidFlag.value = false;
    showError("Please enter your email address!");
  } else if (!validateEmail()) {
    emailValidFlag.value = false;
    showError("Please enter a valid email address");
  } else if (!password.value) {
    passwordValidFlag.value = false;
    showError("Please enter password!");
  } else {
    try {
      loading.value = true;
      const { error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      });
      if (error) throw error;
      // watcher above will redirect to protected page
      // if (data) {}
    } catch (error) {
      showError(error.message);
      emailValidFlag.value = false;
      passwordValidFlag.value = false;
    } finally {
      loading.value = false;
    }
  }
}

function validateEmail() {
  if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email.value)) {
    emailValidFlag.value = false;
    return false;
  } else {
    emailValidFlag.value = true;
    return true;
  }
}
</script>
<template>
  <div class="flex w-full flex-col gap-10">
    <!-- email -->
    <UIInput
      id="email"
      v-model:text="email"
      type="email"
      :flag="emailValidFlag"
      @update-valid="(value) => (emailValidFlag = value)"
      >Email</UIInput
    >
    <!--  -->
    <!-- password -->
    <UIInput
      id="password"
      v-model:text="password"
      type="password"
      :flag="passwordValidFlag"
      @update-valid="(value) => (passwordValidFlag = value)"
      >Password</UIInput
    >
    <!--  -->

    <!-- button -->
    <div class="flex w-full justify-between">
      <div class="w-2/5 md:w-1/3">
        <UIButton
          color="orange"
          :solid="true"
          :active="buttonActiveFlag"
          @mousedown="login()"
          >Log In</UIButton
        >
      </div>
      <div class="invisible pointer-events-none w-2/5 md:w-1/3" aria-hidden="true">
        <UIButton
          color="orange"
          :solid="false"
          :active="false"
          type="button"
          tabindex="-1"
          >Sign Up</UIButton
        >
      </div>
    </div>
  </div>
</template>
