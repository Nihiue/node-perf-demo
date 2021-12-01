const { cacheClone, jsonClone, asyncTest } = require('./app.js');

const { PerformanceObserver, performance } = require('perf_hooks');
const { spawnSync } = require('child_process');


function timerifyPromise(fn, defaultName = '[anonymous]') {
  // node < 16
  fnName = fn.name || defaultName;
  return (...args) => {
    performance.mark(`${fnName}.start`);
    return fn(...args)
      .finally(() => {
          performance.mark(`${fnName}.end`);
          performance.measure(`timerify.${fnName}`, `${fnName}.start`, `${fnName}.end`);
      });
  }
}

function setupAsyncHook() {
  const async_hooks = require("async_hooks")
  
  const hook = async_hooks.createHook({
    init(id, type, triggerID, resource) {
      if (type == 'PROMISE') {
        performance.mark(`PROMISE.${id}.start`);
      }
    },
    promiseResolve(id) {
      performance.mark(`PROMISE.${id}.end`);
      performance.measure(`PROMISE.${id}`, `PROMISE.${id}.start`, `PROMISE.${id}.end`);
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

obs.observe({ entryTypes: ['function', 'mark', 'measure'] });

(async () => {
  performance.timerify(jsonClone)();
  performance.timerify(cacheClone)();

  const elu = performance.eventLoopUtilization();
  // setupAsyncHook();
  await timerifyPromise(asyncTest)();
  spawnSync('sleep', ['5']);
  console.log('eventLoopUtilization', performance.eventLoopUtilization(elu).utilization);
})();
