import { baction, btabs, bstorage } from './api'

let options = {
  style: 'default', // pinyin style
  whitelist: '' // dissmissed characters
}

bstorage.sync
  .get('style')
  .then((res) => {
    options.style = updateValue(res.style, options.style)
    options.whitelist = updateValue(res.whitelist, options.whitelist)
  })

bstorage.onChanged.addListener((changes, area) => {
  options.style = updateValue(changes.style.newValue, options.style)
  options.whitelist = updateValue(changes.whitelist.newValue, options.whitelist)
})

function updateValue (newValue, oldValue) {
  return newValue && newValue !== oldValue ? newValue : oldValue
}

baction.onClicked.addListener(() => {
  injectStyle()
  injectScript()
})

function sendApply () {
  btabs.query({ active: true, currentWindow: true })
    .then(tabs => {
      btabs.sendMessage(tabs[0].id, {
        command: 'apply',
        options
      })
    })
    .catch(err => { console.log(err) })
}

function injectScript () {
  btabs.executeScript({ file: '/content_scripts/pinyin_it_content.js' })
    .then(sendApply)
    .catch(err => { console.log(err) })
}

function injectStyle () {
  const rtStyle = `rt {
    font-size: 0.8em;
    background: antiquewhite;
    color: #000;}
    ruby {
      line-height: 3;
    }
    body {
      max-width: 100vw;
      word-wrap: anywhere;
    }`
  btabs.insertCSS({ code: rtStyle })
    .then(() => {})
    .catch(err => { console.log(err) })
}
