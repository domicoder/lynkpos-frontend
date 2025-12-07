import ApiClient from '@/services/AxiosClient';
import type {
  CreateCashRegisterInputShape,
  CreateCashRegisterOutputShape,
  DeactiveCashRegisterInputShape,
  DeactiveCashRegisterOutputShape,
  GetCashierListOutputShape,
} from '@/services/cash-register/models';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

async function createCashRegister(
  input: CreateCashRegisterInputShape,
): Promise<CreateCashRegisterOutputShape> {
  const url = '/Caja/CreateOne/';

  return ApiClient.post<
    CreateCashRegisterInputShape,
    CreateCashRegisterOutputShape
  >(url, input);
}

async function deactiveCashRegister(
  input: DeactiveCashRegisterInputShape,
): Promise<DeactiveCashRegisterOutputShape> {
  const url = '/Caja/DeactiveById';

  return ApiClient.post<
    DeactiveCashRegisterInputShape,
    DeactiveCashRegisterOutputShape
  >(url, input);
}

async function getCashierList(
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<GetCashierListOutputShape>> {
  const url = '/Caja/GetList';

  return ApiClient.get<GetCashierListOutputShape>(url, config);
}

export { createCashRegister, deactiveCashRegister, getCashierList };
