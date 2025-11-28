import ApiClient from '@/services/AxiosClient';
import type {
  CreateCashRegisterInputShape,
  CreateCashRegisterOutputShape,
  DeactiveCashRegisterInputShape,
  DeactiveCashRegisterOutputShape,
} from '@/services/user/models';

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

export { createCashRegister, deactiveCashRegister };
