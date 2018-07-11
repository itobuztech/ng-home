require('dotenv').config()
const { record, replay, assertVisual, screenshotDomElm } = require('../jest/utils')
const devices = require('puppeteer/DeviceDescriptors')


async function waitForNetworkIdle(page) {
  const timeoutError = new Error('Timeout while waiting for network idle');

  await new Promise((resolve, reject) => {
      let listener = (event) => {
          if (event.name == 'networkAlmostIdle') {
              page._client.removeListener('Page.lifecycleEvent', listener);
              resolve();
          }
      };

      page._client.on('Page.lifecycleEvent', listener);

      setTimeout(() => {
          page._client.removeListener('Page.lifecycleEvent', listener);
          reject(timeoutError);
      }, 30000);
  });
}

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
