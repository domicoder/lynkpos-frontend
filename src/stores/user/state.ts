import type { User, LoginToken } from '@/domains/User';

export type AuthState = {
  user: User | null;
  loginToken: LoginToken | null;
};

const state: AuthState = {
  user: null as unknown as User,
  loginToken: null,
};

export default state;
