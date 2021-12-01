
const data = require('../data/output.json');
const NodeCache = require( "node-cache" );

function cacheClone() {
  const myCache = new NodeCache({
    useClones: true
  });
  myCache.set('data', data);
  for (let i = 0; i < 100; i += 1) {
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
  for (let i = 0; i < 100; i += 1) {
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
  await sleep(1000);
}

module.exports = {
  jsonClone,
  cacheClone,
  asyncTest
};

if (process.mainModule && process.mainModule.filename === __filename) {
  switch(process.argv[2]) {
    case 'json': jsonClone(); break;
    case 'async': asyncTest(); break;
    default:
      cacheClone();
  }
}

