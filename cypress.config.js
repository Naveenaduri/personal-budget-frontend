const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: "http://192.241.151.154:3000",
    supportFile: false,
  },

  integration: {
    baseUrl: "http://192.241.151.154:3000",
    // Additional integration-specific configuration
  },

  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
  },
});
