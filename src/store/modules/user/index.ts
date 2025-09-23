import { defineStore } from 'pinia';
import { getUserInfo } from '@/api/user';
import {
  loginByAccount,
  loginByEmail,
  loginByMobile,
  RegisterData,
  logout as userLogout,
  register as userRegister,
} from '@/api/auth';
import { setToken, clearToken } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import { UserState } from './types';
import useAppStore from '../app';

const useUserStore = defineStore('user', {
  state: (): UserState => ({
    id: '',
    name: undefined,
    mobile: '',
    mobile_verified: false,
    email: undefined,
    email_verified: false,
    nickname: undefined,
    avatar: undefined,
    introduction: undefined,
    role: '',
    identity_verified: false,
    google_auth_enabled: false,
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  actions: {
    switchRoles() {
      return new Promise((resolve) => {
        this.role = this.role === 'user' ? 'admin' : 'user';
        resolve(this.role);
      });
    },
    // Set user's information
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    // Get user's information
    async info() {
      const res = await getUserInfo();

      this.setInfo(res.data);
    },

    // Login
    async login(loginForm: any, type: string) {
      try {
        if (type === 'account') {
          const res = await loginByAccount(loginForm);
          setToken(res.data.token);
        } else if (type === 'mobile') {
          const res = await loginByMobile(loginForm);
          setToken(res.data.token);
        } else if (type === 'email') {
          const res = await loginByEmail(loginForm);
          setToken(res.data.token);
        }
      } catch (err) {
        clearToken();
        throw err;
      }
    },
    // Register
    async register(registerForm: RegisterData) {
      try {
        const { data } = await userRegister(registerForm);
        setToken(data.token);
      } catch (err) {
        clearToken();
        throw err;
      }
    },
    logoutCallBack() {
      const appStore = useAppStore();
      this.resetInfo();
      clearToken();
      removeRouteListener();
      appStore.clearServerMenu();
    },
    // Logout
    async logout() {
      try {
        await userLogout();
      } finally {
        this.logoutCallBack();
      }
    },
  },
});

export default useUserStore;
