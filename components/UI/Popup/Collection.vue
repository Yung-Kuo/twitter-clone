<script setup>
import {
  bindProfileCardKey,
  profileCardStyleKey,
  useAlertKey,
  useCollectionKey,
} from "~/composables/keys";

const {
  profileCardVis,
  hoveredUserId,
  showProfileCard,
  hideProfileCard,
  showPopupPost,
  newPost,
  repost_pid,
  showPopupReply,
  showPopupEdit,
  editPost,
} = inject(useCollectionKey);
const { alertMode, alertMessage } = inject(useAlertKey);
const bindProfileCard = inject(bindProfileCardKey);
const profileCardStyle = inject(profileCardStyleKey);
</script>
<template>
  <div>
    <!-- Alert -->
    <UIAlert :mode="alertMode" :message="alertMessage" />
    <!-- Profile Card -->
    <UIPopupTransition leave-active-class="delay-200">
      <UIPopupProfileCard
        v-show="profileCardVis && hoveredUserId"
        :ref="bindProfileCard"
        :style="profileCardStyle"
        :user-id="hoveredUserId"
        @mouseenter="showProfileCard(null, null)"
        @mouseleave="hideProfileCard()"
      />
    </UIPopupTransition>
    <!-- Backdrop -->
    <UIPopupTransition>
      <UIPopupBackdrop
        v-show="showPopupPost || showPopupReply || showPopupEdit"
        @mousedown="
          showPopupPost = false;
          showPopupReply = false;
          showPopupEdit = false;
          newPost = null;
          repost_pid = null;
          editPost = null;
        "
      />
    </UIPopupTransition>
    <!-- Post -->
    <UIPopupTransition>
      <UIPopupPost
        v-if="showPopupPost"
        @close="
          showPopupPost = false;
          repost_pid = null;
        "
      />
    </UIPopupTransition>
    <!-- Reply -->
    <UIPopupTransition>
      <UIPopupReply v-if="showPopupReply" @close="showPopupReply = false" />
    </UIPopupTransition>
    <!-- Edit -->
    <UIPopupTransition>
      <UIPopupEdit
        v-if="showPopupEdit"
        @close="
          showPopupEdit = false;
          editPost = null;
        "
      />
    </UIPopupTransition>
  </div>
</template>
