export type LoginAuthInputShape = {
  email: string;
  password: string;
};

export type LoginAuthOutputShape = {
  data: {
    id: number;
    userName: string;
    email: string;
    accessToken: string;
    createdAt: string;
    updatedAt: string;
  };
};
