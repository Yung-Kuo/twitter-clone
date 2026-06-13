import { beforeEach, vi } from "vitest";
import { createPinia, defineStore, setActivePinia } from "pinia";
import {
  computed,
  inject,
  nextTick,
  onMounted,
  provide,
  reactive,
  ref,
  shallowRef,
  toRefs,
  watch,
  watchEffect,
} from "vue";

Object.assign(globalThis, {
  computed,
  inject,
  nextTick,
  onMounted,
  provide,
  reactive,
  ref,
  shallowRef,
  toRefs,
  watch,
  watchEffect,
  defineStore,
});

vi.stubGlobal("useSupabaseUser", () => ref(null));
vi.stubGlobal("useLikeBookmark", () => ({
  clickLike: vi.fn(),
  clickBookmark: vi.fn(),
}));

beforeEach(() => {
  setActivePinia(createPinia());
});
