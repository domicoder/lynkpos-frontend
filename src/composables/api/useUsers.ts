/* eslint-disable @typescript-eslint/no-explicit-any */
import { computed } from 'vue';
import {
  useApi,
  useApiMutation,
  useApiPagination,
  useFileUpload,
} from '../useApi';
import { z } from 'zod';

const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
  avatar: z.string().url().optional(),
  roles: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const CreateUserSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres'),
  password: z.string().min(8, 'Password debe tener al menos 8 caracteres'),
  roles: z.array(z.string()).optional(),
});

const UpdateUserSchema = CreateUserSchema.partial().omit({ password: true });

export type User = z.infer<typeof UserSchema>;

export type CreateUserData = z.infer<typeof CreateUserSchema>;

export type UpdateUserData = z.infer<typeof UpdateUserSchema>;

export interface UserFilters {
  search?: string;
  role?: string;
  isActive?: boolean;
  sortBy?: 'name' | 'email' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export function useUsers(filters?: UserFilters) {
  const buildUrl = (baseUrl: string, filters?: UserFilters) => {
    if (!filters) return baseUrl;

    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
  };

  const url = computed(() => buildUrl('/users', filters));

  const {
    items: users,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    hasNext,
    hasPrev,
    nextPage,
    prevPage,
    goToPage,
    refresh,
  } = useApiPagination<User>(url, {
    cache: true,
    transform: (response: any) => {
      return (
        response.items?.map((user: unknown) => UserSchema.parse(user)) || []
      );
    },
  });

  const {
    loading: createLoading,
    error: createError,
    mutate: createUser,
  } = useApiMutation<CreateUserData, User>({
    validateData: true,
    onSuccess: () => {
      refresh();
    },
  });

  const {
    loading: updateLoading,
    error: updateError,
    mutate: updateUser,
  } = useApiMutation<UpdateUserData, User>({
    validateData: true,
    onSuccess: () => {
      refresh();
    },
  });

  const {
    loading: deleteLoading,
    error: deleteError,
    mutate: deleteUser,
  } = useApiMutation({
    onSuccess: () => {
      refresh();
    },
  });

  const create = async (userData: CreateUserData) => {
    try {
      CreateUserSchema.parse(userData);

      return await createUser('/users', userData, 'POST');
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Datos inválidos: ${error.errors.map((e) => e.message).join(', ')}`,
        );
      }
      throw error;
    }
  };

  const update = async (id: number, userData: UpdateUserData) => {
    try {
      UpdateUserSchema.parse(userData);

      return await updateUser(`/users/${id}`, userData, 'PUT');
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Datos inválidos: ${error.errors.map((e) => e.message).join(', ')}`,
        );
      }
      throw error;
    }
  };

  const remove = async (id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      return await deleteUser(`/users/${id}`, undefined, 'DELETE');
    }
  };

  const search = (searchTerm: string) => {
    if (filters) {
      filters.search = searchTerm;
    }
  };

  const isLoading = computed(
    () =>
      loading.value ||
      createLoading.value ||
      updateLoading.value ||
      deleteLoading.value,
  );

  return {
    users,
    loading: isLoading,
    error: computed(
      () =>
        error.value ||
        createError.value ||
        updateError.value ||
        deleteError.value,
    ),

    currentPage,
    totalPages,
    totalItems,
    hasNext,
    hasPrev,
    nextPage,
    prevPage,
    goToPage,

    create,
    update,
    remove,
    search,
    refresh,
  };
}

export function useUser(id: number) {
  const {
    data: user,
    loading,
    error,
    execute: fetchUser,
  } = useApi<User>(`/users/${id}`, {
    cache: true,
    immediate: true,
    transform: (data: unknown) => UserSchema.parse(data),
  });

  const {
    loading: updateLoading,
    error: updateError,
    mutate: performUpdate,
  } = useApiMutation<UpdateUserData, User>({
    validateData: true,
    onSuccess: () => {
      fetchUser();
    },
  });

  const update = async (userData: UpdateUserData) => {
    try {
      UpdateUserSchema.parse(userData);

      return await performUpdate(`/users/${id}`, userData, 'PUT');
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(
          `Datos inválidos: ${error.errors.map((e) => e.message).join(', ')}`,
        );
      }
      throw error;
    }
  };

  const isLoading = computed(() => loading.value || updateLoading.value);
  const hasError = computed(() => error.value || updateError.value);

  return {
    user,
    loading: isLoading,
    error: hasError,
    update,
    refresh: fetchUser,
  };
}

export function useUserAvatar(userId: number) {
  const { loading, error, progress, upload } = useFileUpload<User>(
    `/users/${userId}/avatar`,
    {
      onSuccess: () => {
        // api.invalidateCache(`/users/${userId}`);
      },
    },
  );

  const uploadAvatar = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File cannot be larger than 5MB');
    }

    return await upload(file);
  };

  return {
    loading,
    error,
    progress,
    uploadAvatar,
  };
}
