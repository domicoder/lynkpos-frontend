<!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
<template>
  <div class="global-loading-container">
    <!-- Loading global -->
    <Transition name="loading-fade">
      <div
        v-if="loadingStore.isGlobalLoading"
        class="global-loading-overlay"
      >
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p class="loading-text">Cargando...</p>
        </div>
      </div>
    </Transition>

    <!-- Indicador de requests individuales -->
    <Transition name="slide-up">
      <div
        v-if="showRequestIndicator"
        class="request-indicator"
      >
        <div class="indicator-content">
          <div class="mini-spinner"></div>
          <span class="request-count">{{ activeRequestsCount }} solicitudes activas</span>
        </div>
      </div>
    </Transition>

    <!-- Indicador de uploads -->
    <div
      v-if="uploadingFiles.length > 0"
      class="upload-indicator"
    >
      <div
        v-for="[key, progress] in uploadingFiles"
        :key="key"
        class="upload-item"
      >
        <div class="upload-info">
          <span class="upload-name">{{ getUploadName(key) }}</span>
          <span class="upload-percentage">{{ Math.round(progress) }}%</span>
        </div>
        <div class="upload-progress-bar">
          <div
            class="upload-progress-fill"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import useLoadingStore from '@/stores/api/LoadingStore';

  const loadingStore = useLoadingStore();

  const activeRequestsCount = computed(
    () => loadingStore.loadingRequests.length,
  );
  const uploadingFiles = computed(() => loadingStore.uploadingFiles);

  const showRequestIndicator = computed(
    () => !loadingStore.isGlobalLoading && activeRequestsCount.value > 0,
  );

  const getUploadName = (key: string): string => {
    const parts = key.split(':');

    return parts[parts.length - 1] || 'Archivo';
  };
</script>

<style scoped>
  .global-loading-container {
    position: relative;
    z-index: 9999;
  }

  /* Loading global overlay */
  .global-loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  }

  .loading-spinner {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    text-align: center;
    min-width: 200px;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  .loading-text {
    margin: 0;
    color: #333;
    font-size: 16px;
    font-weight: 500;
  }

  /* Indicador de requests */
  .request-indicator {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #3498db;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 9998;
  }

  .indicator-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .mini-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top: 2px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .request-count {
    font-size: 14px;
    font-weight: 500;
  }

  /* Indicador de uploads */
  .upload-indicator {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    padding: 1rem;
    min-width: 300px;
    z-index: 9998;
  }

  .upload-item {
    margin-bottom: 1rem;
  }

  .upload-item:last-child {
    margin-bottom: 0;
  }

  .upload-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .upload-name {
    font-size: 14px;
    color: #333;
    font-weight: 500;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .upload-percentage {
    font-size: 12px;
    color: #666;
    font-weight: 600;
  }

  .upload-progress-bar {
    height: 4px;
    background-color: #f0f0f0;
    border-radius: 2px;
    overflow: hidden;
  }

  .upload-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #3498db, #2ecc71);
    border-radius: 2px;
    transition: width 0.3s ease;
  }

  /* Animations */
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .loading-fade-enter-active,
  .loading-fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .loading-fade-enter-from,
  .loading-fade-leave-to {
    opacity: 0;
  }

  .slide-up-enter-active,
  .slide-up-leave-active {
    transition: all 0.3s ease;
  }

  .slide-up-enter-from {
    transform: translateY(-20px);
    opacity: 0;
  }

  .slide-up-leave-to {
    transform: translateY(-20px);
    opacity: 0;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .request-indicator {
      top: 10px;
      right: 10px;
      padding: 0.375rem 0.75rem;
    }

    .upload-indicator {
      bottom: 10px;
      right: 10px;
      left: 10px;
      min-width: auto;
    }

    .upload-name {
      max-width: 150px;
    }
  }
</style>
