import ApiClient from '@/services/AxiosClient';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type {
  CreateCashRegisterInputShape,
  CreateCashRegisterOutputShape,
  DeactiveCashRegisterInputShape,
  DeactiveCashRegisterOutputShape,
  GetCashiersListOutputShape,
  UpdateCashierInputShape,
  UpdateCashierOutputShape,
  DeleteCashierInputShape,
  DeleteCashierOutputShape,
} from '@/services/cash-register/models';

async function createCashRegister(
  input: CreateCashRegisterInputShape,
): Promise<AxiosResponse<CreateCashRegisterOutputShape>> {
  const url = '/Caja/CreateOne/';

  return ApiClient.post<
    CreateCashRegisterInputShape,
    AxiosResponse<CreateCashRegisterOutputShape>
  >(url, input);
}

async function getCashiersList(
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<GetCashiersListOutputShape>> {
  const url = '/Caja/GetList';

  return ApiClient.get<GetCashiersListOutputShape>(url, config);
}

async function updateCashier(
  input: UpdateCashierInputShape,
): Promise<AxiosResponse<UpdateCashierOutputShape>> {
  const url = `/Caja/EditOne?id=${input.id}`;
  const { ...dataToUpdate } = input;

  return ApiClient.post<
    UpdateCashierInputShape,
    AxiosResponse<UpdateCashierOutputShape>
  >(url, dataToUpdate);
}

async function deactivateCashRegister(
  input: DeactiveCashRegisterInputShape,
): Promise<AxiosResponse<DeactiveCashRegisterOutputShape>> {
  const url = '/Caja/DeactiveById';

  return ApiClient.post<
    DeactiveCashRegisterInputShape,
    AxiosResponse<DeactiveCashRegisterOutputShape>
  >(url, input);
}

async function deleteCashier(
  input: DeleteCashierInputShape,
): Promise<AxiosResponse<DeleteCashierOutputShape>> {
  const url = `/Caja/DeleteById?id=${input.id}`;

  return ApiClient.post<
    DeleteCashierInputShape,
    AxiosResponse<DeleteCashierOutputShape>
  >(url);
}

export {
  createCashRegister,
  getCashiersList,
  updateCashier,
  deactivateCashRegister,
  deleteCashier,
};
