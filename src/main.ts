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
    strategies: {
      ...(runtimeEnv.VITE_OIDC_AUTHORITY &&
        runtimeEnv.VITE_OIDC_CLIENT_ID && {
          oidc: {
            clientId: runtimeEnv.VITE_OIDC_CLIENT_ID,
            authority: runtimeEnv.VITE_OIDC_AUTHORITY,
            enrichment: {
              endpoint: runtimeEnv.VITE_AUTH_IDENTIFICATION_URL,
            },
            identity: {
              source: "enrichment",
              identifierLookupField:
                runtimeEnv.VITE_AUTH_ENRICMENT_ID_FIELD || "_id",
            },
          },
        }),
      credentials: {
        loginEndpoint: runtimeEnv.VITE_LOGIN_URL,
        identity: {
          identifierLookupField: runtimeEnv.VITE_AUTH_ENRICMENT_ID_FIELD || "_id",
        },
      },
    },
    onAuthError: (error) => console.error("[Auth]", error),
    onSessionChange(session) {
      if (!session) {
        console.log("[SESSION] no session");
        delete axios.defaults.headers.common["Authorization"];
        return;
      }

      const token = session.accessToken;

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } else {
        delete axios.defaults.headers.common["Authorization"];
      }
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
