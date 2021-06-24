import path from 'path'

export function saferesolve(base, target) {
  let targetPath = '.' + path.posix.normalize('/' + target)
  return path.posix.resolve(base, targetPath)
}
