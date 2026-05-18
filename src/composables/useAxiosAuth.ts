import axios from "axios";
import { watch } from "vue";
import { useAuth } from "@jtekt/vuetify-auth";

export function useAxiosAuth() {
  const { session, logout } = useAuth();

  watch(
    () => session.value?.accessToken,
    async (token: string | undefined) => {
      delete axios.defaults.headers.common["Authorization"];

      // Check expiration
      const expiresAt = session.value?.expiresAt;

      if (expiresAt && Date.now() >= expiresAt * 1000) {
        await logout?.();
        return;
      }

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
    },
    { immediate: true },
  );

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error.response?.status;

      if (status === 401 || status === 403) {
        delete axios.defaults.headers.common["Authorization"];

        await logout?.();
      }

      return Promise.reject(error);
    },
  );
}
