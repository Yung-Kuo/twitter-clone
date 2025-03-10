<script setup>
// alert module
const { alertMode, alertMessage, errorTimeout, hasError } = useAlert();
const OAuthSignIn = ref(true);
</script>

<template>
  <div
    class="flex h-screen w-screen items-center justify-center overflow-y-scroll bg-gray-700"
  >
    <UIAlert :mode="alertMode" :message="alertMessage" />
    <!-- center black block -->
    <div
      id="blackCard"
      class="z-10 grid h-full max-h-screen w-full grid-cols-1 grid-rows-1 overflow-y-scroll bg-black shadow-2xl shadow-gray-400 md:h-[40rem] md:w-[32rem] md:rounded-2xl md:bg-opacity-60 2xl:h-[50rem] 2xl:w-[40rem]"
    >
      <!-- Social Login -->
      <LoginTransitionFadeLeft>
        <div
          v-show="OAuthSignIn"
          class="col-start-1 row-start-1 flex h-max min-h-full w-full flex-col items-center justify-center gap-8 pb-32 pt-16"
        >
          <!-- twitter-clone logo -->
          <div class="grid grid-cols-1 grid-rows-1 pb-16">
            <h1
              class="z-20 col-start-1 row-start-1 text-5xl font-bold text-gray-400 transition-all sm:text-6xl"
            >
              twitter-clone
            </h1>
            <h1
              class="z-10 col-start-1 row-start-1 translate-x-1 translate-y-1 text-5xl font-bold text-gray-600 transition-all sm:text-6xl"
            >
              twitter-clone
            </h1>
            <h1
              class="col-start-1 row-start-1 translate-x-2 translate-y-2 text-5xl font-bold text-gray-700 transition-all sm:text-6xl"
            >
              twitter-clone
            </h1>
          </div>
          <!-- <div class="opacity-40">
            <LoginApple class="!cursor-not-allowed" />
          </div> -->
          <LoginFacebook />
          <LoginGoogle />
          <LoginGithub />
          <div class="flex h-min w-5/6 items-center justify-center gap-4">
            <span class="h-0 grow rounded-full border-2 border-gray-700"></span>
            <span class="text-xl font-bold text-gray-400">or</span>
            <span class="h-0 grow rounded-full border-2 border-gray-700"></span>
          </div>
          <LoginAnonymous />
          <UIButton3DGlow
            class="h-12 w-72 md:h-14 md:w-80"
            @click="OAuthSignIn = !OAuthSignIn"
          >
            <span class="flex w-full justify-center"> Email and Password </span>
          </UIButton3DGlow>
        </div>
      </LoginTransitionFadeLeft>
      <!-- Email & Password -->
      <LoginTransitionFadeRight>
        <div
          v-show="!OAuthSignIn"
          class="col-start-1 row-start-1 flex h-full w-full flex-col items-center"
        >
          <!-- top banner -->
          <!-- go back to social login -->
          <div
            class="group sticky left-0 top-0 z-20 flex h-16 w-full cursor-pointer rounded-none bg-zinc-200 text-black transition-all md:rounded-t-xl md:hover:bg-zinc-200 2xl:h-20"
            @mousedown="OAuthSignIn = !OAuthSignIn"
          >
            <div
              class="flex h-full items-center transition-all md:group-hover:-translate-x-4"
            >
              <div class="mx-4 text-2xl transition-all md:mx-8 2xl:text-4xl">
                <IconsBack />
              </div>
              <span class="text-2xl font-bold transition-all 2xl:text-3xl"
                >Back to Social Login</span
              >
            </div>
          </div>
          <!-- content -->
          <div class="flex h-full w-full items-center justify-center">
            <div class="flex w-5/6 flex-col gap-5 pb-16 xl:w-4/6">
              <div class="w-full py-5">
                <p
                  class="w-full font-light text-red-400 transition-all 2xl:text-lg"
                >
                  * For existing users only. New users please use social login
                  methods.
                </p>
              </div>
              <LoginLocal />
            </div>
          </div>
        </div>
      </LoginTransitionFadeRight>
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
#blackCard::-webkit-scrollbar {
  width: 0px;
  height: 0px;
}
#blackCard {
  scrollbar-width: none;
}
</style>
