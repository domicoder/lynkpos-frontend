import ApiClient from '@/services/AxiosClient';
import type {
  PrintInvoiceInputShape,
  PrintInvoiceOutputShape,
  GetInvoicePreviewInputShape,
  GetInvoicePreviewOutputShape,
  GetInvoicePreviewHTMLOutputShape,
} from '@/services/printing/models';
import type { AxiosResponse } from 'axios';

async function printInvoice(
  input: PrintInvoiceInputShape,
): Promise<AxiosResponse<PrintInvoiceOutputShape>> {
  const url = '/Printing/invoice';

  return ApiClient.post<
    PrintInvoiceInputShape,
    AxiosResponse<PrintInvoiceOutputShape>
  >(url, input);
}

async function getInvoicePreview(
  input: GetInvoicePreviewInputShape,
): Promise<AxiosResponse<GetInvoicePreviewOutputShape>> {
  const url = '/Printing/invoice/preview';

  return ApiClient.post<
    GetInvoicePreviewInputShape,
    AxiosResponse<GetInvoicePreviewOutputShape>
  >(url, input);
}

async function getInvoicePreviewHtml(
  input: GetInvoicePreviewInputShape,
): Promise<AxiosResponse<GetInvoicePreviewHTMLOutputShape>> {
  const url = '/Printing/invoice/preview/html';

  return ApiClient.post<
    GetInvoicePreviewInputShape,
    AxiosResponse<GetInvoicePreviewHTMLOutputShape>
  >(url, input);
}

export { printInvoice, getInvoicePreview, getInvoicePreviewHtml };
