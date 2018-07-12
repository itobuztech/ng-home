const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')

let url = process.env.APIENDPOINT
const SNAPSHOTS_DIR = '__api_snapshots__'

let snapshotsDir = path.join(process.cwd(), '__tests__', SNAPSHOTS_DIR)

module.exports.replay = function replay(request) {
  if (request.resourceType() === 'xhr' && (request.method() === 'GET' ) && (request.url().indexOf(url) > -1 )){
    let snapshotIdentifier = request.url().split(url).pop().replace('/', '_')
    let baselineSnapshotPath = path.join(snapshotsDir, `${snapshotIdentifier}.json`)
    if(fs.existsSync(baselineSnapshotPath)){
      let data = fs.readFileSync(baselineSnapshotPath, 'utf-8')
      request.respond({
        status: 200,
        contentType: 'application/json',
        headers: {"Access-Control-Allow-Origin": "*"},
        body: data
      })
    } else {
      request.continue()
    }
  } else {
    request.continue()
  }
}

module.exports.record = async function record(response) {
  if (response.request().resourceType() === 'xhr' && (response.request().method() === 'GET' ) && (response.request().url().indexOf(url) > -1 ) ){
    mkdirp.sync(snapshotsDir);
    let snapshotIdentifier = response.request().url().split(url).pop().replace('/', '_')
    let baselineSnapshotPath = path.join(snapshotsDir, `${snapshotIdentifier}.json`)
    if(!fs.existsSync(baselineSnapshotPath)){
      let data =  await response.json()
      fs.writeFileSync(baselineSnapshotPath, JSON.stringify(data, null, 2), 'utf-8')
    }
  }
}

module.exports.assertVisual = async function assertVisual(){
  for (const viewport of viewports) {
    await page.setViewport(viewport)
    await page.reload({ waitUntil: "networkidle0" })
    const screenshot = await page.screenshot({ fullPage: true })
    expect(screenshot).toMatchImageSnapshot()
  }
}
const viewports = [
  { width: 320, height: 800 },
  { width: 400, height: 800 },
  { width: 768, height: 600 },
  { width: 1024, height: 400 },
  { width: 1280, height: 400 }
]

module.exports.viewports = viewports

/**
 * Screenshot Specific dom element
 * Example
 * await screenshotDOMElement({
        path: 'element.png',
        selector: 'header aside',
        padding: 16
    });
 */
module.exports.screenshotDomElm = async function screenshotDOMElement(opts = {}) {
  const padding = 'padding' in opts ? opts.padding : 0;
  const path = 'path' in opts ? opts.path : null;
  const selector = opts.selector;

  if (!selector)
      throw Error('Please provide a selector.');

  const rect = await page.evaluate(selector => {
      const element = document.querySelector(selector);
      if (!element)
          return null;
      const {x, y, width, height} = element.getBoundingClientRect();
      return {left: x, top: y, width, height, id: element.id};
  }, selector);

  if (!rect)
      throw Error(`Could not find element that matches selector: ${selector}.`);

  return await page.screenshot({
      path,
      clip: {
          x: rect.left - padding,
          y: rect.top - padding,
          width: rect.width + padding * 2,
          height: rect.height + padding * 2
      }
  });
}