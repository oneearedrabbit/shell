import { saferesolve, readFile } from '$lib/fs.js'

const vmPath = process.env['VM_PATH']

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get({ params }) {
  const fullname = saferesolve(vmPath, params.filename)
  const body = await readFile(fullname)
  return {
    body: body,
  }
}
