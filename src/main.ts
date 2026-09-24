import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { i18n } from "./plugins/i18n";
import axios from "axios";
import { createAuthPlugin } from "@jtekt/vuetify-auth";
import runtimeEnv from "@/runtimeEnv";

axios.defaults.baseURL = runtimeEnv.VITE_WHEREABOUTS_API_URL;

const auth = createAuthPlugin(
  {
    oidc: {
      clientId: runtimeEnv.VITE_OIDC_CLIENT_ID,
      authority: runtimeEnv.VITE_OIDC_AUTHORITY,
      enrichmentEndpoint: runtimeEnv.VITE_AUTH_IDENTIFICATION_URL,
      identifierLookupField: runtimeEnv.VITE_AUTH_ENRICMENT_ID_FIELD,
    },
    credentials: {
      loginEndpoint: runtimeEnv.VITE_LOGIN_URL,
      resetPasswordEndpoint: runtimeEnv.VITE_PASSWORD_RESET_URL,
      identifierLookupField: runtimeEnv.VITE_AUTH_ENRICMENT_ID_FIELD,
    },
  },
  router,
);

const app = createApp(App);

app.use(vuetify);
app.use(auth);
app.use(router);
app.use(i18n);

app.mount("#app");
