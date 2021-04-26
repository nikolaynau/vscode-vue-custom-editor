const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: false,
  darkMode: false,
  theme: {
    screens: {
      xs: "384px",
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        "focus-border": "var(--vscode-focusBorder)",
        "button-foreground": "var(--vscode-button-foreground)",
        "button-background": "var(--vscode-button-background)",
        "button-hover-background": "var(--vscode-button-hoverBackground)",
      },
      outline: {
        blue: ["1px solid var(--vscode-focusBorder)", "-1px"],
        button: ["1px solid var(--vscode-focusBorder)", "2px"],
      },
      fontFamily: {
        vscode: "var(--vscode-font-family)"
      }
    }
  },
  variants: {
    margin: ["responsive", "first"],
    width: ["responsive"],
    outline: ["responsive", "focus-within", "focus", "active"],
  },
  plugins: []
}
