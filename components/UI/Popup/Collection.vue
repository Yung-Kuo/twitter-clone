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
</script>
<template>
  <div>
    <!-- Alert -->
    <UIAlert :mode="alertMode" :message="alertMessage" />
    <!-- Profile Card -->
    <UIPopupTransition leave-active-class="delay-200">
      <UIPopupProfileCard
        v-show="profileCardVis"
        id="profileCard"
        :userId="hoveredUserId"
        @mouseenter="showProfileCard(null, null)"
        @mouseleave="hideProfileCard()"
      >
      </UIPopupProfileCard>
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
