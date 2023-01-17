export function nextFocusElement(): void {
  const activeElement = document.activeElement;
  if (
    !activeElement?.classList.contains('v-editor__input') &&
    !activeElement?.classList.contains('v-action') &&
    !activeElement?.classList.contains('v-button')
  ) {
    return;
  }
  let nextElement: Element | null | undefined =
    activeElement?.nextElementSibling;
  if (nextElement?.classList.contains('v-editor__controls')) {
    nextElement = nextElement.children[0];
  } else if (
    !nextElement &&
    activeElement?.parentElement?.nextElementSibling?.classList.contains(
      'v-editor__input'
    )
  ) {
    nextElement = activeElement?.parentElement?.nextElementSibling;
  }
  if (!nextElement) {
    nextElement =
      activeElement?.parentNode?.parentNode?.children[0]?.children[0];
  }

  if (nextElement) {
    (nextElement as HTMLElement).focus();
  }
}

export function prevFocusElement(): void {
  const activeElement = document.activeElement;
  if (
    !activeElement?.classList.contains('v-editor__input') &&
    !activeElement?.classList.contains('v-action') &&
    !activeElement?.classList.contains('v-button')
  ) {
    return;
  }
  let prevElement: Element | null | undefined =
    activeElement?.previousElementSibling;
  if (prevElement?.classList.contains('v-editor__controls')) {
    prevElement = prevElement.lastElementChild;
  } else if (
    !prevElement &&
    activeElement?.parentElement?.previousElementSibling?.classList.contains(
      'v-editor__input'
    )
  ) {
    prevElement = activeElement?.parentElement?.previousElementSibling;
  }
  if (!prevElement) {
    prevElement =
      activeElement?.parentNode?.parentNode?.lastElementChild?.lastElementChild;
  }

  if (prevElement) {
    (prevElement as HTMLElement).focus();
  }
}
