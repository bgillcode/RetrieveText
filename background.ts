import { constructTranslateApiUrl } from './apiUtil';

interface Message {
  action: string;
  message: {
    text: string;
    sourceLang: string;
    targetLang: string;
  };
}

chrome.runtime.onMessage.addListener(
  (message: Message, sender: any, sendResponse: any) => {
    if (message.action === 'translate') {
      translateText(message.message, sendResponse);
      return true;
    }
  },
);

const translateText = (message: Message['message'], sendResponse: any) => {
  // Note apiURL or fullURL should be the URL that you want to use for the translation API, replace this part
  const apiURL = constructTranslateApiUrl(
    message.sourceLang,
    message.targetLang,
  );
  const fullURL = `${apiURL}${encodeURI(message.text)}`;

  fetch(fullURL)
    .then((response) => response.json())
    .then((data: any[]) => {
      const translatedSentences = (data[0] || [])
        .map((item: any[]) => item[0])
        .filter(
          (sentence: string) =>
            typeof sentence === 'string' && sentence.trim() !== '',
        )
        .join('\n');

      sendResponse({ translatedText: translatedSentences });
    })
    .catch((error: Error) => {
      console.error('Translation failed:', error);
      sendResponse({ translatedText: 'Error translating' });
    });
};

chrome.storage.local.get(
  ['timeout', 'sourceLang', 'targetLang', 'enabled'],
  (items: any) => {
    if (items.sourceLang?.length < 1) {
      chrome.storage.local.set({
        timeout: items.timeout > 0 ? items.timeout : 0,
        sourceLang: items.sourceLang?.length > 0 ? items.sourceLang : 'en',
        targetLang: items.targetLang?.length > 0 ? items.targetLang : 'ja',
      });

      if (items.enabled === true) {
        chrome.action.setIcon({ path: 'icons/rt_enabled.png' });
      } else {
        chrome.action.setIcon({ path: 'icons/rt_disabled.png' });
      }
    }
  },
);

const updateIconBasedOnState = (enabled: boolean): void => {
  if (enabled) {
    chrome.action.setIcon({ path: 'icons/rt_enabled.png' });
  } else {
    chrome.action.setIcon({ path: 'icons/rt_disabled.png' });
  }
};

// When the extension is installed or updated
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.storage.local.set(
      {
        enabled: true,
      },
      () => {
        updateIconBasedOnState(true);
      },
    );
  } else if (details.reason === 'update') {
    chrome.storage.local.get('enabled', (items) => {
      updateIconBasedOnState(items.enabled);
    });
  }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.enabled) {
    updateIconBasedOnState(changes.enabled.newValue);
  }
});
