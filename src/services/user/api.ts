import ApiClient from '@/services/AxiosClient';
import type {
  LoginAuthInputShape,
  LoginAuthOutputShape,
  GetUserInfoOutputShape,
  CreateUserInputShape,
  CreateUserOutputShape,
  GetUsersListOutputShape,
  CreateCashRegisterInputShape,
  CreateCashRegisterOutputShape,
  DeleteUserInputShape,
  DeleteUserOutputShape,
  UpdateUserInputShape,
  UpdateUserOutputShape,
  DeactivateUserByIdInputShape,
  DeactivateUserByIdOutputShape,
  DeactiveCashRegisterInputShape,
  DeactiveCashRegisterOutputShape,
} from '@/services/user/models';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

async function loginAuth(
  input: LoginAuthInputShape,
): Promise<AxiosResponse<LoginAuthOutputShape>> {
  const url = '/Auth/GenerateToken/';

  return ApiClient.post<
    LoginAuthInputShape,
    AxiosResponse<LoginAuthOutputShape>
  >(url, input);
}

async function getUserInfo(
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<GetUserInfoOutputShape>> {
  const url = '/Auth/GetInfoUsuario/';

  return ApiClient.get<GetUserInfoOutputShape>(url, config);
}

async function createUser(
  input: CreateUserInputShape,
): Promise<AxiosResponse<CreateUserOutputShape>> {
  const url = '/Usuario/CreateOne/';

  return ApiClient.post<
    CreateUserInputShape,
    AxiosResponse<CreateUserOutputShape>
  >(url, input);
}

async function getUsersList(
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<GetUsersListOutputShape>> {
  const url = '/Usuario/GetList';

  return ApiClient.get<GetUsersListOutputShape>(url, config);
}

async function createCashRegister(
  input: CreateCashRegisterInputShape,
): Promise<AxiosResponse<CreateCashRegisterOutputShape>> {
  const url = '/Caja/CreateOne/';

  return ApiClient.post<
    CreateCashRegisterInputShape,
    AxiosResponse<CreateCashRegisterOutputShape>
  >(url, input);
}

async function deleteUser(
  input: DeleteUserInputShape,
): Promise<AxiosResponse<DeleteUserOutputShape>> {
  const url = `/Usuario/DeleteById?id=${input.id}`;

  return ApiClient.post<
    DeleteUserInputShape,
    AxiosResponse<DeleteUserOutputShape>
  >(url);
}

async function updateUser(
  input: UpdateUserInputShape,
): Promise<AxiosResponse<UpdateUserOutputShape>> {
  const url = `/Usuario/EditOne?id=${input.id}`;
  const { ...dataToUpdate } = input;

  return ApiClient.post<
    UpdateUserInputShape,
    AxiosResponse<UpdateUserOutputShape>
  >(url, dataToUpdate);
}

async function deactivateUserById(
  input: DeactivateUserByIdInputShape,
): Promise<AxiosResponse<DeactivateUserByIdOutputShape>> {
  const url = `/Usuario/DeactiveById?id=${input.id}`;

  return ApiClient.post<
    DeactivateUserByIdInputShape,
    AxiosResponse<DeactivateUserByIdOutputShape>
  >(url);
}

async function deactiveCashRegister(
  input: DeactiveCashRegisterInputShape,
): Promise<AxiosResponse<DeactiveCashRegisterOutputShape>> {
  const url = 'Caja/DeactiveById';

  return ApiClient.post<
    DeactiveCashRegisterInputShape,
    AxiosResponse<DeactiveCashRegisterOutputShape>
  >(url, input);
}

export {
  loginAuth,
  getUserInfo,
  getUsersList,
  createUser,
  createCashRegister,
  deleteUser,
  updateUser,
  deactivateUserById,
  deactiveCashRegister,
};
