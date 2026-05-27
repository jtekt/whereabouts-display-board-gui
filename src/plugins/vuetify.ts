import "vuetify/styles";
import { createVuetify } from "vuetify";
import "@mdi/font/css/materialdesignicons.css";

export default createVuetify({
  defaults: {
    VSwitch: {
      color: "primary",
    },
    VTextField: {
      variant: "underlined",
    },
    VSelect: {
      variant: "outlined",
    },
  },
  theme: {
    defaultTheme: localStorage.getItem("theme") || "light",
    themes: {
      light: {
        colors: {
          primary: "#b00000",
          background: "#f5f5f5",
        },
      },
      dark: {
        colors: {
          primary: "#e04444",
        },
      },
    },
  },
});
