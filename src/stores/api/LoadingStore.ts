import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface LoadingState {
  global: boolean;
  requests: Map<string, boolean>;
  uploads: Map<string, number>; // percentage
}

export const useLoadingStore = defineStore('LoadingStore', () => {
  const global = ref(false);
  const requests = ref(new Map<string, boolean>());
  const uploads = ref(new Map<string, number>());

  const isGlobalLoading = computed(() => global.value);
  const hasAnyLoading = computed(() => global.value || requests.value.size > 0);
  const getRequestLoading = computed(
    () => (key: string) => requests.value.get(key) || false,
  );
  const getUploadProgress = computed(
    () => (key: string) => uploads.value.get(key) || 0,
  );

  const loadingRequests = computed(() => Array.from(requests.value.keys()));
  const uploadingFiles = computed(() => Array.from(uploads.value.entries()));

  const setGlobalLoading = (loading: boolean) => {
    global.value = loading;
  };

  const setRequestLoading = (key: string, loading: boolean) => {
    if (loading) {
      requests.value.set(key, true);
    } else {
      requests.value.delete(key);
    }
  };

  const setUploadProgress = (key: string, progress: number) => {
    if (progress >= 100) {
      uploads.value.delete(key);
    } else {
      uploads.value.set(key, progress);
    }
  };

  const clearAllLoading = () => {
    global.value = false;
    requests.value.clear();
    uploads.value.clear();
  };

  const generateRequestKey = (method: string, url: string) => {
    return `${method}:${url}`;
  };

  return {
    global,
    requests,
    uploads,

    isGlobalLoading,
    hasAnyLoading,
    getRequestLoading,
    getUploadProgress,
    loadingRequests,
    uploadingFiles,

    setGlobalLoading,
    setRequestLoading,
    setUploadProgress,
    clearAllLoading,
    generateRequestKey,
  };
});

export default useLoadingStore;
