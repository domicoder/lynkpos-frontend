import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createWebHistory, type Router } from 'vue-router';
import HomeView from '@/views/home/HomeView.vue';
import useAuthStore from '@/stores/user/AuthStore';
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
    expect(wrapper.text()).toContain('home.title');
  });

  it('displays logout button', () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, router],
      },
    });

    const logoutButton = wrapper.find('button');

    expect(logoutButton.exists()).toBe(true);
    expect(logoutButton.text()).toContain('general.logout');
  });

  it('calls logout function when button is clicked', async () => {
    const wrapper = mount(HomeView, {
      global: {
        plugins: [pinia, router],
      },
    });

    const authStore = useAuthStore();
    const setUserSpy = vi.spyOn(authStore, 'setUser');

    const logoutButton = wrapper.find('button');

    await logoutButton.trigger('click');

    expect(setUserSpy).toHaveBeenCalledWith(null);
    expect(mockPush).toHaveBeenCalledWith({ name: 'Login' });
  });
});
