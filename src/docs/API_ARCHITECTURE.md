# 🚀 Enhanced API Architecture - Complete Guide

## 📋 Table of Contents

- [Introduction](#introduction)
- [Main Features](#main-features)
- [Installation and Configuration](#installation-and-configuration)
- [Basic Usage](#basic-usage)
- [Composables](#composables)
- [Error Handling](#error-handling)
- [Cache and Performance](#cache-and-performance)
- [Testing](#testing)
- [Best Practices](#best-practices)

## 🎯 Introduction

This API architecture provides a complete and scalable solution for handling all backend communications in Vue 3 applications, including:

- ✅ Automatic Bearer token management
- ✅ Interceptors for logging and errors
- ✅ FormData for file uploads
- ✅ Reactive states with Pinia
- ✅ Reusable composables
- ✅ Centralized error handling
- ✅ Extended timeout for large files

## 🏗️ Main Features

### 🔐 Advanced Security

- **SessionStorage** as primary storage (safer than localStorage)
- **Automatic refresh token** with concurrency handling
- **CSRF protection** integrated
- **Data validation** with Zod schemas

### ⚡ Optimized Performance

- **Intelligent caching system** with TTL
- **Granular and global loading states**
- **Debouncing** in searches
- **Automatic pagination**

### 🎨 Excellent UX/UI

- **Visual progress indicators**
- **Reactive loading states**
- **User-friendly error handling**

## 🚀 Installation and Configuration

### 1. Install Dependencies

```bash
npm install zod
```

### 2. Configure in main.ts

```typescript
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { setupApiClient } from '@/services/api';
import GlobalLoading from '@/components/shared/global-loading/GlobalLoading.vue';
import App from './App.vue';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.component('GlobalLoading', GlobalLoading);

// Configure API client
setupApiClient();

app.mount('#app');
```

### 3. Environment Variables

```env
VITE_API_URL=https://api.your-app.com
VITE_APP_TIMEOUT=30000
VITE_CACHE_TTL=300000
```

## 📖 Basic Usage

### Direct API Client

```typescript
import { api } from '@/services/api';

// GET request
const users = await api.get('/users');

// POST request
const newUser = await api.post('/users', {
  name: 'John Doe',
  email: 'john@example.com',
});

// File upload
const file = new File(['content'], 'test.txt');
const result = await api.uploadFile('/upload', file);
```

### With Composables (Recommended)

```typescript
import { useApi, useApiPost } from '@/composables/useApi';

// GET with reactivity
const { data, loading, error, execute } = useApi('/users', {
  immediate: true,
  cache: true,
});

// POST with validation
const { execute: createUser } = useApiPost('/users', {
  validateData: true,
  onSuccess: (data) => console.log('User created:', data),
});

await createUser({ name: 'John', email: 'john@example.com' });
```

## 🧩 Composables

### useApi - Basic Requests

```typescript
const { data, loading, error, execute, reset } = useApi('/endpoint', {
  immediate: true, // Execute immediately
  cache: true, // Use cache
  timeout: 10000, // Custom timeout
  onSuccess: (data) => console.log(data),
  onError: (error) => console.error(error),
  transform: (data) => data.items, // Transform response
});
```

### useApiMutation - POST/PUT/PATCH/DELETE

```typescript
const { data, loading, error, mutate } = useApiMutation({
  validateData: true,
  onSuccess: (data) => console.log('Success:', data),
});

// Usage
await mutate('/users', userData, 'POST');
await mutate('/users/1', userData, 'PUT');
await mutate('/users/1', undefined, 'DELETE');
```

### useApiPagination - Automatic Pagination

```typescript
const { items, currentPage, totalPages, hasNext, hasPrev, nextPage, prevPage, goToPage } = useApiPagination('/users', {
  pageSize: 20,
  initialPage: 1,
  cache: true,
});
```

### useFileUpload - File Upload

```typescript
const { data, loading, error, progress, upload } = useFileUpload('/upload', {
  onSuccess: (data) => console.log('File uploaded:', data),
});

// Simple upload
await upload(file);

// Upload with additional data
await upload(file, { category: 'documents' });
```

## 🚨 Error Handling

### Automatic ErrorManager

```typescript
import { ErrorManager } from '@/services/api';

const errorManager = ErrorManager.getInstance();

// Register custom handlers
errorManager.registerHandler('status_401', (error) => {
  // Handle expired token
  router.push('/login');
});

errorManager.registerHandler('VALIDATION_ERROR', (error) => {
  // Show validation errors
  showValidationErrors(error.details.errors);
});
```

### In Composables

```typescript
const { data, error } = useApi('/endpoint', {
  onError: (error) => {
    if (error.code === 'VALIDATION_ERROR') {
      // Handle validation errors
    } else if (error.status === 401) {
      // Redirect to login
    }
  },
});
```

## 💾 Cache and Performance

### Cache Configuration

```typescript
import { CacheManager } from '@/services/api';

const cacheManager = CacheManager.getInstance();

// Invalidate cache by pattern
cacheManager.invalidatePattern('/users/*');

// Clear all cache
cacheManager.clear();

// Get statistics
const stats = cacheManager.getStats();
console.log('Items in cache:', stats.size);
```

### Automatic Optimizations

- **Default TTL**: 5 minutes
- **Automatic cleanup**: Every 5 minutes
- **Smart invalidation**: By patterns
- **Cache only for GET**: Safe requests

## 🧪 Testing

### Testing Composables

```typescript
import { renderHook, waitFor } from '@testing-library/vue';
import { useApi } from '@/composables/useApi';

test('useApi should fetch data', async () => {
  const { result } = renderHook(() => useApi('/test'));

  await waitFor(() => {
    expect(result.current.data.value).toBeDefined();
  });
});
```

### Testing API Client

```typescript
import EnhancedApiClient from '@/services/api/EnhancedApiClient';

test('should handle errors gracefully', async () => {
  const client = EnhancedApiClient.getInstance();

  try {
    await client.get('/error-endpoint');
  } catch (error) {
    expect(error).toBeDefined();
  }
});
```

## 🎯 Best Practices

### 1. Use Composables by Domain

```typescript
// ✅ GOOD: One composable per functionality
const { users, create, update } = useUsers();
const { upload, progress } = useFileUpload('/upload');

// ❌ BAD: Multiple composables for the same thing
const api1 = useApi('/users');
const api2 = useApi('/users');
```

### 2. Configure Validations

```typescript
// Register validation schemas
const validationManager = ValidationManager.getInstance();
validationManager.registerSchema('user', UserSchema);

// Use in requests
const { execute } = useApiPost('/users', {
  validateData: true, // Uses registered schema
});
```

### 3. Handle Loading States

```typescript
// Global loading for critical operations
const { execute } = useApiPost('/critical-operation', {
  showGlobalLoading: true,
});

// Granular loading for normal operations
const { loading } = useApi('/normal-operation');
```

### 4. Configure Appropriate Timeouts

```typescript
// Short timeout for fast requests
const { execute } = useApi('/quick-endpoint', {
  timeout: 5000,
});

// Long timeout for uploads
const { upload } = useFileUpload('/upload', {
  timeout: 300000, // 5 minutes
});
```

## 🔧 Advanced Configuration

### Custom Interceptors

```typescript
import { api } from '@/services/api';

// Add custom interceptor
api.axiosInstance.interceptors.request.use((config) => {
  // Custom logic
  return config;
});
```

### Custom Error Handlers

```typescript
import { ErrorManager } from '@/services/api';

const errorManager = ErrorManager.getInstance();

// Handler for app-specific errors
errorManager.registerHandler('CUSTOM_ERROR', (error) => {
  // Custom logic
});
```

## 📊 Monitoring and Debugging

### Structured Logs

```typescript
// Errors are automatically logged with:
// - Timestamp
// - Context
// - Error details
// - Stack trace
```

### Cache Statistics

```typescript
const stats = cacheManager.getStats();
console.log('Cache:', stats);
```

### Loading States

```typescript
const loadingStore = useLoadingStore();
console.log('Global loading:', loadingStore.isGlobalLoading);
console.log('Active requests:', loadingStore.loadingRequests);
```

---

## 🎉 Conclusion

This architecture provides a solid, scalable, and maintainable foundation for all API needs in your Vue application. With advanced security features, optimized performance, and excellent user experience, you're ready to build robust and professional applications.

Need help with any specific implementation? Don't hesitate to ask!
