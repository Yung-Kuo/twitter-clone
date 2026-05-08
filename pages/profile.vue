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
const { alertMode, alertMessage, hasError } = inject("useAlert");
const handleClickOutside = inject("handleClickOutside");
const {
  profileCardVis,
  hoveredUserId,
  showProfileCard,
  hideProfileCard,
  bindProfileCard,
  profileCardStyle,
} = inject("useProfileCard");

const userProfile = reactive({});
const firstEdit = ref(false);

watchEffect(() => {
  if (!user.value) {
    navigateTo("/login");
  }
});

watchEffect(async () => {
  if (store.noProfile) {
    await store.fetchProfile();
    if (getError.value) {
      alertMode.value = "error";
      alertMessage.value = getError.value;
      hasError();
    }
  }
});

onMounted(() => {
  if (store.getProfile) {
    Object.assign(userProfile, store.getProfile);
  }
  if (!userProfile.username) firstEdit.value = true;
});

watch(userProfile, (curVal) => {
  if (curVal.first_name || curVal.last_name) {
    if (firstEdit.value) {
      curVal.username = curVal.first_name + "_" + curVal.last_name;
    }
  } else if (!curVal.username && !curVal.first_name && !curVal.last_name) {
    firstEdit.value = true;
  } else if (firstEdit.value) {
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
  await store.uploadAvatar(file.value, filePath.value);
  if (getError.value) {
    alertMode.value = "error";
    alertMessage.value = getError.value;
    hasError();
  } else {
    old_avatar_url.value = userProfile.avatar_url;
    userProfile.avatar_url = filePath.value;
    files.value = null;
    file.value = null;
    fileExt.value = null;
    filePath.value = null;
  }
}

async function updateProfile() {
  if (file.value && filePath.value) {
    await onUpload();
  }
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
const first_nameValidFlag = ref(true);
const last_nameValidFlag = ref(true);
const usernameValidFlag = ref(true);
const buttonActiveFlag = computed(() => {
  return (
    first_nameValidFlag.value &&
    last_nameValidFlag.value &&
    usernameValidFlag.value
  );
});
</script>

<template>
  <div
    class="flex h-screen w-screen bg-black"
    @mousedown="handleClickOutside($event)"
  >
    <!-- UI Popup -->
    <div>
      <!-- Alert -->
      <UIAlert :mode="alertMode" :message="alertMessage" />
      <!-- Profile Card -->
      <UIPopupTransition leave-active-class="delay-200">
        <UIPopupProfileCard
          v-show="profileCardVis"
          :ref="bindProfileCard"
          :style="profileCardStyle"
          :user-id="hoveredUserId"
          @mouseenter="showProfileCard(null, null)"
          @mouseleave="hideProfileCard()"
        />
      </UIPopupTransition>
    </div>
    <!-- navigation -->
    <MainLeft/>
    <MainCenter>
      <template #title>Edit Profile</template>
      <template #main>
        <div class="flex w-full items-center justify-center">
          <div class="flex w-3/4 flex-col gap-10 pb-40">
            <!-- Avatar -->
            <div class="flex items-center justify-center p-20">
              <div class="grid grid-cols-1 grid-rows-1">
                <div class="col-start-1 row-start-1">
                  <UIAvatar
                    :file="src"
                    :user_id="userProfile?.id"
                    size="large"
                  />
                </div>
                <div
                  class="z-10 col-start-1 row-start-1 rounded-full transition-all hover:bg-slate-900 hover:bg-opacity-60"
                >
                  <label for="avatar" class="mb-8">
                    <span
                      class="flex h-full w-full cursor-pointer items-center justify-center text-transparent transition-all hover:text-white"
                    >
                      <IconsEdit class="text-4xl"/>
                    </span>
                    <input
                      id="avatar"
                      type="file"
                      name="avatar"
                      accept=".jpg, .jpeg, .png"
                      class="hidden"
                      @change="onFileSelected"
                    >
                  </label>
                </div>
              </div>
            </div>
            <!-- first_name -->
            <UIInput
              id="first_name"
              v-model:text="userProfile.first_name"
              type="text"
              :flag="first_nameValidFlag"
              @update-valid="(value) => (first_nameValidFlag = value)"
              >First Name
            </UIInput>
            <!-- last_name -->
            <UIInput
              id="last_name"
              v-model:text="userProfile.last_name"
              type="text"
              :flag="last_nameValidFlag"
              @update-valid="(value) => (last_nameValidFlag = value)"
              >Last Name</UIInput
            >
            <!-- username -->
            <UIInput
              id="username"
              v-model:text="userProfile.username"
              type="text"
              :first-edit="firstEdit"
              :flag="usernameValidFlag"
              @edited="firstEdit = false"
              @update-valid="(value) => (usernameValidFlag = value)"
              >Username</UIInput
            >
            <!-- description -->

            <div
              class="no-wheel-sync flex max-h-[20em] min-h-[8em] grow flex-col overflow-y-scroll rounded-md border-2 border-zinc-600 transition-all focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500"
            >
              <UITextarea v-model="userProfile.description" for-profile />
            </div>
            <!-- Update Profile -->
            <UIButton
              color="orange"
              :solid="true"
              :active="buttonActiveFlag"
              @click="updateProfile(userProfile)"
              >Update Profile</UIButton
            >
          </div>
        </div>
      </template>
    </MainCenter>
    <!-- <MainRight /> -->
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
