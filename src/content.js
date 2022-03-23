import { bruntime } from './api'
import pinyinjs from 'thepinyin.js'
import tpl from './tpl.js'
import { throttle } from 'lodash-es'
function start () {
  let options = {}
  const doms = {}
  const ww = window.innerWidth - 16
  const wh = window.innerHeight - 16
  const sending = bruntime.sendMessage({ type: 'GET-OPTIONS' })
  sending.then(res => {
    options = handleOptions(res.options)
    const div = document.createElement('div')
    div.attachShadow({ mode: 'open' })
    div.shadowRoot.innerHTML = tpl
    document.body.appendChild(div)

    doms.modal = div.shadowRoot.querySelector('.pinyin-it-app')
    doms.ruby = div.shadowRoot.querySelector('.char')
    doms.rt = div.shadowRoot.querySelector('.pinyin')

    doms.ruby.style.fontSize = doms.rt.style.fontSize = options.fontSize + 'px'
  }, err => {
    console.log(err)
  })

  function updatePinyin (e) {
    const text = getWordUnderCursor(e.clientX, e.clientY)
    if (!/[\u4e00-\u9fa5]/.test(text)) {
      doms.modal.classList.remove('show')
      return
    }
    output(text, convertChar(text))
    tweakModalPos(e)
    doms.modal.classList.add('show')
    document.body.removeEventListener('mousemove')
  }

  bruntime.onMessage.addListener(({ type, options }) => {
    if (type === 'HOVER') {
      document.body.addEventListener('mousemove', throttle(updatePinyin, 50))
    }
  })

  bruntime.onMessage.addListener(({ type, options }) => {
    if (type === 'APPLY') {
      const body = document.body.innerHTML
      document.body.innerHTML = convert(body)
    }
  })

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
        options.style = pinyinjs.DEFAULT
        break
    }
    return options
  }

  function convertChar (char) {
    let py = pinyinjs.py(char, options.style)
    if (Array.isArray(py[0])) {
      py = py[0].join(' | ')
    }
    return py
  }
  function convert (data) {
    return data.replace(/[\u4e00-\u9fa5]/g, char => {
      if (options.whitelist && options.whitelist.indexOf(char) !== -1) {
        return char
      }
      const py = convertChar(char)
      return `&nbsp;<ruby class="pinyin-it-ruby">${char}<rt class="pinyin-it-rt" style="font-size: 1em;">${py}</rt></ruby>&nbsp;`
    })
  }

  function output (char, py) {
    doms.ruby.innerText = char
    doms.rt.innerText = py
  }

  function tweakModalPos (e) {
    const predictedX = e.pageX + 16
    const predictedY = e.pageY
    doms.modal.style.top = predictedY + 'px'
    doms.modal.style.left = predictedX + 'px'

    const rect = doms.modal.getBoundingClientRect()
    if (rect.top < 0) {
      doms.modal.style.top = '16px'
    }

    if (rect.left < 0) {
      doms.modal.style.left = '16px'
    }

    if (rect.bottom > wh) {
      doms.modal.style.top = predictedY - (rect.bottom - wh) + 'px'
    }

    if (rect.right > ww) {
      doms.modal.style.left = predictedX - (rect.right - ww) + 'px'
    }
  }

  function getWordUnderCursor (x, y) {
    const range = document.caretPositionFromPoint(x, y)
    const textNode = range.offsetNode
    if (textNode && textNode.nodeType === 3) {
      const char = textNode.nodeValue[range.offset]
      return char ? char.trim() : char
    }
  }
}

if (!window.PINYIN_IT_SCRIPT_IS_RUN) {
  start()
  window.PINYIN_IT_SCRIPT_IS_RUN = true
}
