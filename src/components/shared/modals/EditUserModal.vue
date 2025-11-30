<script setup lang="ts">
  import { reactive, ref, watch, computed } from 'vue';
  import BaseModal from '@/components/shared/modals/BaseModal.vue';
  import type { VForm } from 'vuetify/components';
  import type { UserTable } from '@/domains/User';
  import type { UpdateUserInputShape } from '@/services/user/models';

  interface Props {
    user: UserTable | null;
  }

  const props = defineProps<Props>();

  const open = defineModel<boolean>({ default: false });

  const emit = defineEmits<{
    (e: 'submit', user: UpdateUserInputShape): void;
    (e: 'cancel'): void;
  }>();

  const formRef = ref<VForm | null>(null);
  const isValid = ref(false);
  const isSubmitting = ref(false);
  const showPassword = ref(false);
  const showConfirmPassword = ref(false);

  const form = reactive({
    id: '',
    usuarioNombre: '',
    nombre: '',
    password: '',
    confirmPassword: '',
    activo: true,
  });

  // --- Validation rules ---
  type RuleFn = (value: string) => true | string;

  const required =
    (field: string): RuleFn =>
    (v) =>
      !!v || `${field} es requerido`;

  const minLength =
    (min: number): RuleFn =>
    (v) =>
      !v || v.length >= min || `Mínimo ${min} caracteres`;

  const usernameRules: RuleFn[] = [required('Usuario'), minLength(3)];
  const nameRules: RuleFn[] = [required('Nombre'), minLength(2)];

  // Password es opcional al editar
  const passwordRules = computed<RuleFn[]>(() => {
    if (form.password) {
      return [minLength(8)];
    }

    return [];
  });

  const confirmPasswordRules = computed<RuleFn[]>(() => {
    if (form.password) {
      return [
        (v: string) => !!v || 'Confirmar contraseña es requerido',
        (v: string) => v === form.password || 'Las contraseñas no coinciden',
      ];
    }

    return [];
  });

  // --- Helpers ---
  const resetForm = () => {
    form.id = '';
    form.usuarioNombre = '';
    form.nombre = '';
    form.password = '';
    form.confirmPassword = '';
    form.activo = true;
    isValid.value = false;
    showPassword.value = false;
    showConfirmPassword.value = false;
    formRef.value?.resetValidation();
  };

  const loadUserData = () => {
    if (props.user) {
      form.id = props.user.id;
      form.usuarioNombre = props.user.usuarioNombre;
      form.nombre = props.user.nombre;
      form.activo = props.user.activo;
      form.password = '';
      form.confirmPassword = '';
    }
  };

  // Cargar datos cuando se abre el modal con un usuario
  watch(
    () => props.user,
    () => {
      if (props.user) {
        loadUserData();
      }
    },
    { immediate: true },
  );

  // Reset form cuando se cierra el modal
  watch(open, (value) => {
    if (!value) {
      resetForm();
    } else if (props.user) {
      loadUserData();
    }
  });

  // --- Actions ---

  const onSubmit = async () => {
    if (isSubmitting.value) return;

    const formInstance = formRef.value;

    if (!formInstance) return;

    const { valid } = await formInstance.validate();

    if (!valid) return;

    isSubmitting.value = true;

    try {
      const payload: UpdateUserInputShape = {
        id: form.id,
        usuarioNombre: form.usuarioNombre.trim(),
        nombre: form.nombre.trim(),
        activo: form.activo,
      };

      // Solo incluir password si se proporcionó
      if (form.password && form.password.trim()) {
        payload.password = form.password;
      }

      emit('submit', payload);
      open.value = false;
    } finally {
      isSubmitting.value = false;
    }
  };

  const handleCancel = () => {
    emit('cancel');
    open.value = false;
  };
</script>

<template>
  <BaseModal
    v-model="open"
    :title="$t('users.editUserModal.title')"
    :max-width="520"
    :persistent="true"
  >
    <template #default>
      <v-form
        ref="formRef"
        v-model="isValid"
        @submit.prevent="onSubmit"
      >
        <div class="d-flex flex-column ga-4">
          <v-text-field
            v-model="form.usuarioNombre"
            :label="$t('users.editUserModal.username')"
            autocomplete="off"
            :rules="usernameRules"
            variant="outlined"
            density="comfortable"
            required
          />

          <v-text-field
            v-model="form.nombre"
            :label="$t('users.editUserModal.name')"
            autocomplete="off"
            :rules="nameRules"
            variant="outlined"
            density="comfortable"
            required
            @input="
              form.nombre = form.nombre.replace(/\b\w/g, (char) =>
                char.toUpperCase(),
              )
            "
          />

          <v-text-field
            v-model="form.password"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :label="$t('users.editUserModal.newPassword')"
            :type="showPassword ? 'text' : 'password'"
            autocomplete="new-password"
            :rules="passwordRules"
            variant="outlined"
            density="comfortable"
            :hint="$t('users.editUserModal.passwordHint')"
            persistent-hint
            @click:append-inner="showPassword = !showPassword"
          />

          <v-text-field
            v-if="form.password"
            v-model="form.confirmPassword"
            :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :label="$t('users.editUserModal.confirmPassword')"
            :type="showConfirmPassword ? 'text' : 'password'"
            autocomplete="new-password"
            :rules="confirmPasswordRules"
            variant="outlined"
            density="comfortable"
            @click:append-inner="showConfirmPassword = !showConfirmPassword"
          />

          <v-switch
            v-model="form.activo"
            :label="form.activo ? $t('users.active') : $t('users.inactive')"
            color="success"
            hide-details
          />
        </div>
      </v-form>
    </template>

    <template #actions>
      <v-btn
        variant="text"
        :disabled="isSubmitting"
        @click="handleCancel"
      >
        {{ $t('users.editUserModal.cancel') }}
      </v-btn>

      <v-btn
        color="primary"
        type="submit"
        :loading="isSubmitting"
        :disabled="!isValid || isSubmitting"
        @click="onSubmit"
      >
        {{ $t('users.editUserModal.update') }}
      </v-btn>
    </template>
  </BaseModal>
</template>
