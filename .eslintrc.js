module.exports = {
  root: true,
  parserOptions: {
    parser: "@typescript-eslint/parser",
    //project: "./tsconfig.json"
  },
  extends: [
    "@nuxtjs",
    "plugin:@typescript-eslint/recommended",
    "plugin:nuxt/recommended",
    "plugin:prettier/recommended",
	  "prettier/@typescript-eslint",
    "prettier/babel",
    "prettier/standard",
    "prettier/unicorn",
    "prettier/vue",
  ],
  rules: {
    "no-console": "off",
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-function-return-type": "off"
  }
}
