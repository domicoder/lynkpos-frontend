import ApiClient from '@/services/AxiosClient';
import type {
  LoginAuthInputShape,
  LoginAuthOutputShape,
} from '@/services/user/models';

async function loginAuth(
  input: LoginAuthInputShape,
): Promise<LoginAuthOutputShape> {
  const url = '/login/';

  return ApiClient.post<LoginAuthInputShape, LoginAuthOutputShape>(url, input);
}

export { loginAuth };
