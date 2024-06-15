import {User} from '../types';
import {create} from 'zustand';
import localStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../utils';

type AuthState = {
  isUserLoading: boolean;
  user?: Partial<User>;
  setUser: (user: Partial<User>) => Promise<void>;
  setToken: (token: string) => Promise<void>;
  logout: () => void;
  getUser: () => Promise<void>;
};

const useAuth = create<AuthState>(set => ({
  isUserLoading: true,
  user: undefined,
  setUser: async (user: Partial<User>) => {
    set({user: {...user}});
  },
  async setToken(accessToken) {
    await localStorage.setItem('accessToken', accessToken);
  },
  async logout() {
    set({user: undefined});
    await localStorage.removeItem('accessToken');
  },
  getUser: async () => {
    try {
      const accessToken = await localStorage.getItem('accessToken');
      if (!accessToken) {
        set({user: undefined, isUserLoading: false});
        return;
      }
      const res = await fetch(`${BASE_URL}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + accessToken,
        },
      });

      if (res?.status === 401) {
        await localStorage.removeItem('accessToken');
        set({user: undefined, isUserLoading: false});
      }

      if (res?.status === 200) {
        const data = await res.json();
        const userData = data?.data;
        set({user: {...userData}, isUserLoading: false});
      }
    } catch (error) {
      set({user: {}});
    }
  },
}));
export default useAuth;
