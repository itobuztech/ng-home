require('jest-preset-angular');
require('dotenv').config()
const puppeteer = require('puppeteer')
const { toMatchImageSnapshot } = require('jest-image-snapshot')

beforeAll(async () => {
  jest.setTimeout(2400000); // 40mn by test
  expect.extend({ toMatchImageSnapshot })

  browser = await puppeteer.launch(
    parseInt(process.env.DEBUG)
      ? {
          headless: false,
          slowMo: 10,
          timeout: 10000
        }
      : { args: ['--no-sandbox','--disable-setuid-sandbox'] }
  )

  page = await browser.newPage()

  await page.setViewport({ width: 1280, height: 600 })

});

afterAll(async () => {
  await browser.close();
})
