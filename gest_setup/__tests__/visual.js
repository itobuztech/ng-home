require('dotenv').config()
const { record, replay, assertVisual, screenshotDomElm } = require('../jest/utils')
const devices = require('puppeteer/DeviceDescriptors')


describe("Desktop", async () => {

  it("----- starts network capture ---- ", async () => {
    await page.setRequestInterception(true)
    page.on('request', replay)
    page.on('response', record)
  })

  it("Landing Page", async () => {
    await page.goto(process.env.HOSTURL, {waitUntil: "networkidle0"})
    const screenshot = await screenshotDomElm({
        selector: '#sfdiv > div',
        padding: 0
    });
    expect(screenshot).toMatchImageSnapshot()
  })

})
