const data = require('../data/random.json');

const NodeCache = require( "node-cache" );
const { spawnSync } = require('child_process');
const axios = require('axios');

function cacheClone() {
  const myCache = new NodeCache({
    useClones: true
  });
  myCache.set('data', data);
  for (let i = 0; i < 50; i += 1) {
    const item = myCache.get('data');
    if (item.length === 0) {
      return false;
    }
  }
}

function jsonClone() {
  const myCache = new NodeCache({
    useClones: false
  });
  myCache.set('data', JSON.stringify(data));
  for (let i = 0; i < 50; i += 1) {
    const item = JSON.parse(myCache.get('data'));
    if (item.length === 0) {
      return false;
    }
  }
}

function sleep(ms = 300) {
  return new Promise(r => {
    setTimeout(r, ms);
  })
}

async function asyncTest() {
  await Promise.all([
    axios.get('https://www.baidu.com/'),
    sleep(1000),
    sleep(1500)
  ]);
}

function blockTest() {
  spawnSync('sleep', ['5']);
}

module.exports = {
  jsonClone,
  cacheClone,
  asyncTest,
  blockTest
};

if (process.mainModule && process.mainModule.filename === __filename) {
  switch(process.argv[2]) {
    case 'json': jsonClone(); break;
    case 'async': asyncTest(); break;
    case 'block': blockTest(); break;
    default:
      cacheClone();
  }
}

