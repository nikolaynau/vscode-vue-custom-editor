export function isDefined(value: unknown): boolean {
  return value !== null && value !== undefined;
}

export function isTextEmpty(value: unknown): boolean {
  return typeof value === 'string' && value.length === 0;
}
