import ApiClient from '@/services/AxiosClient';
import type {
  CreateCashRegisterInputShape,
  CreateCashRegisterOutputShape,
  DeactiveCashRegisterInputShape,
  DeactiveCashRegisterOutputShape,
  OpenCashRegisterInputShape,
  OpenCashRegisterOutputShape,
} from '@/services/cash-register/models';
import type { AxiosResponse } from 'axios';

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

async function openCashRegister(
  input: OpenCashRegisterInputShape,
): Promise<AxiosResponse<OpenCashRegisterOutputShape>> {
  const url = `/Caja/Open?id=${encodeURIComponent(input.id)}`;

  return ApiClient.post<
    { usuarioId: string },
    AxiosResponse<OpenCashRegisterOutputShape>
  >(url, { usuarioId: input.usuarioId });
}

export { createCashRegister, deactiveCashRegister, openCashRegister };
