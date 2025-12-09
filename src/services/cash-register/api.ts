import ApiClient from '@/services/AxiosClient';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type {
  CreateCashRegisterInputShape,
  CreateCashRegisterOutputShape,
  DeactiveCashRegisterInputShape,
  DeactiveCashRegisterOutputShape,
  GetCashierListOutputShape,
  GetCashiersListOutputShape,
  UpdateCashierInputShape,
  UpdateCashierOutputShape,
  DeleteCashierInputShape,
  DeleteCashierOutputShape,
  CloseCashierInputShape,
  CloseCashierOutputShape,
  OpenCashierOutputShape,
  OpenCashierInputShape,
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

async function getCashierList(
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<GetCashierListOutputShape>> {
  const url = '/Caja/GetList';

  return ApiClient.get<GetCashierListOutputShape>(url, config);
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

async function closeCashier(
  input: CloseCashierInputShape,
): Promise<AxiosResponse<CloseCashierOutputShape>> {
  const url = `/Caja/Close?id=${input.id}`;

  const { usuarioId } = input;

  return ApiClient.post<
    CloseCashierInputShape,
    AxiosResponse<CloseCashierOutputShape>
  >(url, { usuarioId });
}

async function openCashier(
  input: OpenCashierInputShape,
): Promise<AxiosResponse<OpenCashierOutputShape>> {
  const url = `/Caja/Open?id=${input.id}`;

  const { usuarioId } = input;

  return ApiClient.post<
    OpenCashierInputShape,
    AxiosResponse<OpenCashierOutputShape>
  >(url, { usuarioId });
}

export {
  createCashRegister,
  getCashiersList,
  updateCashier,
  deactivateCashRegister,
  deleteCashier,
  getCashierList,
  closeCashier,
  openCashier,
};
