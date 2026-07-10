import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import i18n from "./i18n";
import axios from "axios";
import { createAuthPlugin } from "@jtekt/vuetify-auth";

axios.defaults.baseURL = import.meta.env.VITE_WHEREABOUTS_API_URL;

const auth = createAuthPlugin(
  {
    oidc: {
      clientId: import.meta.env.VITE_OIDC_CLIENT_ID,
      authority: import.meta.env.VITE_OIDC_AUTHORITY,
      enrichmentEndpoint: import.meta.env.VITE_AUTH_IDENTIFICATION_URL,
      identifierLookupField: import.meta.env.VITE_AUTH_ENRICMENT_ID_FIELD,
    },
    credentials: {
      loginEndpoint: import.meta.env.VITE_LOGIN_URL,
      resetPasswordEndpoint: import.meta.env.VITE_PASSWORD_RESET_URL,
      identifierLookupField: import.meta.env.VITE_AUTH_ENRICMENT_ID_FIELD,
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
