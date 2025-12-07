import type { InvoiceDetail } from '@/domains/billing/Invoice';

export type PrintInvoiceInputShape = {
  ok: boolean;
  data: InvoiceDetail;
};

export type PrintInvoiceOutputShape = {
  ok: boolean;
  message?: string;
};

export type GetInvoicePreviewInputShape = {
  ok: boolean;
  data: InvoiceDetail;
};

export type GetInvoicePreviewOutputShape = {
  ok: boolean;
  preview: string;
};

export type GetInvoicePreviewHTMLOutputShape = {
  ok: boolean;
  html: string;
};
