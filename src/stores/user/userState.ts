import type { UserResponse } from '@/domains/User';

export type UserState = {
  usersList: UserResponse[];
  loading: boolean;
  isLoaded: boolean;
  error: string | null;
};

export const userState: UserState = {
  usersList: [],
  loading: false,
  isLoaded: false,
  error: null,
};
