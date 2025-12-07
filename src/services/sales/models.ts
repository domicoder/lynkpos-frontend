export type GetProductsOutputShape = {
  data: ProductTable[];
  ok: boolean;
};

export type ProductTable = {
  productoId: string;
  nombre: string;
  precioUnitario: number;
  impuestoPorcentaje: number;
  stock: number;
};

export type GetProductByIdOutputShape = {
  data: ProductTable;
  ok: boolean;
  message?: string;
};
