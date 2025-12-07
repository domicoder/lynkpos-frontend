import ApiClient from '@/services/AxiosClient';
import type {
  GetProductByIdOutputShape,
  GetProductsOutputShape,
} from '@/services/sales/models';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

// async function createCashRegister(
//   input: CreateCashRegisterInputShape,
// ): Promise<CreateCashRegisterOutputShape> {
//   const url = '/Caja/CreateOne/';

//   return ApiClient.post<
//     CreateCashRegisterInputShape,
//     CreateCashRegisterOutputShape
//   >(url, input);
// }

async function getAllProducts(
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<GetProductsOutputShape>> {
  const url = '/Producto/GetProductList';

  return ApiClient.get<GetProductsOutputShape>(url, config);
}

// getProductById
async function getProductById(
  id: string,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<GetProductByIdOutputShape>> {
  const url = `/Producto/GetProductById?id=${id}`;

  return ApiClient.get<GetProductByIdOutputShape>(url, config);
}

export { getAllProducts, getProductById };
