module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2021,
    sourceType: "module",
  },
  plugins: ["react", "jsx-a11y", "prettier"],
  rules: {
    // Add specific ESLint rules here
    // Example: "react/prop-types": "off" to disable prop-types rule
    //         "react/react-in-jsx-scope": "off" to disable react-in-jsx-scope rule
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
