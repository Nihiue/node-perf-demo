const { cacheClone, jsonClone, asyncTest, blockTest } = require('./app.js');

const { PerformanceObserver, performance } = require('perf_hooks');


function timerifyPromise(fn, defaultName = '[anonymous]') {
  // node < 16
  fnName = fn.name || defaultName;
  return (...args) => {
    performance.mark(`${fnName}.start`);
    return fn(...args)
      .finally(() => {
          performance.measure(`${fnName}.start`);
      });
  }
}

function setupAsyncHook() {
  const async_hooks = require("async_hooks")
  const nameMap = new Map();

  const watchTypes = ['Timeout', 'HTTPCLIENTREQUEST', 'TCPWRAP', 'TCPCONNECTWRAP', 'GETADDRINFOREQWRAP', 'GETNAMEINFOREQWRAP'];

  const hook = async_hooks.createHook({
    init(id, type, triggerID, resource) {
      if (watchTypes.indexOf(type) > -1) {
        const eid = async_hooks.executionAsyncId();

        const name = `hook.${type}.${id}.trigger.${triggerID}`;
        nameMap.set(id, name);
        performance.mark(`${name}.start`);
        if (type === 'HTTPCLIENTREQUEST') {
          console.log(`HTTPCLIENTREQUEST.${id}`, resource.req.host + resource.req.path);
        }
      }
    },
    promiseResolve(id) {
      // performance.mark(`PROMISE.${id}.end`);
      // performance.measure(`PROMISE.${id}`, `PROMISE.${id}.start`, `PROMISE.${id}.end`);
    },
    after(id) {
      const name = nameMap.get(id);
      if (name) {
        performance.measure(name, name + '.start');
      }
    }
  });

  hook.enable();
}


const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach(entry => {
    switch (entry.entryType) {
      case 'function':
        console.log(`Function - ${entry.name}: `, Math.round(entry.duration))
        break;
      case 'measure':
        console.log(`Measure - ${entry.name}: `, Math.round(entry.duration));
        break;
      case 'mark':
        // console.log(entry);
        break;
      default:
        console.log(entry);
    }
  });
});

obs.observe({ entryTypes: ['function', 'mark', 'measure'], buffered: true });


(async () => {

  performance.timerify(jsonClone)();
  performance.timerify(cacheClone)();

  setupAsyncHook();

  await timerifyPromise(asyncTest)();

  setImmediate(() => {
    const elu = performance.eventLoopUtilization();
    blockTest();
    console.log('eventLoopUtilization', performance.eventLoopUtilization(elu).utilization);
  });
})();

