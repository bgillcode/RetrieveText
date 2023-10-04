interface StorageItems {
  timeout?: number;
  sourceLang?: string;
  targetLang?: string;
}

const saveSettings = (): void => {
  const timeoutElement = document.getElementById('timeout') as HTMLInputElement;
  const sourceLangElement = document.getElementById(
    'sourceLang',
  ) as HTMLSelectElement;
  const targetLangElement = document.getElementById(
    'targetLang',
  ) as HTMLSelectElement;

  const timeout = parseInt(timeoutElement.value, 10);
  const sourceLang = sourceLangElement.value;
  const targetLang = targetLangElement.value;

  chrome.storage.local.set({
    timeout: timeout,
    sourceLang: sourceLang,
    targetLang: targetLang,
  });
};

document.getElementById('timeout')?.addEventListener('input', saveSettings);
document.getElementById('sourceLang')?.addEventListener('change', saveSettings);
document.getElementById('targetLang')?.addEventListener('change', saveSettings);

chrome.storage.local.get(
  ['timeout', 'sourceLang', 'targetLang'],
  (items: StorageItems) => {
    const timeoutElement = document.getElementById(
      'timeout',
    ) as HTMLInputElement;
    const sourceLangElement = document.getElementById(
      'sourceLang',
    ) as HTMLSelectElement;
    const targetLangElement = document.getElementById(
      'targetLang',
    ) as HTMLSelectElement;

    timeoutElement.value =
      items.timeout !== undefined ? items.timeout.toString() : '0';
    sourceLangElement.value = items.sourceLang || 'en';
    targetLangElement.value = items.targetLang || 'ja';
  },
);
