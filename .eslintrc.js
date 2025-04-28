module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-native/all",
    "plugin:prettier/recommended", // integra prettier
  ],
  plugins: ["react", "react-native", "prettier"],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    "react-native/react-native": true,
  },
  rules: {
    "prettier/prettier": ["error"], // Prettier manda
    "react/prop-types": "off",
    "react-native/no-inline-styles": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
