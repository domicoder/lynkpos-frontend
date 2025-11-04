import ApiClient from '@/services/AxiosClient';
import type {
  LoginAuthInputShape,
  LoginAuthOutputShape,
  GetUserInfoOutputShape,
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

export { loginAuth, getUserInfo };
