import ApiClient from '@/services/AxiosClient';
import type {
  LoginAuthInputShape,
  LoginAuthOutputShape,
  GetUserInfoOutputShape,
  CreateUserInputShape,
  CreateUserOutputShape,
  GetUsersListOutputShape,
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
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<GetUsersListOutputShape>> {
  const url = '/Usuario/GetList';

  return ApiClient.get<GetUsersListOutputShape>(url, config);
}

export { loginAuth, getUserInfo, getUsersList, createUser };
