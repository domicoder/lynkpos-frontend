import ApiClient from '@/services/AxiosClient';
import type {
  LoginAuthInputShape,
  LoginAuthOutputShape,
  GetUserInfoOutputShape,
  CreateUserInputShape,
  CreateUserOutputShape,
  GetUsersListOutputShape,
  GetUsersListInputShape,
  CreateCashRegisterInputShape,
  CreateCashRegisterOutputShape,
  DeleteUserInputShape,
  DeleteUserOutputShape,
  UpdateUserInputShape,
  UpdateUserOutputShape,
} from '@/services/user/models';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

async function loginAuth(
  input: LoginAuthInputShape,
): Promise<LoginAuthOutputShape> {
  const url = '/Auth/GenerateToken/';

  return ApiClient.post<LoginAuthInputShape, LoginAuthOutputShape>(url, input);
}

async function getUserInfo(
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<GetUserInfoOutputShape>> {
  const url = '/Auth/GetInfoUsuario/';

  return ApiClient.get<GetUserInfoOutputShape>(url, config);
}
async function getUserList(
  input: GetUsersListInputShape,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<GetUsersListOutputShape>> {
  const url = '/Usuario/GetList';

  return ApiClient.get<GetUsersListOutputShape>(url, {
    params: {
      // OJO: mismos nombres que Swagger
      UsuarioNombre: input.usuarioNombre || undefined,
      Activo: input.activo ?? undefined,
      Page: input.page,
      PageSize: input.pageSize,
    },
    ...config,
  });
}
async function createUser(
  input: CreateUserInputShape,
): Promise<CreateUserOutputShape> {
  const url = '/Usuario/CreateOne/';

  return ApiClient.post<CreateUserInputShape, CreateUserOutputShape>(
    url,
    input,
  );
}

async function getUsersList(
  input: GetUsersListInputShape = {},
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<GetUsersListOutputShape>> {
  const url = '/Usuario/GetList';

  const page = input.page ?? 1;
  const pageSize = input.pageSize ?? 10;

  return ApiClient.get<GetUsersListOutputShape>(url, {
    params: {
      UsuarioNombre: input.usuarioNombre || undefined,
      Activo: input.activo ?? undefined,
      Page: page,
      PageSize: pageSize,
    },
    ...config,
  });
}
async function createCashRegister(
  input: CreateCashRegisterInputShape,
): Promise<CreateCashRegisterOutputShape> {
  const url = '/Caja/CreateOne/';

  return ApiClient.post<
    CreateCashRegisterInputShape,
    CreateCashRegisterOutputShape
  >(url, input);
}

async function deleteUser(
  input: DeleteUserInputShape,
): Promise<AxiosResponse<DeleteUserOutputShape>> {
  const url = `/Usuario/DeleteById?id=${input.id}`;

  return ApiClient.post<DeleteUserOutputShape>(url);
}

async function updateUser({
  id,
  ...dataToUpdate
}: UpdateUserInputShape): Promise<AxiosResponse<UpdateUserOutputShape>> {
  const url = `/Usuario/EditOne?id=${id}`;

  return ApiClient.post<UpdateUserOutputShape>(url, dataToUpdate);
}

export {
  loginAuth,
  getUserInfo,
  getUsersList,
  createUser,
  createCashRegister,
  deleteUser,
  updateUser,
  getUserList,
};
