import type { UserLogin } from '@/domains/User';

export type AuthState = {
  user: UserLogin | null;
};

const state: AuthState = {
  user: null as unknown as UserLogin,
};

export default state;
