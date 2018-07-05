const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')

const globals = require('../jest.config').globals

let url = globals.api
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
