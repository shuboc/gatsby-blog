module.exports = {
  extends: ["react-app"],
  globals: {
    __PATH_PREFIX__: true,
  },
  rules: {
    // Warn on accessibility issues rather than erroring
    "jsx-a11y/anchor-is-valid": "warn",
  },
}
