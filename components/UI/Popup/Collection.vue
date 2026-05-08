<script setup>
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
} = inject("useCollection");
const { alertMode, alertMessage } = inject("useAlert");
const bindProfileCard = inject("bindProfileCard");
const profileCardStyle = inject("profileCardStyle");
</script>
<template>
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
