export function round(num: number): string {
  let str: string
  if (num > 1000000000) {
    str = (num / 1000000000).toFixed(1)
    return str + "B"
  } else if (num > 1000000) {
    str = (num / 1000000).toFixed(1)
    return str+ "M"
  } else if (num > 1000) {
    str = (num / 1000).toFixed(1)
    return str + "K"
  }
  return String(num)
}
