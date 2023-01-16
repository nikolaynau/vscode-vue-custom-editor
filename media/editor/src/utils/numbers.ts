export function toInt(str: string, defaults?: number): number | undefined {
  const num = Number.parseInt(str, 10);
  return Number.isNaN(num) ? defaults : num;
}
