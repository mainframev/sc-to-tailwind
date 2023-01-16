module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    "airbnb-base",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:tailwindcss/recommended",
  ],
  plugins: ["@typescript-eslint"],
  rules: {
    "no-param-reassign": "off",
    "no-underscore-dangle": "off",
    "import/prefer-default-export": "off",
    "no-console": "off",
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
  },
  overrides: [
    {
      files: [
        "jest.config.ts",
        "src/__tests__/**/*.{js,jsx,ts,tsx}",
        "src/__testfixtures__/**/*.{js,jsx,ts,tsx}",
      ],
      rules: {
        "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
      },
    },
  ],
  env: {
    node: true,
    jest: true,
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
};
