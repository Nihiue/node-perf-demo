const inspector = require('inspector');
const fs = require('fs');
const path = require('path');
const { cacheClone, jsonClone } = require('./app.js');
const session = new inspector.Session();
session.connect();

const profileId = Date.now();

const heapFd = fs.openSync(path.join(__dirname, `../output/profile.${profileId}.heapsnapshot`), 'w');

session.on('HeapProfiler.addHeapSnapshotChunk', (m) => {
  fs.writeSync(heapFd, m.params.chunk);
});

function runTest() {
  jsonClone();
}

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
