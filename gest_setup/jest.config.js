module.exports = {
  setupTestFrameworkScriptFile: './jest/browser.js',
  globals: { // available in all tests
    browser: null,
    page: null
  }
}
