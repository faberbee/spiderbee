# Spiderbee

Crawl websites with JSON configuration

## Installation

```bash
npm install --save puppeteer spiderbee
```

## How to use

```js
const { Spiderbee } = require('spiderbee')
// this example requires lodash
const _ = require('lodash')

const result = {}

function run() {
  const spiderbee = await Spiderbee.launch({})
  
  await spiderbee.execute({ /* configuration */ }, function (spider) {
    spider.on('data', function ({ path, value }) {
      _.set(result, path.substring(2), value)
    })
  
    spider.on('end', function () {
      console.log(result)
    })
  })
}

run()
```

## Configuration

```js
{
  "url": "https://www.google.com",
  "actions": [ /* actions */ ]
}
```

## Actions

### Text action:
```js
{
  "type": "text",
  "selector": /* html selector */,
  "resultKey": /* output json result key */,
  "multiple": /* search multiple tags */,
}
```
### Url Action:
```js
{
  "type": "url",
  "resultKey": /* output json result key */
}
```
### Links action:
```js
{
  "type": "links",
  "selector": /* html selector */,
  "resultKey": /* output json result key */,
  "multiple": /* search multiple tags */,
  "regex": /* regex filter for urls */,
  "navigate": {
    "actions": [ /* actions to execute navigating each url */ ]
  }
}
```
### Loop action:
```js
{
  "type": "loop",
  "resultKey": /* output json result key */,
  "times": /* number of times to execute */,
  "actions": [ /* actions to execute */ ]
}
```
### Each action:
```js
{
  "type": "each",
  "selector": /* html selector */,
  "resultKey": /* output json result key */,
  "actions": [ /* actions to execute */ ],
  "infinite": /* use this with infinite scroll */
}
```
### Mouse Move action:
```js
{
  "type": "mouse_move",
  "selector": /* html selector */,
}
```
```js
{
  "type": "mouse_move",
  "movement": {
    "x": /* x axes movement */,
    "y": /* y axes movement */,
  }
}
```
### Mouse Down action:
```js
{
  "type": "mouse_down",
  }
}
```
### Mouse Up action:
```js
{
  "type": "mouse_up",
  }
}
```
### Click action:
```js
{
  "type": "click",
  "selector": /* html selector */,
}
```
### Write action:
```js
{
  "type": "write",
  "selector": /* html selector */,
  "value": /* value to write */
}
```
### Wait action:
```js
{
  "type": "wait",
  "millis": /* milliseconds to wait */,
}
```