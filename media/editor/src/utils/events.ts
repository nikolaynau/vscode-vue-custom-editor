export function stopEvent(e: Event): void {
  e.preventDefault();
  e.stopPropagation();
}
