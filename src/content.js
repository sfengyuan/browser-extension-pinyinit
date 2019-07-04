import { bruntime } from './api'
import pinyinjs from 'thepinyin.js'

let body = ''
function start () {
  if (window.hasRun) {
    return
  }
  window.hasRun = true
  bruntime.onMessage.addListener(({ command, options }) => {
    if (command === 'apply') {
      if (!body) {
        body = document.body.innerHTML
        convert(handleOptions(options))
      } else {
        document.body.innerHTML = body
        body = ''
      }
    }
  })
}

function handleOptions (options) {
  switch (options.style) {
    case 'default':
      options.style = pinyinjs.DEFAULT
      break
    case 'nomark':
      options.style = pinyinjs.NOMARK
      break
    case 'number':
      options.style = pinyinjs.NUMBER
      break
    default:
      break
  }
  return options
}
function convert ({ style, whitelist }) {
  document.body.innerHTML = body.replace(/[\u4e00-\u9fa5]/g, char => {
    if (whitelist && whitelist.indexOf(char) !== -1) {
      return char
    }
    let py = pinyinjs.py(char, style)
    if (Array.isArray(py[0])) {
      py = py[0].join(',&nbsp;')
    }
    return `&nbsp;<ruby>${char}<rt>${py}</rt></ruby>&nbsp;`
  })
}

start()
