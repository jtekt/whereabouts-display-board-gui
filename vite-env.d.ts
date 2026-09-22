/// <reference types="vite/client" />

interface Window {
  __ENV__?: Record<string, string>;
}

interface ImportMetaEnv {
  readonly VITE_APP_VERSION: string
  readonly VITE_APPS_URL: string
  readonly VITE_WHEREABOUTS_API_URL: string
  readonly VITE_GROUP_MANAGER_API_URL: string
  readonly VITE_AUTH_IDENTIFICATION_URL: string
  readonly VITE_AUTH_ENRICMENT_ID_FIELD: string
  readonly VITE_LOGIN_URL: string
  readonly VITE_PASSWORD_RESET_URL: string
  readonly VITE_OIDC_AUTHORITY: string
  readonly VITE_OIDC_CLIENT_ID: string
  readonly VITE_I18N_LOCALE: string
  readonly VITE_I18N_FALLBACK_LOCALE: string
  readonly VITE_EMPLOYEE_MANAGER_FRONT_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
