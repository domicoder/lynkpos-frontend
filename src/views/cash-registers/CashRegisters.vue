<template>
  <div class="page">
    <h1 class="page__title">Cajeros</h1>

    <!-- ACCIONES RÁPIDAS -->
    <div class="quick-actions">
      <button
        class="qa-card qa-card--yellow"
        type="button"
        @click="openCashDialog('create')"
      >
        <div class="qa-icon">
          <span>+</span>
        </div>
        <span class="qa-text">Crear cajero</span>
      </button>

      <button
        class="qa-card qa-card--green"
        type="button"
        @click="openCashDialog('open')"
      >
        <div class="qa-icon">
          <span>▶</span>
        </div>
        <span class="qa-text">Abrir cajero</span>
      </button>

      <button
        class="qa-card qa-card--red"
        type="button"
        :disabled="!currentCash"
        @click="openCashDialog('close')"
      >
        <div class="qa-icon">
          <span>■</span>
        </div>
        <span class="qa-text">Cerrar cajero</span>
      </button>
    </div>

    <!-- LAYOUT PRINCIPAL: ESTADO DEL CAJERO -->
    <section class="layout">
      <!-- Columna izquierda: estado rápido -->
      <aside class="layout__sidebar">
        <div class="sidebar-card">
          <h2 class="sidebar-title">Cajero en curso</h2>

          <div
            v-if="currentCash"
            class="sidebar-item"
          >
            <div class="sidebar-item__header">
              <span class="sidebar-item__name">
                {{ currentCash.name || 'Cajero principal' }}
              </span>
              <span class="pill pill--open">ABIERTO</span>
            </div>
            <p class="sidebar-item__subtitle">ID: {{ currentCash.id }}</p>
          </div>

          <div
            v-else
            class="sidebar-empty"
          >
            <span class="pill pill--closed">CERRADO</span>
            <p>No hay cajero abierto actualmente.</p>
          </div>
        </div>
      </aside>

      <!-- Columna derecha: contenido principal -->
      <main class="layout__main">
        <!-- Estado general -->
        <div
          v-if="currentCash"
          class="status-card"
        >
          <h2>Cajero abierto</h2>
          <p>Estás gestionando el efectivo del negocio con este cajero.</p>

          <button
            class="btn btn--danger"
            type="button"
            @click="openCloseForCurrent"
          >
            Cerrar cajero
          </button>
        </div>

        <div
          v-else
          class="status-card"
        >
          <h2>Cajero cerrado</h2>
          <p>
            Abre un nuevo cajero y continúa gestionando el efectivo de tu
            negocio.
          </p>
          <button
            class="btn btn--primary"
            type="button"
            @click="openCashDialog('open')"
          >
            Abrir cajero
          </button>
        </div>
      </main>
    </section>

    <!-- MODAL PARA CREAR / ABRIR / CERRAR CAJERO -->
    <v-dialog
      v-model="isCashDialogOpen"
      max-width="520"
    >
      <v-card>
        <v-card-title class="text-h6">
          {{ cashDialogTitle }}
        </v-card-title>

        <v-card-text>
          <form
            @submit.prevent="
              cashDialogMode === 'create'
                ? onCreate()
                : cashDialogMode === 'open'
                  ? onOpen()
                  : onClose()
            "
          >
            <!-- CREAR CAJERO -->
            <template v-if="cashDialogMode === 'create'">
              <v-text-field
                v-model="createCodigo"
                label="Código"
                variant="outlined"
                hide-details="auto"
                class="mb-4"
                required
              />

              <v-text-field
                v-model="createNombre"
                label="Nombre"
                variant="outlined"
                hide-details="auto"
                class="mb-4"
                required
              />

              <div class="d-flex align-center mb-2">
                <v-switch
                  v-model="createActivo"
                  label="Activo"
                  inset
                />
              </div>

              <p
                v-if="createMessage"
                class="message mt-2"
              >
                {{ createMessage }}
              </p>
              <p
                v-if="createError"
                class="error mt-2"
              >
                {{ createError }}
              </p>
            </template>

            <!-- ABRIR CAJERO -->
            <template v-else-if="cashDialogMode === 'open'">
              <v-text-field
                v-model="cashId"
                label="Id del cajero (GUID)"
                variant="outlined"
                hide-details="auto"
                class="mb-4"
                required
              />

              <v-text-field
                v-model="userId"
                label="Id del usuario (GUID)"
                variant="outlined"
                hide-details="auto"
                class="mb-4"
                required
              />

              <p
                v-if="openMessage"
                class="message mt-2"
              >
                {{ openMessage }}
              </p>
              <p
                v-if="openError"
                class="error mt-2"
              >
                {{ openError }}
              </p>
            </template>

            <!-- CERRAR CAJERO -->
            <template v-else-if="cashDialogMode === 'close'">
              <v-text-field
                v-model="closeId"
                label="Id del cajero a cerrar (GUID)"
                :placeholder="currentCash ? currentCash.id : 'Id del cajero'"
                variant="outlined"
                hide-details="auto"
                class="mb-4"
                required
              />

              <p
                v-if="closeMessage"
                class="message mt-2"
              >
                {{ closeMessage }}
              </p>
              <p
                v-if="closeError"
                class="error mt-2"
              >
                {{ closeError }}
              </p>
            </template>

            <v-card-actions class="mt-4">
              <v-spacer />
              <v-btn
                variant="text"
                @click="closeCashDialog"
              >
                CANCEL
              </v-btn>
              <v-btn
                type="submit"
                variant="text"
                color="primary"
                :loading="
                  cashDialogMode === 'create'
                    ? isCreating
                    : cashDialogMode === 'open'
                      ? isOpening
                      : isClosing
                "
              >
                {{ ' ' }}
                {{
                  cashDialogMode === 'create'
                    ? 'CREAR CAJERO'
                    : cashDialogMode === 'open'
                      ? 'ABRIR CAJERO'
                      : 'CERRAR CAJERO'
                }}
              </v-btn>
            </v-card-actions>
          </form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import {
    createCashRegister,
    openCashRegister,
    deactiveCashRegister,
  } from '@/services/cash-register/api';
  import type { CreateCashRegisterInputShape } from '@/services/cash-register/models';

  type CurrentCash = {
    id: string;
    name?: string;
  };

  /** Modo actual del diálogo */
  type CashDialogMode = 'create' | 'open' | 'close' | null;

  // Estado del cajero actual (solo memoria)
  const currentCash = ref<CurrentCash | null>(null);

  // Estado del modal
  const cashDialogMode = ref<CashDialogMode>(null);

  const isCashDialogOpen = computed({
    get: () => cashDialogMode.value !== null,
    set: (value) => {
      if (!value) cashDialogMode.value = null;
    },
  });

  const cashDialogTitle = computed(() => {
    switch (cashDialogMode.value) {
      case 'create':
        return 'Crear cajero';
      case 'open':
        return 'Abrir cajero';
      case 'close':
        return 'Cerrar cajero';
      default:
        return '';
    }
  });

  const openCashDialog = (mode: CashDialogMode) => {
    cashDialogMode.value = mode;

    // limpiar mensajes cada vez que se abre
    createMessage.value = '';
    createError.value = '';
    openMessage.value = '';
    openError.value = '';
    closeMessage.value = '';
    closeError.value = '';

    // si es cerrar y hay cajero activo, prellenar el id
    if (mode === 'close' && currentCash.value) {
      closeId.value = currentCash.value.id;
    }
  };

  const closeCashDialog = () => {
    cashDialogMode.value = null;
  };

  /**
   * CREAR CAJERO
   */
  const createCodigo = ref('');
  const createNombre = ref('');
  const createActivo = ref(true);
  const createMessage = ref('');
  const createError = ref('');
  const isCreating = ref(false);

  const onCreate = async () => {
    createMessage.value = '';
    createError.value = '';

    try {
      isCreating.value = true;

      const payload: CreateCashRegisterInputShape = {
        codigo: createCodigo.value,
        nombre: createNombre.value,
        activo: createActivo.value,
      };

      const response = await createCashRegister(payload);

      createMessage.value = `Cajero creado correctamente. ID: ${response.data.id}`;

      createCodigo.value = '';
      createNombre.value = '';
      createActivo.value = true;
    } catch (_err: unknown) {
      createError.value = 'Error al crear el cajero.';
    } finally {
      isCreating.value = false;
    }
  };

  /**
   * ABRIR CAJERO
   */
  const cashId = ref('');
  const userId = ref('');
  const isOpening = ref(false);
  const openMessage = ref('');
  const openError = ref('');

  const onOpen = async () => {
    openMessage.value = '';
    openError.value = '';

    try {
      isOpening.value = true;

      const response = await openCashRegister({
        id: cashId.value,
        usuarioId: userId.value,
      });

      if (response.data.ok) {
        openMessage.value = 'Cajero abierto correctamente';
        currentCash.value = {
          id: cashId.value,
          name: 'Cajero principal',
        };
      } else {
        openError.value = 'El backend respondió pero no confirmó la apertura';
      }
    } catch (_err: unknown) {
      openError.value =
        'Error al abrir el cajero (verifica que no esté ya abierto)';
    } finally {
      isOpening.value = false;
    }
  };

  /**
   * CERRAR CAJERO
   */
  const closeId = ref('');
  const isClosing = ref(false);
  const closeMessage = ref('');
  const closeError = ref('');

  const onClose = async () => {
    closeMessage.value = '';
    closeError.value = '';

    try {
      isClosing.value = true;

      const idToClose = closeId.value || currentCash.value?.id;

      if (!idToClose) {
        return;
      }

      await deactiveCashRegister({ id: idToClose });

      closeMessage.value = 'Cajero cerrado correctamente';
      currentCash.value = null;
      closeId.value = '';
    } catch (_err: unknown) {
      closeError.value = 'Error al cerrar el cajero';
    } finally {
      isClosing.value = false;
    }
  };

  /** Abrir diálogo de cierre para el cajero actual */
  const openCloseForCurrent = () => {
    if (!currentCash.value) return;
    closeId.value = currentCash.value.id;
    openCashDialog('close');
  };
</script>

<style scoped>
  .page {
    padding: 1rem 1.5rem;
    min-height: 100vh;
    color: #f9fafb;
    font-family:
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      sans-serif;
  }

  .page__title {
    font-size: 1.1rem;
    font-weight: 500;
    margin-bottom: 1rem;
  }

  /* Acciones rápidas */
  .quick-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .qa-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.9rem 1.4rem;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.02);
    color: #f9fafb;
    min-width: 220px;
    justify-content: flex-start;
    text-align: left;
    transition:
      background-color 0.2s ease,
      transform 0.15s ease,
      box-shadow 0.15s ease,
      opacity 0.15s ease;
  }

  .qa-card:hover {
    background: rgba(255, 255, 255, 0.06);
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.35);
  }

  .qa-card:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
  }

  .qa-card:disabled {
    opacity: 0.5;
    cursor: default;
    transform: none;
    box-shadow: none;
  }

  .qa-icon {
    width: 32px;
    height: 32px;
    border-radius: 999px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .qa-text {
    font-size: 0.9rem;
    font-weight: 500;
  }

  .qa-card--yellow .qa-icon {
    background: #facc15;
    color: #111827;
  }

  .qa-card--green .qa-icon {
    background: #22c55e;
    color: #022c22;
  }

  .qa-card--red .qa-icon {
    background: #fb7185;
    color: #111827;
  }

  /* Layout principal */
  .layout {
    display: grid;
    grid-template-columns: 260px minmax(0, 1fr);
    gap: 1.5rem;
  }

  @media (max-width: 900px) {
    .layout {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  /* Sidebar */
  .layout__sidebar {
    min-width: 0;
  }

  .sidebar-card {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 16px;
    padding: 1rem;
    transition:
      background-color 0.2s ease,
      transform 0.15s ease,
      box-shadow 0.15s ease;
  }

  .sidebar-card:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-1px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.35);
  }

  .sidebar-title {
    font-size: 0.9rem;
    font-weight: 500;
    margin-bottom: 0.75rem;
  }

  .sidebar-item {
    padding: 0.6rem 0.4rem;
  }

  .sidebar-item__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .sidebar-item__name {
    font-size: 0.9rem;
    font-weight: 500;
  }

  .sidebar-item__subtitle {
    font-size: 0.78rem;
    color: #9ca3af;
    margin-top: 0.25rem;
  }

  .sidebar-empty {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    font-size: 0.85rem;
  }

  /* Main */
  .layout__main {
    min-width: 0;
  }

  .status-card {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 16px;
    padding: 1.25rem 1.5rem;
    margin-bottom: 1rem;
    transition:
      background-color 0.2s ease,
      transform 0.15s ease,
      box-shadow 0.15s ease;
  }

  .status-card:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-1px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.35);
  }

  .status-card h2 {
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 0.4rem;
  }

  .status-card p {
    font-size: 0.85rem;
    color: #9ca3af;
    margin-bottom: 0.8rem;
  }

  /* Botones */
  .btn {
    padding: 0.5rem 0.9rem;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    background: #111827;
    color: #f9fafb;
    font-size: 0.85rem;
    transition:
      background-color 0.15s ease,
      transform 0.1s ease,
      box-shadow 0.15s ease,
      opacity 0.15s ease;
  }

  .btn--primary {
    background: #22c55e;
    color: #022c22;
  }

  .btn--danger {
    background: #fb7185;
    color: #111827;
  }

  .btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.35);
    filter: brightness(1.05);
  }

  .btn:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: default;
    box-shadow: none;
  }

  /* Pills */
  .pill {
    padding: 0.14rem 0.7rem;
    border-radius: 999px;
    font-size: 0.7rem;
    font-weight: 600;
    transition:
      transform 0.15s ease,
      box-shadow 0.15s ease;
  }

  .pill--open {
    background: #22c55e;
    color: #022c22;
  }

  .pill--closed {
    background: #fb7185;
    color: #111827;
  }

  .sidebar-item:hover .pill,
  .sidebar-empty:hover .pill {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
  }

  /* Mensajes */
  .message {
    margin-top: 0.5rem;
    color: #4ade80;
    font-size: 0.8rem;
  }

  .error {
    margin-top: 0.5rem;
    color: #fb7185;
    font-size: 0.8rem;
  }
</style>
