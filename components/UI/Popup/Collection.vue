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

function closePopups() {
  showPopupPost.value = false;
  showPopupReply.value = false;
  showPopupEdit.value = false;
  newPost.value = null;
  repost_pid.value = null;
  editPost.value = null;
}
</script>
<template>
  <div>
    <UIAlert :mode="alertMode" :message="alertMessage" />
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
    <UIModal
      :open="showPopupPost || showPopupReply || showPopupEdit"
      @close="closePopups"
    >
      <UIPopupPost
        v-if="showPopupPost"
        @close="
          showPopupPost = false;
          repost_pid = null;
        "
      />
      <UIPopupReply v-if="showPopupReply" @close="showPopupReply = false" />
      <UIPopupEdit
        v-if="showPopupEdit"
        @close="
          showPopupEdit = false;
          editPost = null;
        "
      />
    </UIModal>
  </div>
</template>
