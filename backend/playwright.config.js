'use strict';

const { defineConfig } = require('@playwright/test');

module.exports=defineConfig({
  testDir:'./tests/e2e',
  testMatch:'**/*.spec.js',
  fullyParallel:false,
  reporter:'list',
  use:{
    baseURL:'http://127.0.0.1:4173',
    browserName:'chromium',
    viewport:{width:1440,height:1000},
    screenshot:'only-on-failure'
  },
  webServer:{
    command:'node ./tests/e2e/static-server.js',
    url:'http://127.0.0.1:4173',
    reuseExistingServer:!process.env.CI,
    timeout:10000
  }
});