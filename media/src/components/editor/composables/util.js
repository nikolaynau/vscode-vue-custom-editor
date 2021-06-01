export function nextFocusElement() {
  const activeElement = document.activeElement;
  if (!activeElement.classList.contains("v-editor__input") &&
    !activeElement.classList.contains("v-action") &&
    !activeElement.classList.contains("v-button")) {
    return;
  }
  let nextElement = activeElement?.nextElementSibling;
  if (nextElement?.classList.contains("v-editor__controls")) {
    nextElement = nextElement.children[0];
  } else if (!nextElement && activeElement?.parentNode?.nextElementSibling?.classList.contains("v-editor__input")) {
    nextElement = activeElement.parentNode.nextElementSibling;
  }
  if (!nextElement) {
    nextElement = activeElement?.parentNode?.parentNode?.children[0]?.children[0];
  }

  if (nextElement) {
    nextElement.focus();
  }
}

export function prevFocusElement() {
  const activeElement = document.activeElement;
  if (!activeElement.classList.contains("v-editor__input") &&
    !activeElement.classList.contains("v-action") &&
    !activeElement.classList.contains("v-button")) {
    return;
  }
  let prevElement = activeElement?.previousElementSibling;
  if (prevElement?.classList.contains("v-editor__controls")) {
    prevElement = prevElement.lastChild;
  } else if (!prevElement && activeElement?.parentNode?.previousElementSibling?.classList.contains("v-editor__input")) {
    prevElement = activeElement.parentNode.previousElementSibling;
  }
  if (!prevElement) {
    prevElement = activeElement?.parentNode?.parentNode?.lastChild?.lastChild;
  }

  if (prevElement) {
    prevElement.focus();
  }
}
