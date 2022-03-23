import { bstorage } from './api'

function saveOptions (e) {
  e.preventDefault()
  e.stopPropagation()
  bstorage.sync.set({
    style: document.querySelector('.style-radio:checked').value,
    whitelist: document.querySelector('#whitelist').value.trim(),
    fontSize: document.querySelector('#font-size').value,
    hidePageAction: document.querySelector('#hide-page-action').checked
  })
}

function restoreOptions () {
  bstorage.sync
    .get('style')
    .then(res => {
      if (res.style) {
        document.querySelectorAll('.style-radio').forEach(r => {
          r.checked = r.value === res.style
        })
      }
      if (res.whitelist) {
        document.querySelector('#whitelist').value = res.whitelist
      }
      if (res.fontSize) {
        document.querySelector('#font-size').value = res.fontSize
      }
      if (res.hidePageAction) {
        document.querySelector('#hide-page-action').checked = res.hidePageAction
      }
    })
}

document.addEventListener('DOMContentLoaded', restoreOptions)
document.querySelector('#apply').addEventListener('click', saveOptions)
