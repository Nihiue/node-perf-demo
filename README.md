![image](https://user-images.githubusercontent.com/5763301/144204499-7815193b-6580-49ee-afc6-499aa8866a20.png)

## Inspector

### Dev Tools

https://nodejs.org/en/docs/guides/debugging-getting-started/

```bash
$ node --inspect-brk src/app.js cache
```

### API

https://nodejs.org/docs/latest-v14.x/api/inspector.html

```bash
$ node src/inspector.js
```

## Performance hooks

https://nodejs.org/docs/latest-v14.x/api/perf_hooks.html

https://nodejs.org/docs/latest-v14.x/api/async_hooks.html

```bash
$ node src/perf-hooks.js
```

## Profiling Log 

https://nodejs.org/en/docs/guides/simple-profiling/

```bash
$ node --prof src/app.js cache
```

```bash
$ node --prof-process isolate-0x4ae79a0-78045-v8.log > processed.txt
```

## Reference Docs

### Don't Block the Event Loop

https://nodejs.org/en/docs/guides/dont-block-the-event-loop/


### Tracking Down and Fixing Performance Bottlenecks

https://nodesource.com/blog/tracking-down-performance-bottlenecks-nsolid-deoptigate


### Event Loop Utilization in Node.js

https://nodesource.com/blog/event-loop-utilization-nodejs


### Memory Leaks Demystified

https://nodesource.com/blog/memory-leaks-demystified
