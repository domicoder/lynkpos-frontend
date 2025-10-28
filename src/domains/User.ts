export interface Role {
  id: string;
  role_name: string;
  description: string;
  created_at: string;
}

export interface Permission {
  id: string;
  permission_name: string;
  description: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  roles: Role[];
  permissions: Permission[];
  created_at: string;
  updated_at: string;
}

export type UserLogin = User & { token: string };
