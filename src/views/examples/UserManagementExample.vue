<!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
<template>
  <div class="user-management">
    <div class="header">
      <h1>Gestión de Usuarios</h1>
      <button
        class="btn btn-primary"
        :disabled="loading"
        @click="showCreateModal = true"
      >
        + Crear Usuario
      </button>
    </div>

    <!-- Filtros de búsqueda -->
    <div class="filters">
      <div class="search-box">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Buscar usuarios..."
          class="search-input"
          @input="handleSearch"
        />
      </div>

      <select
        v-model="selectedRole"
        class="filter-select"
        @change="handleFilterChange"
      >
        <option value="">Todos los roles</option>
        <option value="admin">Administrador</option>
        <option value="user">Usuario</option>
        <option value="moderator">Moderador</option>
      </select>

      <select
        v-model="sortBy"
        class="filter-select"
        @change="handleFilterChange"
      >
        <option value="name">Ordenar por nombre</option>
        <option value="email">Ordenar por email</option>
        <option value="createdAt">Ordenar por fecha</option>
      </select>
    </div>

    <!-- Lista de usuarios -->
    <div class="users-container">
      <div
        v-if="loading"
        class="loading-state"
      >
        <div class="spinner"></div>
        <p>Cargando usuarios...</p>
      </div>

      <div
        v-else-if="error"
        class="error-state"
      >
        <p class="error-message">{{ error.message }}</p>
        <button
          class="btn btn-secondary"
          @click="refresh"
        >
          Reintentar
        </button>
      </div>

      <div
        v-else-if="users.length === 0"
        class="empty-state"
      >
        <p>No se encontraron usuarios</p>
      </div>

      <div
        v-else
        class="users-grid"
      >
        <div
          v-for="user in users"
          :key="user.id"
          class="user-card"
        >
          <div class="user-avatar">
            <img
              :src="user.avatar || '/default-avatar.png'"
              :alt="user.name"
              @error="handleImageError"
            />
            <button
              class="avatar-upload-btn"
              title="Cambiar avatar"
              @click="openAvatarUpload(user.id)"
            >
              📷
            </button>
          </div>

          <div class="user-info">
            <h3>{{ user.name }}</h3>
            <p class="user-email">{{ user.email }}</p>
            <div class="user-roles">
              <span
                v-for="role in user.roles"
                :key="role"
                class="role-badge"
                :class="getRoleClass(role)"
              >
                {{ role }}
              </span>
            </div>
            <p class="user-date">Creado: {{ formatDate(user.createdAt) }}</p>
          </div>

          <div class="user-actions">
            <button
              class="btn btn-sm btn-secondary"
              @click="editUser(user)"
            >
              Editar
            </button>
            <button
              class="btn btn-sm btn-danger"
              :disabled="user.id === currentUser?.id"
              @click="removeUser(user.id)"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>

      <!-- Paginación -->
      <div
        v-if="totalPages > 1"
        class="pagination"
      >
        <button
          :disabled="!hasPrev"
          class="btn btn-secondary"
          @click="prevPage"
        >
          ← Anterior
        </button>

        <span class="page-info">
          Página {{ currentPage }} de {{ totalPages }} ({{ totalItems }}
          usuarios)
        </span>

        <button
          :disabled="!hasNext"
          class="btn btn-secondary"
          @click="nextPage"
        >
          Siguiente →
        </button>
      </div>
    </div>

    <!-- Modal de creación/edición -->
    <UserFormModal
      v-if="showCreateModal || showEditModal"
      :user="editingUser"
      :loading="formLoading"
      @save="handleSaveUser"
      @cancel="closeModals"
    />

    <!-- Modal de upload de avatar -->
    <AvatarUploadModal
      v-if="showAvatarModal"
      :user-id="avatarUserId"
      @uploaded="handleAvatarUploaded"
      @cancel="closeAvatarModal"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed } from 'vue';
  import { useUsers } from '@/composables/api/useUsers';
  import { useAuth } from '@/composables/api/useAuth';
  import UserFormModal from '@/components/modals/UserFormModal.vue';
  import AvatarUploadModal from '@/components/modals/AvatarUploadModal.vue';
  import type {
    User,
    CreateUserData,
    UpdateUserData,
  } from '@/composables/api/useUsers';

  const searchTerm = ref('');
  const selectedRole = ref('');
  const sortBy = ref<'name' | 'email' | 'createdAt'>('name');
  const showCreateModal = ref(false);
  const showEditModal = ref(false);
  const showAvatarModal = ref(false);
  const editingUser = ref<User | null>(null);
  const avatarUserId = ref<number | null>(null);

  const filters = reactive({
    search: '',
    role: '',
    sortBy: 'name' as 'name' | 'email' | 'createdAt',
    sortOrder: 'asc' as 'asc' | 'desc',
  });

  const { user: currentUser } = useAuth();
  const {
    users,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    hasNext,
    hasPrev,
    nextPage,
    prevPage,
    create,
    update,
    remove,
    refresh,
  } = useUsers(filters);

  const formLoading = computed(() => loading.value);

  const handleSearch = () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      filters.search = searchTerm.value;
    }, 300);
  };

  let searchTimeout: ReturnType<typeof setTimeout>;

  const handleFilterChange = () => {
    filters.role = selectedRole.value;
    filters.sortBy = sortBy.value;
  };

  const editUser = (user: User) => {
    editingUser.value = user;
    showEditModal.value = true;
  };

  const removeUser = async (id: number) => {
    try {
      await remove(id);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error al eliminar usuario:', error);
    }
  };

  const handleSaveUser = async (userData: CreateUserData | UpdateUserData) => {
    try {
      if (editingUser.value) {
        await update(editingUser.value.id, userData as UpdateUserData);
      } else {
        await create(userData as CreateUserData);
      }
      closeModals();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error al guardar usuario:', error);
    }
  };

  const openAvatarUpload = (userId: number) => {
    avatarUserId.value = userId;
    showAvatarModal.value = true;
  };

  const handleAvatarUploaded = () => {
    closeAvatarModal();
    refresh();
  };

  const closeModals = () => {
    showCreateModal.value = false;
    showEditModal.value = false;
    editingUser.value = null;
  };

  const closeAvatarModal = () => {
    showAvatarModal.value = false;
    avatarUserId.value = null;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getRoleClass = (role: string) => {
    const roleClasses = {
      admin: 'role-admin',
      user: 'role-user',
      moderator: 'role-moderator',
    };

    return roleClasses[role as keyof typeof roleClasses] || 'role-default';
  };

  const handleImageError = (event: Event) => {
    const img = event.target as HTMLImageElement;

    img.src = '/default-avatar.png';
  };
</script>

<style scoped>
  .user-management {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .header h1 {
    margin: 0;
    color: #333;
  }

  .filters {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }

  .search-box {
    flex: 1;
    min-width: 200px;
  }

  .search-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
  }

  .filter-select {
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    background: white;
  }

  .users-container {
    min-height: 400px;
  }

  .loading-state,
  .error-state,
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    text-align: center;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  .error-message {
    color: #e74c3c;
    margin-bottom: 1rem;
  }

  .users-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .user-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transition:
      transform 0.2s,
      box-shadow 0.2s;
  }

  .user-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }

  .user-avatar {
    position: relative;
    width: 80px;
    height: 80px;
    margin: 0 auto 1rem;
  }

  .user-avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #f0f0f0;
  }

  .avatar-upload-btn {
    position: absolute;
    bottom: -5px;
    right: -5px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #3498db;
    color: white;
    border: 2px solid white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    transition: background-color 0.2s;
  }

  .avatar-upload-btn:hover {
    background: #2980b9;
  }

  .user-info {
    text-align: center;
    margin-bottom: 1rem;
  }

  .user-info h3 {
    margin: 0 0 0.5rem;
    color: #333;
    font-size: 18px;
  }

  .user-email {
    color: #666;
    margin: 0 0 0.75rem;
    font-size: 14px;
  }

  .user-roles {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    flex-wrap: wrap;
  }

  .role-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    text-transform: capitalize;
  }

  .role-admin {
    background: #e74c3c;
    color: white;
  }

  .role-user {
    background: #3498db;
    color: white;
  }

  .role-moderator {
    background: #f39c12;
    color: white;
  }

  .role-default {
    background: #95a5a6;
    color: white;
  }

  .user-date {
    color: #999;
    font-size: 12px;
    margin: 0;
  }

  .user-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;
    padding: 1rem;
  }

  .page-info {
    color: #666;
    font-size: 14px;
  }

  /* Botones */
  .btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    display: inline-block;
    text-align: center;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-primary {
    background: #3498db;
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background: #2980b9;
  }

  .btn-secondary {
    background: #95a5a6;
    color: white;
  }

  .btn-secondary:hover:not(:disabled) {
    background: #7f8c8d;
  }

  .btn-danger {
    background: #e74c3c;
    color: white;
  }

  .btn-danger:hover:not(:disabled) {
    background: #c0392b;
  }

  .btn-sm {
    padding: 0.5rem 1rem;
    font-size: 12px;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /* Responsive */
  @media (max-width: 768px) {
    .user-management {
      padding: 1rem;
    }

    .header {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }

    .filters {
      flex-direction: column;
    }

    .users-grid {
      grid-template-columns: 1fr;
    }

    .pagination {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
</style>
