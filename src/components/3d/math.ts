export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max)
}

export const smoothstep = (e0, e1, x) => {
  if (e0 >= e1) return 0
  const t = clamp((x - e0) / (e1 - e0), 0, 1)
  return t * t * (3 - 2 * t)
}

export function map(
  value: number,
  start1: number,
  stop1: number,
  start2: number,
  stop2: number
): number {
  return ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2
}

export default {
  clamp,
  smoothstep,
  map
}
