const inspector = require('inspector');
const fs = require('fs');
const path = require('path');
const { cacheClone, jsonClone, asyncTest, blockTest } = require('./app.js');

function runTest() {
  cacheClone();
  // jsonClone();
  // blockTest();
}

const profileId = Date.now();
const heapFd = fs.openSync(path.join(__dirname, `../output/profile.${profileId}.heapsnapshot`), 'w');

const session = new inspector.Session();
session.connect();

session.on('HeapProfiler.addHeapSnapshotChunk', (m) => {
  fs.writeSync(heapFd, m.params.chunk);
});

session.post('Profiler.enable', () => {
  session.post('Profiler.start', () => {

    runTest();

    session.post('HeapProfiler.takeHeapSnapshot', null, (err, r) => {
      fs.closeSync(heapFd);
    });

    session.post('Profiler.stop', (err, { profile }) => {
      if (!err) {
        fs.writeFileSync(path.join(__dirname, `../output/profile.${profileId}.cpuprofile`), JSON.stringify(profile));
      }
    });
  });
});
