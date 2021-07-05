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
        "workbenck-foreground": "var(--vscode-foreground)",
        "editor-foreground": "var(--vscode-editor-foreground)",

        "button-foreground": "var(--vscode-button-foreground)",
        "button-background": "var(--vscode-button-background)",
        "button-hover-background": "var(--vscode-button-hoverBackground)",

        "action-hover-background": "var(--action-hover-background)",

        "keybinding-label-background": "var(--keybinding-label-background)",
        "keybinding-label-foreground": "var(--keybinding-label-foreground)",
        "keybinding-label-border": "var(--keybinding-label-border)",
        "keybinding-label-bottom-border": "var(--keybinding-label-bottom-border)"
      },
      spacing: {
        "2sp": "0.125rem",
        "3sp": "0.1875rem",
        "5sp": "0.3125rem",
        "22sp": "1.375rem"
      },
      borderRadius: {
        "3sp": "0.1875rem",
        "5sp": "0.3125rem"
      },
      outline: {
        blue: ["1px solid var(--vscode-focusBorder)", "-1px"],
        button: ["1px solid var(--vscode-focusBorder)", "2px"],
      },
      boxShadow: {
        'keybinding-label': 'inset 0 -1px 0 var(--keybinding-label-shadow)',
      },
      fontSize: {
        "11sp": "0.6875rem"
      },
      fontFamily: {
        vscode: "var(--vscode-font-family)"
      },
      lineHeight: {
        "10sp": "0.625rem"
      }
    }
  },
  variants: {
    margin: ["responsive", "first", "last"],
    width: ["responsive"],
    outline: ["responsive", "focus-within", "focus", "active"],
  },
  plugins: []
}
