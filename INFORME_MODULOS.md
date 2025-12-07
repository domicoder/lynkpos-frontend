# Informe de Módulos Implementados - LynkPOS Frontend

## Resumen Ejecutivo

Este documento describe los módulos y funcionalidades implementadas en el sistema de punto de venta LynkPOS. El proyecto está desarrollado con Vue 3, TypeScript, Vuetify y sigue una arquitectura limpia y escalable.

---

## 1. Módulo de Servicios de Impresión

### 1.1 Descripción General

Módulo completo para gestionar la impresión y visualización previa de facturas generadas en el sistema.

### 1.2 Estructura de Archivos

- `src/services/printing/api.ts` - Funciones de API para comunicación con el backend
- `src/services/printing/models.ts` - Tipos TypeScript y interfaces
- `src/services/printing/index.ts` - Exportaciones del módulo

### 1.3 Funcionalidades Implementadas

#### 1.3.1 Impresión de Facturas

- **Endpoint**: `POST /Printing/invoice`
- **Función**: `printInvoice()`
- **Propósito**: Envía una factura al sistema de impresión del backend
- **Input**: Objeto con `ok: boolean` y `data: InvoiceDetail`
- **Output**: Respuesta con estado de éxito o error

#### 1.3.2 Vista Previa de Factura (Texto)

- **Endpoint**: `POST /Printing/invoice/preview`
- **Función**: `getInvoicePreview()`
- **Propósito**: Obtiene una vista previa en formato texto de la factura
- **Output**: String con el contenido del ticket

#### 1.3.3 Vista Previa de Factura (HTML)

- **Endpoint**: `POST /Printing/invoice/preview/html`
- **Función**: `getInvoicePreviewHtml()`
- **Propósito**: Obtiene una vista previa renderizada en HTML de la factura
- **Output**: HTML completo listo para mostrar en iframe

### 1.4 Tipos TypeScript

```typescript
- PrintInvoiceInputShape: Input para impresión
- PrintInvoiceOutputShape: Respuesta de impresión
- GetInvoicePreviewInputShape: Input para preview
- GetInvoicePreviewOutputShape: Respuesta de preview en texto
- GetInvoicePreviewHTMLOutputShape: Respuesta de preview en HTML
```

---

## 2. Módulo de Facturación (Billing)

### 2.1 Descripción General

Módulo que gestiona la creación, consulta y gestión de facturas en el sistema.

### 2.2 Funcionalidades Implementadas

#### 2.2.1 Creación de Facturas

- **Endpoint**: `POST /Facturacion/AddInvoice`
- **Función**: `addInvoice()`
- **Input**: Tipo de factura, caja registradora, lista de productos con cantidades
- **Output**: ID de la factura creada

#### 2.2.2 Consulta de Facturas

- **Endpoint**: `GET /Facturacion/GetInvoiceList`
- **Función**: `getAllInvoices()`
- **Propósito**: Obtiene lista completa de facturas con paginación

#### 2.2.3 Consulta de Factura por ID

- **Endpoint**: `GET /Facturacion/GetById?id={id}`
- **Función**: `getInvoiceById()`
- **Propósito**: Obtiene detalles completos de una factura específica
- **Output**: InvoiceDetail con información completa incluyendo productos, impuestos, totales

#### 2.2.4 Tipos de Factura

- **Endpoint**: `GET /Facturacion/GetTypeList`
- **Función**: `GetTypeList()`
- **Propósito**: Obtiene lista de tipos de factura disponibles

### 2.3 Modelos de Datos

```typescript
- AddInvoiceInputShape: Input para crear factura
- InvoiceDetail: Detalle completo de factura
- InvoiceProduct: Producto dentro de una factura
- InvoiceType: Tipo de factura
- InvoiceState: Estado de factura
```

---

## 3. Módulo de Ventas (Sales)

### 3.1 Descripción General

Módulo principal para el proceso de venta en el punto de venta. Incluye gestión de productos, cálculo de totales, y flujo completo de facturación.

### 3.2 Funcionalidades Implementadas

#### 3.2.1 Gestión de Productos en Venta

- **Agregar productos**: Búsqueda por código de barras o ID
- **Cantidad dinámica**: Incremento automático si el producto ya existe
- **Eliminación**: Remover productos de la venta actual
- **Validación**: Verificación de stock disponible

#### 3.2.2 Escáner de Código de Barras

- **Detección automática**: Escucha eventos de teclado para detectar escaneo
- **Timeout configurable**: 100ms entre pulsaciones para identificar escaneo
- **Filtrado inteligente**: Ignora inputs cuando el usuario está escribiendo manualmente
- **Integración**: Búsqueda automática del producto al detectar código

#### 3.2.3 Cálculo de Totales

- **Total bruto**: Suma de precio unitario por cantidad de cada producto
- **Cálculo de impuestos**: Porcentaje de impuesto por producto
- **Total a pagar**: Cálculo reactivo con formato de moneda
- **Separación de datos**: Valores raw para cálculos y valores formateados para display

#### 3.2.4 Selección de Caja Registradora

- **Lista de cajas**: Obtención desde el store de punto de venta
- **Validación**: Requerida antes de procesar factura
- **Integración**: Asociación con la factura generada

#### 3.2.5 Proceso de Facturación Completo

1. Validación de caja registradora seleccionada
2. Creación de factura en backend
3. Obtención de detalles completos de factura
4. Envío a impresión
5. Generación de vista previa HTML
6. Apertura automática de modal de preview
7. Limpieza de productos después de venta exitosa

### 3.3 Composable useSales()

**Estado Reactivo:**

- `products`: Lista de productos en la venta actual
- `cashRegisterId`: Caja registradora seleccionada
- `totalToPayAmount`: Total calculado (número)
- `totalToPayFormatted`: Total formateado (string)
- `loading`: Estado de carga
- `search`: Término de búsqueda

**Funciones Principales:**

- `onAddInvoice()`: Procesa la venta completa
- `handleBarcodeScanned()`: Maneja escaneo de código de barras
- `addProductToTable()`: Agrega producto a la venta
- `handleDeleteProduct()`: Elimina producto de la venta
- `showInvoicePreview()`: Obtiene y muestra preview de factura
- `closeInvoicePreviewModal()`: Cierra modal y limpia estado
- `handleCancelSale()`: Cancela la venta actual

### 3.4 Patrones de Diseño Implementados

**Singleton Refs:**

- `showModal` y `ticketHtml` definidos fuera del composable para compartir estado entre instancias
- Solución a problemas de reactividad en composables de Vue 3

**Separación de Concerns:**

- Valores raw para cálculos (`totalToPayAmount`)
- Valores formateados para UI (`totalToPayFormatted`)

---

## 4. Componente Modal de Vista Previa de Factura

### 4.1 Descripción General

Componente reutilizable para mostrar la vista previa de facturas con funcionalidades de cálculo de cambio y confirmación de impresión.

### 4.2 Ubicación

`src/components/shared/modals/InvoicePreviewModal.vue`

### 4.3 Funcionalidades

#### 4.3.1 Visualización de Factura

- **Iframe HTML**: Renderiza el HTML de la factura recibido del backend
- **Dimensiones**: 350px ancho x 450px alto
- **Estilo**: Bordes redondeados y fondo blanco

#### 4.3.2 Cálculo de Cambio

- **Monto recibido**: Input numérico para ingresar cantidad recibida del cliente
- **Total a pagar**: Muestra el total de la factura formateado
- **Cambio a dar**: Cálculo reactivo automático
  - Fórmula: `cambio = montoRecibido >= total ? montoRecibido - total : 0`
- **Formato de moneda**: Todos los valores mostrados en formato USD

#### 4.3.3 Confirmación de Cierre

- **Modal de advertencia**: Al intentar cerrar, muestra confirmación
- **Mensaje**: Advertencia para verificar que la factura fue impresa
- **Integración**: Usa `GlobalStore` para mostrar modal de confirmación

#### 4.3.4 Acciones Disponibles

- **Imprimir**: Emite evento `@print` para procesar impresión
- **Cerrar/Cancelar**: Emite evento `@close` con confirmación previa

### 4.4 Props

```typescript
interface Props {
  html: string; // HTML de la factura
  totalToPay: number; // Total a pagar (número raw)
}
```

### 4.5 Eventos

```typescript
emit('print'): void;      // Solicitud de impresión
emit('close'): void;      // Solicitud de cierre
```

### 4.6 Características Técnicas

**Reactividad:**

- `amountReceived`: Ref reactivo que actualiza el cálculo de cambio
- `changeToGive`: Computed property que recalcula automáticamente
- Watcher que resetea `amountReceived` al abrir el modal

**Utilidades:**

- Función `formatCurrency()` para formateo consistente de moneda
- Validación de valores numéricos
- Manejo de casos edge (valores negativos, NaN, etc.)

---

## 5. Módulo de Gestión de Usuarios

### 5.1 Funcionalidades Implementadas

- Creación de usuarios
- Edición de usuarios
- Eliminación de usuarios
- Cambio de estado (activo/inactivo)
- Modales reutilizables para operaciones CRUD

### 5.2 Componentes

- `AddUserModal.vue`
- `EditUserModal.vue`
- `ConfirmModal.vue` (reutilizable)

---

## 6. Módulo de Cajas Registradoras

### 6.1 Funcionalidades

- Listado de cajas registradoras
- Selección de caja para ventas
- Integración con módulo de ventas
- Gestión de estado mediante Pinia Store

---

## 7. Módulo de Productos

### 7.1 Funcionalidades

- Búsqueda de productos por ID o código de barras
- Consulta de información de producto
- Validación de stock
- Integración con módulo de ventas

---

## 8. Arquitectura y Patrones Implementados

### 8.1 Arquitectura de Servicios

- **Separación por dominio**: Cada módulo tiene su propia carpeta en `services/`
- **Estructura consistente**: `api.ts`, `models.ts`, `index.ts` en cada módulo
- **Tipado fuerte**: TypeScript en todas las interfaces
- **Cliente HTTP centralizado**: `ApiClient` con interceptores y manejo de tokens

### 8.2 Gestión de Estado

- **Pinia Stores**: Para estado global compartido
- **Composables**: Para lógica reutilizable
- **Singleton Refs**: Para estado compartido entre instancias de composables

### 8.3 Componentes

- **BaseModal**: Componente base reutilizable para todos los modales
- **Componentes específicos**: Modales especializados que extienden BaseModal
- **Separación de concerns**: Lógica en composables, presentación en componentes

### 8.4 Internacionalización

- **i18n**: Soporte para múltiples idiomas (español e inglés)
- **Traducciones centralizadas**: Archivos JSON en `src/locales/`
- **Uso consistente**: Todas las cadenas de texto traducibles

### 8.5 Manejo de Errores

- **Snackbars**: Notificaciones de éxito y error
- **Validación**: En formularios y antes de operaciones críticas
- **Confirmaciones**: Modales de confirmación para acciones destructivas

---

## 9. Flujo Completo de Venta

### 9.1 Proceso Paso a Paso

1. **Selección de Caja Registradora**

   - Usuario selecciona caja desde dropdown
   - Validación requerida antes de continuar

2. **Agregar Productos**

   - Búsqueda manual por ID o código
   - Escaneo automático de código de barras
   - Productos agregados a tabla de venta
   - Cálculo automático de totales

3. **Revisión de Venta**

   - Visualización de productos seleccionados
   - Total calculado y formateado
   - Opción de eliminar productos

4. **Procesamiento de Factura**

   - Validación de caja seleccionada
   - Creación de factura en backend
   - Obtención de detalles completos
   - Envío a sistema de impresión

5. **Vista Previa y Confirmación**

   - Modal automático con preview HTML
   - Cálculo de cambio si se recibe pago
   - Confirmación de impresión
   - Advertencia al cerrar sin imprimir

6. **Finalización**
   - Limpieza de productos
   - Reset de estado
   - Notificación de éxito

---

## 10. Mejores Prácticas Implementadas

### 10.1 Código Limpio

- **Nombres descriptivos**: Variables y funciones con nombres claros
- **Comentarios JSDoc**: Documentación en funciones complejas
- **Separación de lógica**: Cálculos separados de presentación
- **Funciones puras**: Utilidades sin efectos secundarios

### 10.2 TypeScript

- **Tipado estricto**: Interfaces para todos los datos
- **Tipos compartidos**: Modelos reutilizables entre módulos
- **Type safety**: Validación en tiempo de compilación

### 10.3 Reactividad Vue 3

- **Computed properties**: Para valores derivados
- **Refs apropiados**: Uso correcto de ref vs reactive
- **Watchers**: Para efectos secundarios controlados

### 10.4 Performance

- **Lazy loading**: Componentes cargados bajo demanda
- **Computed caching**: Valores calculados cacheados automáticamente
- **Optimización de renders**: Uso eficiente de v-if y v-show

---

## 11. Endpoints del Backend Utilizados

### 11.1 Facturación

- `POST /Facturacion/AddInvoice` - Crear factura
- `GET /Facturacion/GetInvoiceList` - Listar facturas
- `GET /Facturacion/GetById?id={id}` - Obtener factura por ID
- `GET /Facturacion/GetTypeList` - Obtener tipos de factura

### 11.2 Impresión

- `POST /Printing/invoice` - Imprimir factura
- `POST /Printing/invoice/preview` - Preview en texto
- `POST /Printing/invoice/preview/html` - Preview en HTML

### 11.3 Otros Módulos

- Endpoints de productos, usuarios, cajas registradoras (implementados en otros módulos)

---

## 12. Consideraciones Técnicas

### 12.1 Reactividad en Composables

**Problema identificado y resuelto:**

- Refs definidas dentro de composables crean nuevas instancias en cada llamada
- Solución: Definir refs compartidas fuera del composable (singleton pattern)

### 12.2 Separación de Datos Raw y Formateados

**Patrón implementado:**

- Valores numéricos raw para cálculos (`totalToPayAmount`)
- Valores formateados para display (`totalToPayFormatted`)
- Evita problemas de parsing y mantiene precisión en cálculos

### 12.3 Manejo de Estados Asíncronos

- Loading states para operaciones de red
- Error handling con try-catch
- Notificaciones de usuario para feedback

---

## 13. Estructura de Carpetas del Proyecto

```
src/
├── components/
│   └── shared/
│       └── modals/
│           ├── BaseModal.vue
│           ├── InvoicePreviewModal.vue
│           ├── ConfirmModal.vue
│           ├── AddUserModal.vue
│           └── EditUserModal.vue
├── services/
│   ├── printing/
│   │   ├── api.ts
│   │   ├── models.ts
│   │   └── index.ts
│   ├── billing/
│   │   ├── api.ts
│   │   ├── models.ts
│   │   └── index.ts
│   ├── sales/
│   │   ├── api.ts
│   │   ├── models.ts
│   │   └── index.ts
│   └── ...
├── views/
│   ├── sales/
│   │   ├── SalesDashboardView.vue
│   │   └── sales.ts
│   └── ...
├── stores/
│   └── point-of-sale/
│       └── PointOfSaleStore.ts
└── locales/
    ├── en.locale.json
    └── es.locale.json
```

---

## 14. Conclusión

El sistema LynkPOS Frontend implementa un conjunto completo de módulos para gestionar el punto de venta, incluyendo:

- Gestión completa del flujo de ventas
- Integración con sistema de facturación
- Sistema de impresión y preview de facturas
- Cálculo automático de totales y cambio
- Escaneo de código de barras
- Gestión de usuarios y cajas registradoras
- Arquitectura escalable y mantenible

Todos los módulos siguen patrones consistentes, están completamente tipados con TypeScript, y siguen las mejores prácticas de Vue 3 y desarrollo frontend moderno.

---

**Fecha de generación**: Diciembre 2025
**Versión del documento**: 1.0
