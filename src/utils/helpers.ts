import { slice } from 'viem'

export const compareAddress = (a: string, b: string) => {
  return a.toLowerCase() === b.toLowerCase()
}

export const splitEvery = (n: number, list: any[]) => {
  if (n <= 0) {
    throw new Error('First argument to splitEvery must be a positive integer')
  }
  var result = []
  var idx = 0
  while (idx < list.length) {
    result.push(list.slice(idx, (idx += n)))
  }
  return result
}
