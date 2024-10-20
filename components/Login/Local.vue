<script setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const profileStore = useProfileStore();
const { alertMode, alertMessage, hasError } = inject("useAlert");
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
async function signUp() {
  if (!email.value) {
    emailValidFlag.value = false;
    alertMode.value = "error";
    alertMessage.value = "Please enter your email address!";
    hasError();
  } else if (!validateEmail()) {
    emailValidFlag.value = false;
  } else if (!password.value) {
    passwordValidFlag.value = false;
    alertMode.value = "error";
    alertMessage.value = "Please enter password!";
    hasError();
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
      alertMode.value = "error";
      alertMessage.value = error.message;
      console.log(alertMessage.value);
      emailValidFlag.value = false;
      passwordValidFlag.value = false;
      hasError();
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
  console.log("login");
  if (!email.value) {
    emailValidFlag.value = false;
    alertMode.value = "error";
    alertMessage.value = "Please enter your email address!";
    hasError();
  } else if (!validateEmail()) {
    emailValidFlag.value = false;
    alertMode.value = "error";
    alertMessage.value = "Please enter a valid email address";
    hasError();
  } else if (!password.value) {
    passwordValidFlag.value = false;
    alertMode.value = "error";
    alertMessage.value = "Please enter password!";
    hasError();
  } else {
    try {
      loading.value = true;
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      });
      console.log(data);
      if (error) throw error;
      // watcher above will redirect to protected page
      // if (data) {}
    } catch (error) {
      alertMode.value = "error";
      alertMessage.value = error.message;
      console.log(alertMessage.value);
      emailValidFlag.value = false;
      passwordValidFlag.value = false;
      hasError();
    } finally {
      loading.value = false;
    }
  }
}

function validateEmail() {
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.value)) {
    emailValidFlag.value = false;
    return false;
  } else {
    emailValidFlag.value = true;
    return true;
  }
}
const isLogin = ref(true);
</script>
<template>
  <div class="flex w-full flex-col gap-10">
    <!-- email -->
    <UIInput
      type="email"
      id="email"
      v-model:text="email"
      :flag="emailValidFlag"
      @updateValid="(value) => (emailValidFlag = value)"
      >Email</UIInput
    >
    <!--  -->
    <!-- password -->
    <UIInput
      type="password"
      id="password"
      v-model:text="password"
      :flag="passwordValidFlag"
      @updateValid="(value) => (passwordValidFlag = value)"
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
      <div class="w-2/5 md:w-1/3">
        <UIButton
          color="orange"
          :solid="false"
          :active="buttonActiveFlag && false"
          @mousedown="false && signUp()"
          >Sign Up</UIButton
        >
      </div>
    </div>
  </div>
</template>
