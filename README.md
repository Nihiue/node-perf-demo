# Simple profiling
https://nodejs.org/zh-cn/docs/guides/simple-profiling/
```
node --prof src/app.js cache
```

```
node --prof-process isolate-0x4ae79a0-78045-v8.log > processed.txt
```

# Inspector
```
node --inspect-brk src/app.js cache
```