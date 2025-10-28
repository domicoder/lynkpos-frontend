export enum Role {
  Admin = 'Admin',
  User = 'User',
  Guest = 'Guest',
}

export interface RoleSelector {
  label: string;
  value: Role;
}
