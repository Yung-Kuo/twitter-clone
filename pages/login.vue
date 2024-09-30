<script setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const store = useProfileStore();
const loading = ref(false);
// alert module
const { alertMode, alertMessage, errorTimeout, hasError } = useAlert();
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

const loginInterval = ref(null);
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
      const { error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      });
      if (error) throw error;
      else {
        loginInterval.value = setInterval(async () => {
          if (user.value) {
            await store.fetchProfile();
            navigateTo("/");
            clearInterval(loginInterval.value);
          }
        }, 100);
      }
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
</script>

<template>
  <div
    class="flex h-screen w-screen items-center justify-center bg-gray-700 md:overflow-y-scroll md:py-20"
  >
    <UIAlert :mode="alertMode" :message="alertMessage" />
    <!-- center black block -->
    <div
      class="flex h-full w-full items-center justify-center bg-black md:h-min md:w-3/5 md:rounded-xl lg:h-min lg:w-2/5"
    >
      <div class="flex w-5/6 flex-col gap-10 px-10 py-20">
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
              @click="buttonActiveFlag ? login() : null"
              >Login</UIButton
            >
          </div>
          <div class="w-2/5 md:w-1/3">
            <UIButton
              color="orange"
              :solid="false"
              :active="buttonActiveFlag"
              @click="buttonActiveFlag ? signUp() : null"
              >Sign Up</UIButton
            >
          </div>
        </div>
        <!--  -->
      </div>
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
