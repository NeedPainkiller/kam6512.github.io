export default function generatePrefix (): string {
  const blank = ''
  if (typeof window === 'undefined' || typeof window.document === 'undefined') return blank

  const style = window.document.documentElement.style
  if ('transform' in style) return blank

  const prefixes = ['Moz', 'Webkit', 'O', 'ms']
  const len = prefixes.length
  for (let i = 0; i < len; ++i) {
    let prefix = prefixes[i]
    if (prefix + 'Transform' in style) {
      return prefix
    }
  }
  return blank
}

