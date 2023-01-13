/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.vue'],
  theme: {
    screens: {
      xs: '384px',
      ...defaultTheme.screens
    },
    extend: {
      colors: {
        foreground: 'var(--vscode-foreground)',
        'focus-border': 'var(--vscode-focusBorder)',
        'editor-foreground': 'var(--vscode-editor-foreground)',

        'input-placeholder-foreground':
          'var(--vscode-input-placeholderForeground)',
        'input-background': 'var(--vscode-input-background)',
        'input-foreground': 'var(--vscode-input-foreground)',

        'fieldset-border': 'var(--fieldset-border)',
        'fieldset-title-foreground': 'var(--vscode-sideBarTitle-foreground)',

        'button-foreground': 'var(--vscode-button-foreground)',
        'button-background': 'var(--vscode-button-background)',
        'button-hover-background': 'var(--vscode-button-hoverBackground)',

        'action-hover-background': 'var(--action-hover-background)',

        'keybinding-label-background': 'var(--keybinding-label-background)',
        'keybinding-label-foreground': 'var(--keybinding-label-foreground)',
        'keybinding-label-border': 'var(--keybinding-label-border)',
        'keybinding-label-bottom-border':
          'var(--keybinding-label-bottom-border)'
      },
      spacing: {
        '2sp': '0.125rem',
        '3sp': '0.1875rem',
        '5sp': '0.3125rem',
        '6sp': '0.375rem',
        '10sp': '0.625rem',
        '22sp': '1.375rem'
      },
      borderRadius: {
        '3sp': '0.1875rem',
        '5sp': '0.3125rem'
      },
      outline: {
        blue: ['1px solid var(--vscode-focusBorder)', '-1px'],
        button: ['1px solid var(--vscode-focusBorder)', '2px']
      },
      boxShadow: {
        'keybinding-label': 'inset 0 -1px 0 var(--keybinding-label-shadow)'
      },
      fontSize: {
        '11sp': '0.6875rem',
        '13sp': ['0.8125rem', { lineHeight: '1.1375rem' }]
      },
      fontFamily: {
        vscode: 'var(--vscode-font-family)'
      },
      lineHeight: {
        '10sp': '0.625rem'
      },
      opacity: {
        38: '0.38'
      }
    }
  },
  plugins: []
};
