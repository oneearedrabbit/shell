import node from '@sveltejs/adapter-node'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
    adapter: node({ out: 'build' }),
    host: process.env['HOST'] || '127.0.0.1',
  },
}

export default config
