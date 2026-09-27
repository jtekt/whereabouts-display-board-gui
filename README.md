# 行先掲示板 GUI

[![AWS ECR](https://img.shields.io/badge/AWS%20ECR-whereabouts--display--board--gui-blue)](https://gallery.ecr.aws/jtekt-corporation/whereabouts-display-board-gui)

This is the GUI for 行先掲示板 (`whereabouts-api`), a web application to display the whereabouts of team members. Updates are received in real time over WebSocket (Socket.IO).

## Environment variables

### Services

| Variable | Description |
| --- | --- |
| `VITE_WHEREABOUTS_API_URL` | Base URL of the 行先掲示板 API, also used for the WebSocket connection |
| `VITE_GROUP_MANAGER_API_URL` | Base URL of the group management API |
| `VITE_EMPLOYEE_MANAGER_FRONT_URL` | URL of the user manager GUI, used for group links |

### Authentication

Both OIDC and username/password login can be configured at the same time; the login page then offers both.

| Variable | Description |
| --- | --- |
| `VITE_OIDC_AUTHORITY` | OIDC provider issuer URL (e.g. `https://keycloak.jtektrnd.net/realms/jtekt`) |
| `VITE_OIDC_CLIENT_ID` | Client ID registered in the OIDC provider |
| `VITE_LOGIN_URL` | User manager endpoint for username/password login (e.g. `…/v3/auth/login`) |
| `VITE_PASSWORD_RESET_URL` | URL of the password reset page offered on the login page |
| `VITE_AUTH_IDENTIFICATION_URL` | Endpoint called after login to fetch the full user profile (e.g. `…/v3/users/self`) |
| `VITE_AUTH_ENRICMENT_ID_FIELD` | User field used to look the user up in that endpoint (e.g. `_id`) |

Note the spelling of `VITE_AUTH_ENRICMENT_ID_FIELD` (without an H), unlike the other GUIs.

### Common

These variables are shared by all the corporate-apps GUIs.

| Variable | Description |
| --- | --- |
| `VITE_I18N_LOCALE` | Default UI language (`ja` or `en`), used until the user picks one |
| `VITE_I18N_FALLBACK_LOCALE` | Language used for missing translations |
| `VITE_APPS_URL` | URL of the apps portal; shows an apps button in the app bar when set |
| `VITE_HELP_URL` | URL of the help page; shows a help button in the app bar when set |

## Runtime configuration

The variables above are read at runtime, not baked into the build: at container startup, `40-env-config.sh` writes every `VITE_*` environment variable to `/env.js`, which `src/runtimeEnv.ts` merges over the build-time values. The same image can therefore be configured per deployment through the Kubernetes manifest.

In development, values come from `.env` (i18n defaults) and `.env.development` (local URLs).

The version shown on the About page is the git tag, passed at build time (`--build-arg APP_VERSION`); it cannot be changed at runtime.

## Development

```
npm install
npm run dev
```

`npm run build` type-checks and builds for production.
