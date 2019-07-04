import { bstorage } from './api'

function saveOptions (e) {
  e.preventDefault()
  e.stopPropagation()
  bstorage.sync.set({
    style: document.querySelector('input[type="radio"]:checked').value,
    whitelist: document.querySelector('#whitelist').value.trim()
  })
}

function restoreOptions () {
  bstorage.sync
    .get('style')
    .then((res) => {
      if (res.style) {
        document.querySelectorAll('input[type="radio"]').forEach(r => {
          r.checked = r.value === res.style
        })
      }
      if (res.whitelist) {
        document.querySelector('#whitelist').value = res.whitelist
      }
    })
}

document.addEventListener('DOMContentLoaded', restoreOptions)
document.querySelector('#apply').addEventListener('click', saveOptions)
