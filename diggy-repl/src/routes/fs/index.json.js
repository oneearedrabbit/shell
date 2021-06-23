import fetch from 'node-fetch'

/*
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get(params) {
  const username = params.query.get('username')
  const templatize = params.query.get('templatize') || false

  // NOTE: proxy a request to local Sandbox API, we are going to
  // prerender a page if we can
  const url = import.meta.env.VITE_SANDBOX_HOST_LOCAL + '/fs?'
  const fetchParams = new URLSearchParams({
    username: username,
    templatize: templatize,
  })

  const resp = await fetch(url + fetchParams)
  const body = await resp.json()

  return {
    body: body.files,
  }
}
