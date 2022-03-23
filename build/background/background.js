(function () {
  'use strict';

  /* eslint-disable*/
  const btabs = browser.tabs;
  const bruntime = browser.runtime;
  const baction = browser.browserAction;
  const paction = browser.pageAction;
  const bstorage = browser.storage;

  const options = {
    style: 'default', // pinyin style
    whitelist: '', // dissmissed characters
    fontSize: 16,
    hidePageAction: false
  };

  bstorage.sync
    .get('style')
    .then((res) => {
      options.style = updateValue(res.style, options.style);
      options.whitelist = updateValue(res.whitelist, options.whitelist);
      options.fontSize = updateValue(res.fontSize, options.fontSize);
      options.hidePageAction = updateValue(res.hidePageAction, options.hidePageAction);
    });

  bstorage.onChanged.addListener((changes, area) => {
    options.style = updateValue(changes.style.newValue, options.style);
    options.whitelist = updateValue(changes.whitelist.newValue, options.whitelist);
    options.fontSize = updateValue(changes.fontSize.newValue, options.fontSize);
    options.hidePageAction = updateValue(changes.hidePageAction.newValue, options.hidePageAction);
  });

  function updateValue (newValue, oldValue) {
    return newValue && newValue !== oldValue ? newValue : oldValue
  }

  bruntime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'GET-OPTIONS') {
      sendResponse({ options });
    }
  });

  baction.onClicked.addListener(() => {
    injectScript()
      .then(sendHover)
      .catch(e => console.log(e));
  });
  paction.onClicked.addListener(tab => {
    injectScript()
      .then(() => {
        sendApply(tab);
      })
      .catch(e => console.log(e));
  });

  btabs.onCreated.addListener(tab => {
    if (options.hidePageAction) {
      paction.hide(tab.id);
    }
  });

  function injectScript () {
    return btabs.executeScript({ file: '/content_scripts/pinyin_it_content.js' })
  }

  function sendHover () {
    btabs.query({ active: true, currentWindow: true })
      .then(tabs => {
        btabs.sendMessage(tabs[0].id, {
          type: 'HOVER',
          options
        });
      })
      .catch(err => { console.log(err); });
  }

  function sendApply (tab) {
    btabs.sendMessage(
      tab.id,
      { type: 'APPLY', options }
    ).then(response => {
      paction.hide(tab.id);
    }).catch(e => console.log(e));
  }

}());
