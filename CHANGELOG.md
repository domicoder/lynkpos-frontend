# CHANGELOG

## 0.1.0 (2025-11-30)

### 🚀 Features

-   **deactivate cash register**
    Implementación de la funcionalidad para desactivar cajas registradoras.
-   **separate `UsersView` logic**
    Separación de lógica para mejorar mantenibilidad.
-   **create `UserStore`**
    Nuevo store para evitar múltiples llamadas a la API.
-   **create `ConfirmModal`**
    Componente modal de confirmación reutilizable.
-   **conditional modal actions**
    El `ConfirmModal` ahora muestra acciones según el contexto.
-   **create `ModalAction`**
    Reutilización de acciones de modal para un patrón consistente.
-   **add `ConfirmModal` to `BlankLayout`**
    El modal de confirmación está disponible globalmente.

### 🛠 Improvements

-   **improve `ConfirmModal` UI**
    Mejoras visuales y de experiencia de usuario.
-   **update user**
    Mejoras generales en la gestión de usuarios.

### 🔧 Refactors

-   **remove `data:` in `outputShape`**
    Limpieza del shape ya que se usa `AxiosResponse<>` directamente.
-   **add callback to `ConfirmModal`**
    Soporte para callbacks luego de confirmar.

## 0.0.1 (2025-11-25)

### 🚀 Features

-   **Add User (Modal)**
    Implementación del modal para creación de usuarios.
-   **Endpoint: Create Cash Register**
    Nuevo endpoint para crear cajas registradoras.
-   **Endpoint: Get Users**
    Agregado el endpoint para obtener la lista de usuarios.
-   **Add User Table**
    Creación de la tabla de usuarios en la interfaz.
-   **Global Loading**
    Indicador de carga global integrado en la aplicación.
-   **Add Global Snackbar**
    Componente global para mostrar notificaciones tipo snackbar.
