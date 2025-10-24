# Testing Guide

Este proyecto utiliza **Vitest** para testing unitario y **Playwright** para testing E2E.

## 🧪 Testing Unitario con Vitest

### Comandos Disponibles

```bash
# Ejecutar todos los tests unitarios
pnpm test:unit

# Ejecutar tests con UI interactiva
pnpm test:unit:ui

# Ejecutar tests con coverage
pnpm test:unit:coverage

# Ejecutar tests en modo watch
pnpm test:unit --watch
```

### Estructura de Tests

```
src/test/
├── setup.ts              # Configuración global de tests
├── components/           # Tests de componentes Vue
│   └── HomeView.test.ts
├── stores/              # Tests de stores Pinia
│   └── AuthStore.test.ts
└── utils/               # Tests de utilidades
```

### Ejemplo de Test de Componente

```typescript
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import MyComponent from '@/components/MyComponent.vue';

describe('MyComponent', () => {
  it('renders correctly', () => {
    const wrapper = mount(MyComponent);
    expect(wrapper.find('.my-class').exists()).toBe(true);
  });
});
```

### Ejemplo de Test de Store

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import useMyStore from '@/stores/MyStore';

describe('MyStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize correctly', () => {
    const store = useMyStore();
    expect(store.count).toBe(0);
  });
});
```

## 🎭 Testing E2E con Playwright

### Comandos Disponibles

```bash
# Instalar Playwright
pnpm test-setup

# Ejecutar tests E2E
pnpm test

# Ejecutar tests y mostrar reporte
pnpm test:end

# Ejecutar tests en modo UI
pnpm test --ui
```

### Estructura de Tests E2E

```
tests/
├── example.spec.ts       # Ejemplo de test E2E
└── demo-todo-app.spec.ts # Demo de aplicación todo
```

## 🔧 Configuración

### Vitest (vite.config.ts)

```typescript
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: ['./src/test/setup.ts'],
}
```

### Playwright (playwright.config.ts)

```typescript
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
```

## 📊 Coverage

Para generar reportes de coverage:

```bash
pnpm test:unit:coverage
```

Esto generará un reporte HTML en `coverage/` que puedes abrir en tu navegador.

## 🚀 Mejores Prácticas

1. **Nombres descriptivos**: Usa nombres claros para tus tests
2. **Arrange-Act-Assert**: Estructura tus tests en 3 partes
3. **Mocks apropiados**: Mock solo lo necesario
4. **Tests aislados**: Cada test debe ser independiente
5. **Cobertura significativa**: Enfócate en lógica de negocio

## 🐛 Debugging

### Vitest

```bash
# Debug con console.log
pnpm test:unit --reporter=verbose

# Debug con breakpoints
pnpm test:unit --inspect-brk
```

### Playwright

```bash
# Debug con UI
pnpm test --ui

# Debug con trace
pnpm test --trace on
```

## 📝 Convenciones

- Archivos de test: `*.test.ts` o `*.spec.ts`
- Describe blocks: Nombre del componente/clase
- Test cases: Comportamiento específico
- Mocks: En archivos separados o inline según complejidad
