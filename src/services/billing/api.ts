import ApiClient from '@/services/AxiosClient';
import type {
  AddInvoiceInputShape,
  AddInvoiceOutputShape,
  GetAllInvoicesOutputShape,
  GetInvoiceByIdOutputShape,
  GetTypeListOutputShape,
} from '@/services/billing/models';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

async function addInvoice(
  input: AddInvoiceInputShape,
): Promise<AxiosResponse<AddInvoiceOutputShape>> {
  const url = '/Facturacion/AddInvoice';

  return ApiClient.post<
    AddInvoiceInputShape,
    AxiosResponse<AddInvoiceOutputShape>
  >(url, input);
}

async function getAllInvoices(
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<GetAllInvoicesOutputShape>> {
  const url = '/Facturacion/GetInvoiceList';

  return ApiClient.get<GetAllInvoicesOutputShape>(url, config);
}

async function GetTypeList(
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<GetTypeListOutputShape>> {
  const url = '/Facturacion/GetTypeList';

  return ApiClient.get<GetTypeListOutputShape>(url, config);
}

async function getInvoiceById(
  id: string,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<GetInvoiceByIdOutputShape>> {
  const url = `/Facturacion/GetById?id=${id}`;

  return ApiClient.get<GetInvoiceByIdOutputShape>(url, config);
}

export { addInvoice, getAllInvoices, GetTypeList, getInvoiceById };
