// import { useI18n } from 'vue-i18n';
import type { RoleSelector } from '@/domains/Role';
import { Role } from '@/domains/Role';

export const getRoles = (): RoleSelector[] => {
  // const { t } = useI18n();

  return [
    {
      // label: t('settings.roles.admin'),
      label: 'Admin',
      value: Role.Admin,
    },
    {
      // label: t('settings.roles.user'),
      label: 'User',
      value: Role.User,
    },
    {
      // label: t('settings.roles.guest'),
      label: 'Guest',
      value: Role.Guest,
    },
  ];
};
