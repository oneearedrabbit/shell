import { saferesolve, readFile } from '$lib/fs.js'

const vmPath = process.env['VM_PATH']

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get({ params }) {
  // drop extra .json extension, e.g. python.py.json -> python.py
  const filename = params.filename.split('.').slice(0, -1).join('.')
  const fullname = saferesolve(vmPath, filename)
  const content = (await readFile(fullname)) || ''

  return {
    body: content,
  }
}
