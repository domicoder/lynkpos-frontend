export type LoginAuthInputShape = {
  usuarioNombre: string;
  password: string;
};

export type LoginAuthOutputShape = {
  status: number;
  data: {
    token: string;
  };
};

export type GetUserInfoOutputShape = {
  id: string;
  nombre: string;
  usuarioNombre: string;
  rol: {
    id: number;
    nombre: string;
  };
};

export type CreateUserInputShape = {
  nombre: string;
  usuarioNombre: string;
  password: string;
  activo: boolean;
};

export type CreateUserOutputShape = {
  id: string;
};
