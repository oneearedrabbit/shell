import path from 'path'
import { readdir, saferesolve } from '$lib/fs.js'
import fs from 'fs-extra'

const vmPath = process.env['VM_PATH']

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get(params) {
  const username = params.query.get('username')
  const fullPath = saferesolve(vmPath, '.')
  const templatize = params.query.get('templatize', false)

  // Templatize userland, override everything
  if (templatize) {
    const tpl = saferesolve(path.join(vmPath, '..'), './userland_tpl/welcome')
    const dst = saferesolve(fullPath, username)
    await fs.copy(tpl, dst)
  }

  let files = await readdir(username)

  files = files.map((name) => name.split(fullPath)[1])

  return {
    body: files,
  }
}

export async function post(request) {
  const body = request.body
  const filename = body.filename

  if (filename === undefined) {
    return { body: { message: 'Empty filename' } }
  }

  const username = body.username

  if (username === undefined) {
    return { body: { message: 'Unknown username' } }
  }

  const fullname = saferesolve(path.join(vmPath, username), filename)

  await fs.writeFile(fullname, '')

  return { body: { message: `File ${filename} created` } }
}

export async function del(request) {
  const body = request.body
  const filename = body.filename

  if (filename === undefined) {
    return { body: { message: 'Empty filename' } }
  }

  const fullname = saferesolve(vmPath, filename)

  // TODO: handle error if a file doesn't exist
  await fs.unlink(fullname)

  return { body: { message: `File ${filename} deleted` } }
}
