module.exports = {
  extends: ["@salesforce/eslint-config-lwc/recommended", "prettier"],
  plugins: ["prettier"],
  parserOptions: {
    ecmaVersion: 6,
  },
  rules: {
    /* Prefer === to == and !== to != */
    eqeqeq: "error",
    /* Prefer ; use, but only warn (prettier will fix) */
    semi: "warn",
    "no-console": "off",
    "no-debugger": "off",
    /* Warn when using blocking alert, prompt, etc, but allow */
    "no-alert": "warn",
    /* Warn when using an unnecessary } else { after a return */
    "no-else-return": "warn",
    /* Ignore variables not declared at top of scope */
    "vars-on-top": "off",
    "linebreak-style": "off",
    "no-return-assign": "warn",
    "no-shadow": "warn",
    "no-empty": ["error", { allowEmptyCatch: true }],
    "consistent-return": ["error", { treatUndefinedAsUnspecified: true }],
  },
  overrides: [
    {
      files: "*",
      rules: {
        "@lwc/lwc/no-async-operation": "off",
      },
    },
  ],
};
