import ApiClient from '@/services/AxiosClient';
import type {
  CreateCashRegisterInputShape,
  CreateCashRegisterOutputShape,
  DeactiveCashRegisterInputShape,
  DeactiveCashRegisterOutputShape,
  OpenCashRegisterInputShape,
  OpenCashRegisterOutputShape,
} from '@/services/cash-register/models';

/**
 * Crear cajero
 */
async function createCashRegister(
  input: CreateCashRegisterInputShape,
): Promise<CreateCashRegisterOutputShape> {
  const url = '/Caja/CreateOne/';

  return ApiClient.post<
    CreateCashRegisterInputShape,
    CreateCashRegisterOutputShape
  >(url, input);
}

/**
 * Abrir cajero
 */
async function openCashRegister(
  input: OpenCashRegisterInputShape,
): Promise<OpenCashRegisterOutputShape> {
  const url = `/Caja/Open?id=${encodeURIComponent(input.id)}`;

  return ApiClient.post<
    OpenCashRegisterInputShape,
    OpenCashRegisterOutputShape
  >(url, {
    id: input.id,
    usuarioId: input.usuarioId,
  });
}

/**
 * Cerrar / desactivar cajero
 */
async function deactiveCashRegister(
  input: DeactiveCashRegisterInputShape,
): Promise<DeactiveCashRegisterOutputShape> {
  const url = `/Caja/Deactivate?id=${encodeURIComponent(input.id)}`;

  return ApiClient.post<
    DeactiveCashRegisterInputShape,
    DeactiveCashRegisterOutputShape
  >(url, input);
}

export { createCashRegister, deactiveCashRegister, openCashRegister };
