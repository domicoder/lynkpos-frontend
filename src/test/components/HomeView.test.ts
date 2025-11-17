import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createWebHistory, type Router } from 'vue-router';
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
  let pinia: Pinia;
  let router: Router;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);

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
        plugins: [pinia, router],
      },
    });

    expect(wrapper.find('.home').exists()).toBe(true);
    expect(wrapper.text()).toContain('home.products');
  });

  it('displays logout button', () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, router],
      },
    });

    const homeDiv = wrapper.find('div');

    expect(homeDiv.exists()).toBe(true);
    expect(homeDiv.text()).toContain('home.products');
  });
});
