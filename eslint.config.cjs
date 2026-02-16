const js = require("@eslint/js");
const globals = require("globals");

const cypressPlugin = require("eslint-plugin-cypress");

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.node },
      ecmaVersion: 2022,
      sourceType: "module",
    },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  // Cypress E2E config para flat config
  {
    files: ["./e2e/**/*.cy.js"],
    plugins: { cypress: cypressPlugin },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.mocha,
        cy: true,
        Cypress: true,
        expect: true,
        assert: true,
        before: true,
        after: true,
        beforeEach: true,
        afterEach: true,
        describe: true,
        it: true,
        context: true,
        specify: true,
        window: true,
        document: true,
      },
    },
    rules: {
      ...cypressPlugin.configs.recommended.rules,
    },
  },
];
