import path from 'path'
import { promises as fs } from 'fs'
import os from 'os'

const vmPath = process.env['VM_PATH']

async function rreaddir(dir, everything = []) {
  try {
    const files = (await fs.readdir(dir)).map((f) => path.join(dir, f))
    await Promise.all(
      files.map(async (f) => {
        if ((await fs.stat(f)).isDirectory()) {
          return rreaddir(f, everything)
        } else {
          everything.push(f)
          return everything
        }
      })
    )
    return everything
  } catch (err) {
    if (err.errno == -2 && err.code === 'ENOENT' && err.syscall === 'scandir') {
      console.log(`Creating new namespace ${dir}`)
      await fs.mkdir(dir)
    } else {
      console.error(err)
    }

    return []
  }
}

export async function readdir(username) {
  return rreaddir(path.join(vmPath, username))
}

export async function readFile(params) {
  try {
    const filename = params
    const data = await fs.readFile(filename, 'utf8')
    return data
  } catch (err) {
    console.error(err)
    return null
  }
}

export function saferesolve(base, target) {
  let targetPath = '.' + path.posix.normalize('/' + target)
  return path.posix.resolve(base, targetPath)
}

export async function withTempFile(fn) {
  return withTempDir((dir) => fn(path.join(dir, 'file')))
}

export async function withTempDir(fn) {
  const dir = await fs.mkdtemp((await fs.realpath(os.tmpdir())) + path.sep)
  try {
    return await fn(dir)
  } finally {
    fs.rm(dir, { recursive: true })
  }
}
