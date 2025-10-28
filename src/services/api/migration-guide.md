# 🔄 Guía de Migración - Cliente API Actual → Nuevo

## 📋 Plan de Migración por Fases

### Fase 1: Preparación (1-2 días)

- [x] Instalar dependencias (`zod`)
- [x] Configurar variables de entorno
- [x] Crear archivos de la nueva arquitectura
- [x] Configurar en `main.ts`

### Fase 2: Migración Gradual (3-5 días)

- [ ] Migrar servicios críticos uno por uno
- [ ] Mantener compatibilidad con cliente anterior
- [ ] Probar cada migración individualmente

### Fase 3: Migración Completa (2-3 días)

- [ ] Migrar todos los servicios restantes
- [ ] Actualizar todos los componentes
- [ ] Eliminar cliente anterior

### Fase 4: Optimización (1-2 días)

- [ ] Ajustar configuraciones
- [ ] Optimizar performance
- [ ] Documentar cambios

## 🚀 Pasos de Migración

### 1. Configuración Inicial

```typescript
// main.ts
import { setupApiClient } from '@/services/api';
import GlobalLoading from '@/components/common/GlobalLoading.vue';

const app = createApp(App);
app.component('GlobalLoading', GlobalLoading);
setupApiClient();
```

### 2. Migrar Servicios Uno por Uno

#### Antes (Cliente Actual):

```typescript
// src/services/user/api.ts
import ApiClient from '@/services/AxiosClient';

async function loginAuth(input: LoginAuthInputShape): Promise<LoginAuthOutputShape> {
  const url = '/login/';
  return ApiClient.post<LoginAuthInputShape, LoginAuthOutputShape>(url, input);
}
```

#### Después (Nuevo Cliente):

```typescript
// src/services/user/api.ts
import { api } from '@/services/api';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

async function loginAuth(input: LoginAuthInputShape): Promise<LoginAuthOutputShape> {
  LoginSchema.parse(input);

  const response = await api.post<LoginAuthOutputShape>('/login/', input, {
    validateData: true,
    timeout: 10000,
  });

  return response.data;
}
```

### 3. Migrar Componentes

#### Antes:

```vue
<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { loginAuth } from '@/services/user/api';

  const loading = ref(false);
  const error = ref(null);

  const handleLogin = async (credentials) => {
    loading.value = true;
    try {
      const result = await loginAuth(credentials);
      // manejar éxito
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };
</script>
```

#### Después:

```vue
<script setup lang="ts">
  import { useAuth } from '@/composables/api/useAuth';

  const { login, loading, error } = useAuth();

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
    } catch (err) {}
  };
</script>
```

## 🔧 Herramientas de Migración

### Script de Migración Automática

```typescript
// scripts/migrate-api.ts
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

const files = glob.sync('src/**/*.{ts,vue}');

files.forEach(file => {
  let content = readFileSync(file, 'utf8');

  content = content.replace(
    /import ApiClient from '@/services\/AxiosClient';/g,
    "import { api } from '@/services/api';"
  );

  content = content.replace(
    /ApiClient\.(get|post|put|patch|delete)/g,
    'api.$1'
  );

  writeFileSync(file, content);
});
```

### Verificador de Migración

```typescript
// scripts/verify-migration.ts
import { glob } from 'glob';

const checkMigration = () => {
  const files = glob.sync('src/**/*.{ts,vue}');
  const issues = [];

  files.forEach((file) => {
    const content = readFileSync(file, 'utf8');

    if (content.includes('@/services/AxiosClient')) {
      issues.push(`${file}: Import del cliente anterior encontrado`);
    }

    if (content.includes('ApiClient.')) {
      issues.push(`${file}: Llamada al cliente anterior encontrada`);
    }
  });

  if (issues.length > 0) {
    console.log('❌ Problemas de migración encontrados:');
    issues.forEach((issue) => console.log(`  - ${issue}`));
  } else {
    console.log('✅ Migración completada correctamente');
  }
};
```

## 📊 Checklist de Migración

### Servicios

- [ ] `src/services/user/api.ts`
- [ ] `src/services/auth.ts`
- [ ] Otros servicios...

### Componentes

- [ ] `src/views/login/LoginView.vue`
- [ ] `src/views/home/HomeView.vue`
- [ ] Otros componentes...

### Stores

- [ ] `src/stores/user/AuthStore.ts`
- [ ] Otros stores...

### Tests

- [ ] Actualizar tests existentes
- [ ] Agregar tests para nueva arquitectura

## 🚨 Consideraciones Importantes

### 1. Compatibilidad Temporal

```typescript
export { default as LegacyApiClient } from './AxiosClient';
export { api as NewApiClient } from './api';
```

### 2. Variables de Entorno

```env
# .env
VITE_API_URL=https://api.tu-app.com
VITE_APP_TIMEOUT=30000
VITE_CACHE_TTL=300000
```

### 3. Configuración de Desarrollo

```typescript
// vite.config.ts
export default defineConfig({
  define: {
    __API_CONFIG__: JSON.stringify({
      baseURL: process.env.VITE_API_URL,
      timeout: process.env.VITE_APP_TIMEOUT,
    }),
  },
});
```

## 🎯 Beneficios Post-Migración

### Performance

- ⚡ Caché inteligente reduce requests duplicados
- 🔄 Refresh automático de tokens
- 📊 Loading states optimizados

### Developer Experience

- 🧩 Composables reutilizables
- 🔍 Mejor debugging y logging
- 📝 TypeScript mejorado

### User Experience

- 🎨 Indicadores visuales de progreso
- 🚨 Manejo de errores mejorado
- ⚡ Respuesta más rápida

## 🔍 Testing Post-Migración

### Tests de Regresión

```typescript
describe('API Migration Regression Tests', () => {
  it('should maintain existing functionality', async () => {});
});
```

### Tests de Performance

```typescript
describe('API Performance Tests', () => {
  it('should cache requests appropriately', async () => {});
});
```

## 📈 Monitoreo Post-Migración

### Métricas a Monitorear

- Tiempo de respuesta de API
- Tasa de errores
- Uso de caché
- Performance de loading states

### Herramientas de Monitoreo

```typescript
api.axiosInstance.interceptors.response.use((response) => {
  console.log('API Response Time:', response.config.metadata?.endTime - response.config.metadata?.startTime);
  return response;
});
```

---

## 🎉 Conclusión

Esta migración te permitirá aprovechar todas las ventajas de la nueva arquitectura API mientras mantienes la estabilidad de tu aplicación. La migración gradual minimiza los riesgos y permite probar cada cambio individualmente.

¿Necesitas ayuda con algún paso específico de la migración?
