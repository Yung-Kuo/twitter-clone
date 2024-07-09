<script setup>
import { storeToRefs } from "pinia";
import { useProfileStore } from "~/stores/profile";
import { usePostStore } from "~/stores/post";
definePageMeta({
  middleware: ["auth"],
});

const user = useSupabaseUser();
const store = useProfileStore();
const postStore = usePostStore();
const { getError } = storeToRefs(store);
const { alertMode, alertMessage, errorTimeout, hasError } = useAlert();

// post action menu / repost menu
const {
  showMenu,
  menu_pid,
  menu_uid,
  type,
  icon_id,
  toggleMenu,
  handleClickOutside,
  menuGetRect,
} = useToggleMenu();
provide("useToggleMenu", {
  showMenu,
  menu_pid,
  menu_uid,
  type,
  icon_id,
  toggleMenu,
  handleClickOutside,
  menuGetRect,
});
provide("toggleMenu", toggleMenu);
provide("menuGetRect", menuGetRect);
provide("toggleAccountMenu", { showMenu, type, menuGetRect });

onMounted(async () => {
  watchEffect(() => {
    if (!user.value) {
      navigateTo("/login");
    }
  });
  if (store.noProfile) {
    await store.fetchProfile();
    if (getError.value) {
      alertMode.value = "error";
      alertMessage.value = getError.value;
      hasError();
    }
  }
  Object.assign(userProfile, store.getProfile);
  if (!userProfile.username) firstEdit.value = true;
});

const userProfile = reactive({});
const firstEdit = ref(false);
watch(userProfile, (curVal) => {
  if (curVal.first_name || curVal.last_name) {
    // When there's a first_name or last_name
    if (firstEdit.value) {
      // When user edit username for the first time
      curVal.username = curVal.first_name + "_" + curVal.last_name;
    }
  } else if (!curVal.username && !curVal.first_name && !curVal.last_name) {
    // When all fields are empty
    firstEdit.value = true;
  } else if (firstEdit.value) {
    // During first edit, when user empty the first&last name field, empty the username field.
    curVal.username = "";
  }
});

// avatar image upload
const files = ref(null);
const file = ref(null);
const src = ref(null);
const fileExt = ref();
const filePath = ref();
const old_avatar_url = ref();
function onFileSelected(event) {
  files.value = event.target.files;
  try {
    if (!files.value || files.value.length === 0) {
      throw new Error("You must select an image to upload.");
    }
    file.value = files.value[0];
    src.value = URL.createObjectURL(file.value);
    fileExt.value = file.value.name.split(".").pop();
    filePath.value = `${Math.random()}.${fileExt.value}`;
  } catch (error) {
    alertMode.value = "error";
    alertMessage.value = error.message;
  }
}
async function onUpload() {
  console.log("filePath: ", filePath.value);
  await store.uploadAvatar(file.value, filePath.value);
  if (getError.value) {
    console.log("onUpload error");
    alertMode.value = "error";
    alertMessage.value = getError.value;
    hasError();
  } else {
    old_avatar_url.value = userProfile.avatar_url;
    userProfile.avatar_url = filePath.value;
    console.log("userProfile.avatar_url: ", userProfile.avatar_url);
    files.value = null;
    file.value = null;
    fileExt.value = null;
    filePath.value = null;
  }
}

async function updateProfile() {
  if (file.value && filePath.value) {
    console.log(`old avatar_url is ${userProfile.avatar_url}`);
    await onUpload();
    console.log(`new avatar_url is ${userProfile.avatar_url}`);
  }
  console.log("userProfile: ", userProfile);
  await store.updateProfile(userProfile);
  await postStore.downloadAvatar(userProfile.id, userProfile.avatar_url);
  if (getError.value) {
    alertMode.value = "error";
    alertMessage.value = getError.value;
    hasError();
  } else {
    if (old_avatar_url.value) {
      store.deleteOldAvatar(old_avatar_url.value);
      old_avatar_url.value = null;
    }
    Object.assign(userProfile, store.getProfile);
    alertMode.value = "notify";
    alertMessage.value = "Your profile has been updated!";
    hasError();
  }
}

// input validation
const usernameValidFlag = ref(true);
const first_nameValidFlag = ref(true);
const last_nameValidFlag = ref(true);
const buttonActiveFlag = computed(() => {
  if (
    usernameValidFlag.value &&
    first_nameValidFlag.value &&
    last_nameValidFlag.value
  )
    return true;
  else return false;
});
</script>

<template>
  <div class="flex h-screen w-screen bg-black">
    <!-- navigation -->
    <MainLeft></MainLeft>
    <MainCenter>
      <template #main>
        <div
          class="flex h-full w-full items-center justify-end overflow-scroll pb-40 pt-20"
        >
          <!--  -->
          <div
            class="flex h-full w-full items-center justify-center md:w-5/6 md:rounded-2xl"
          >
            <UIAlert :mode="alertMode" :message="alertMessage" />
            <div class="w-3/4">
              <!-- Avatar -->
              <div class="flex items-center justify-center p-20">
                <div class="grid grid-cols-1 grid-rows-1">
                  <div class="col-start-1 row-start-1">
                    <UIAvatar
                      :file="src"
                      :user_id="userProfile.id"
                      size="large"
                    ></UIAvatar>
                  </div>
                  <div
                    class="z-10 col-start-1 row-start-1 rounded-full transition-all hover:bg-slate-900 hover:bg-opacity-60"
                  >
                    <label for="avatar" class="mb-8">
                      <span
                        class="flex h-full w-full cursor-pointer items-center justify-center text-transparent transition-all hover:text-white"
                      >
                        <IconsEdit class="text-4xl"></IconsEdit>
                      </span>
                      <input
                        type="file"
                        id="avatar"
                        name="avatar"
                        accept=".jpg, .jpeg, .png"
                        @change="onFileSelected"
                        class="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
              <!-- first_name -->
              <UIInput
                id="first_name"
                type="text"
                v-model="userProfile.first_name"
                :flag="first_nameValidFlag"
                @updateValid="(value) => (first_nameValidFlag = value)"
                >First Name
              </UIInput>
              <!-- last_name -->
              <UIInput
                id="last_name"
                type="text"
                v-model="userProfile.last_name"
                :flag="last_nameValidFlag"
                @updateValid="(value) => (last_nameValidFlag = value)"
                >Last Name</UIInput
              >
              <!-- username -->
              <UIInput
                id="username"
                type="text"
                v-model="userProfile.username"
                :firstEdit="firstEdit"
                @edited="firstEdit = false"
                :flag="usernameValidFlag"
                @updateValid="(value) => (usernameValidFlag = value)"
                >Username</UIInput
              >
              <!-- Update Profile -->
              <UIButton
                color="orange"
                solid="true"
                @click="updateProfile(userProfile)"
                >Update Profile</UIButton
              >
            </div>
          </div>
        </div>
      </template>
    </MainCenter>
    <!-- <MainRight></MainRight> -->
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
