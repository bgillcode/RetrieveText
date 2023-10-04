interface StorageItems {
  timeout?: number;
  sourceLang?: string;
  targetLang?: string;
  enabled?: boolean;
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

const updateButtonState = (isEnabled: boolean): void => {
  const enableOrDisableElement = document.getElementById(
    'enableOrDisable',
  ) as HTMLButtonElement;
  enableOrDisableElement.innerText = isEnabled ? 'Disable' : 'Enable';
};

document
  .getElementById('enableOrDisable')
  ?.addEventListener('click', function () {
    chrome.storage.local.get('enabled', (items: StorageItems) => {
      // Toggle the current state
      const isEnabled = !items.enabled;
      chrome.storage.local.set({ enabled: isEnabled }, function () {
        // Update the button text after saving the new state
        updateButtonState(isEnabled);
      });
    });
  });

chrome.storage.local.get(
  ['timeout', 'sourceLang', 'targetLang', 'enabled'],
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
    const enableOrDisableElement = document.getElementById(
      'enableOrDisable',
    ) as HTMLButtonElement;

    timeoutElement.value =
      items.timeout !== undefined ? items.timeout.toString() : '0';
    sourceLangElement.value = items.sourceLang || 'en';
    targetLangElement.value = items.targetLang || 'ja';
    enableOrDisableElement.innerText = items.enabled ? 'Disable' : 'Enable';
  },
);
