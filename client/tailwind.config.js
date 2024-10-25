import theme from "daisyui/src/theming/themes"

module.exports = {
  content: ["./src/**/*.{html,js,css,ts}"], // .ts uzantısını ekledim
  theme: {
    extend: {
      fontSize: {
        xs: "11px",
        sm: "13px",
        base: "15px",
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        md: "3rem",
        lg: "4rem",
        xl: "5rem",
        '2xl': "6rem",
      },
    },
    fontFamily: {
      body: ["DM Sans", "sans-serif"],
    },
  },
  darkMode: "class",
  daisyui: {
    themes: [{
        light: {
          ...theme["[data-theme=light]"],

          primary: "#3e5eff",
          "primary-content": "#ffffff",
          secondary: "#494949",
          "secondary-content": "#ffffff",
          info: "#00a6ff",
          "info-content": "#ffffff",
          success: "#28a745",
          "success-content": "#ffffff",
          warning: "#f5a524",
          "warning-content": "#150a00",
          error: "#f3124e",
          "error-content": "#ffffff",

          "base-100": "#f5f5f5", // Kırık beyaz arka plan
          "base-200": "#e6e9ec",
          "base-300": "#dfe2e6",
          "base-content": "#1e2328",

          "--rounded-box": "0.25rem",
          "--rounded-btn": "0.25rem",
          "--padding-card": "20px",

          "--main-content-background": "#f2f5f8",
          "--leftmenu-background": "#ffffff",
          "--topbar-background": "#ffffff",
        },
      },
      {
        dark: {
          ...theme["[data-theme=dark]"],

          primary: "#167bff",
          "primary-content": "#ffffff",
          secondary: "#494949",
          "secondary-content": "#ffffff",
          info: "#00e1ff",
          "info-content": "#ffffff",
          success: "#17c964",
          "success-content": "#ffffff",
          warning: "#f5a524",
          "warning-content": "#150a00",
          error: "#f31260",
          "error-content": "#ffffff",

          "base-100": "#0f0f0f", // Daha koyu siyah arka plan
          "base-200": "#1a1a1a",
          "base-300": "#252525",

          "base-content": "#dcebfa",
          "--rounded-box": "0.25rem",
          "--rounded-btn": "0.25rem",

          "--main-content-background": "#14181c",
          "--leftmenu-background": "#1e2328",
          "--topbar-background": "#191e23",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
}
