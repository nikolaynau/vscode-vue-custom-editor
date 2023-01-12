export function toInt(str, defaults = null) {
  const num = Number.parseInt(str, 10);
  return Number.isNaN(num) ? defaults : num;
}
