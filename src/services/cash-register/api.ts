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
export async function createCashRegister(
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
export async function openCashRegister(
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
export async function deactiveCashRegister(
  input: DeactiveCashRegisterInputShape,
): Promise<DeactiveCashRegisterOutputShape> {
  const url = '/Caja/DeactiveById';

  return ApiClient.post<
    DeactiveCashRegisterInputShape,
    DeactiveCashRegisterOutputShape
  >(url, input);
}
