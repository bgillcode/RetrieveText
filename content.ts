let selectedText: string = '';
let lastHighlightedNode: HTMLElement | null = null;

interface StorageItems {
  timeout?: number;
  sourceLang?: string;
  targetLang?: string;
}

document.addEventListener('mouseup', (e: MouseEvent) => {
  const selection = window.getSelection();
  if (selection) {
    selectedText = selection.toString();
    if (selectedText.trim().length > 0) {
      let newNode = highlightSelection();
      if (newNode) {
        showPopup(newNode, selectedText);
      }
    }
  }
});

const unhighlight = (): void => {
  if (lastHighlightedNode) {
    let parent = lastHighlightedNode.parentNode;
    if (parent) {
      while (lastHighlightedNode.firstChild) {
        parent.insertBefore(
          lastHighlightedNode.firstChild,
          lastHighlightedNode,
        );
      }
      parent.removeChild(lastHighlightedNode);
    }
    lastHighlightedNode = null;
  }
};

document.addEventListener('mousedown', (e: MouseEvent) => {
  if (lastHighlightedNode && !lastHighlightedNode.contains(e.target as Node)) {
    unhighlight();
  }
});

const highlightSelection = (): HTMLElement | null => {
  unhighlight();

  let selection = window.getSelection();
  if (!selection || !selection.rangeCount) {
    return null;
  }

  let range = selection.getRangeAt(0);
  let documentFragment = range.extractContents();
  let span = document.createElement('span');
  span.style.backgroundColor = 'yellow';
  span.appendChild(documentFragment);
  range.insertNode(span);
  selection.removeAllRanges();
  selection.addRange(range);

  lastHighlightedNode = span;

  return span;
};

const showPopup = (targetNode: HTMLElement, text: string): void => {
  const existingPopup = document.getElementById('textHighlighterPopup');
  if (existingPopup) {
    existingPopup.remove();
  }

  const popup = document.createElement('div');
  popup.id = 'textHighlighterPopup';

  chrome.storage.local.get(
    ['timeout', 'sourceLang', 'targetLang'],
    (items: StorageItems) => {
      const timeout = items.timeout || 0;
      const sourceLang = items.sourceLang || 'en';
      const targetLang = items.targetLang || 'ja';

      chrome.runtime.sendMessage(
        { action: 'translate', message: { text, sourceLang, targetLang } },
        (response: { translatedText?: string }) => {
          if (response && response.translatedText) {
            popup.innerText = response.translatedText;
          } else {
            popup.innerText = 'Error translating the text.';
          }

          if (timeout > 0) {
            setTimeout(() => {
              popup.remove();
            }, timeout * 1000);
          }
        },
      );
    },
  );

  document.body.appendChild(popup);

  const rect = targetNode.getBoundingClientRect();

  const popupOverflowRight = rect.left + popup.offsetWidth - window.innerWidth;
  if (popupOverflowRight > 0) {
    popup.style.left = `${
      rect.left - popupOverflowRight + window.pageXOffset
    }px`;
  } else {
    popup.style.left = `${rect.left + window.pageXOffset}px`;
  }

  popup.style.top = `${
    rect.top - popup.offsetHeight + window.pageYOffset - 30
  }px`;

  setTimeout(() => {
    const clickListener = () => {
      popup.remove();
      document.removeEventListener('click', clickListener);
    };

    document.addEventListener('click', clickListener);
  }, 100);
};
