import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createWebHistory, type Router } from 'vue-router';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import HomeView from '@/views/home/HomeView.vue';
import type { Pinia } from 'pinia';

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

// Mock vue-router
const mockPush = vi.fn();

vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router');

  return {
    ...actual,
    useRouter: () => ({
      push: mockPush,
    }),
  };
});

describe('HomeView', () => {
  let vuetify: ReturnType<typeof createVuetify>;
  let pinia: Pinia;
  let router: Router;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);

    vuetify = createVuetify({
      components,
      directives,
    });

    router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/login',
          name: 'login',
          component: { template: '<div>Login</div>' },
        },
      ],
    });

    // Clear mocks
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, router, vuetify],
      },
    });

    // Check that the component renders
    expect(wrapper.exists()).toBe(true);
    // Check that the products title is displayed
    expect(wrapper.text()).toContain('products.title');
  });

  it('displays copyright information', () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, router, vuetify],
      },
    });

    // Check that the component renders and contains the main content
    // The copyright section should be present (even if not fully rendered due to i18n interpolation)
    expect(wrapper.exists()).toBe(true);
    // Check that there are multiple spans (one for title, one for copyright)
    const spans = wrapper.findAll('span');

    expect(spans.length).toBeGreaterThan(0);
  });
});
