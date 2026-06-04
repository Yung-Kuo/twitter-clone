<script setup>
import { useProfileStore } from "~/stores/profile";
import { profileCardKey } from "~/composables/keys";

const profileStore = useProfileStore();
const props = defineProps({
  user_id: {
    type: String,
    default: null,
  },
});
const userProfile = computed(() => profileStore.profileById(props.user_id));

const { showProfileCard, hideProfileCard } = inject(profileCardKey);
</script>
<template>
  <div class="flex flex-col gap-1">
    <div class="flex items-center gap-2">
      <!-- avatar -->
      <NuxtLink :to="`/${profileStore.usernameById(props.user_id)}`">
        <span
          class="inline-flex"
          @mouseenter="
            showProfileCard($event.currentTarget, props.user_id)
          "
          @mouseleave="hideProfileCard()"
        >
          <UIAvatar size="small" :user_id="props.user_id" />
        </span>
      </NuxtLink>
      <div class="flex w-min flex-col leading-tight">
        <!-- name -->
        <NuxtLink :to="`/${profileStore.usernameById(props.user_id)}`">
          <span
            class="text-zinc-200 hover:underline"
            @mouseenter="
              showProfileCard($event.currentTarget, props.user_id)
            "
            @mouseleave="hideProfileCard()"
            >{{ profileStore.nameById(props.user_id) }}</span
          >
        </NuxtLink>
        <!-- username -->
        <NuxtLink :to="`/${profileStore.usernameById(props.user_id)}`">
          <span
            class="text-sm text-zinc-500"
            @mouseenter="
              showProfileCard($event.currentTarget, props.user_id)
            "
            @mouseleave="hideProfileCard()"
            >@{{ profileStore.usernameById(props.user_id) }}</span
          >
        </NuxtLink>
      </div>
      <div class="grow" />
      <UIButtonFollow v-if="props.user_id" :uid="props.user_id" />
    </div>
    <div class="flex gap-2 leading-tight">
      <div class="w-10"/>
      <!-- description -->
      <div class="w-[calc(100%-3rem)]">
        <NuxtLink :to="`/${profileStore.usernameById(props.user_id)}`">
          <pre class="whitespace-normal break-words">{{
            userProfile?.description
          }}</pre>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
