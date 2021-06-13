<script context="module">
  /**
   * @type {import('@sveltejs/kit').Load}
   */
  export async function load({ page, fetch, session, context }) {
    const username = page.params.username

    const url = `/fs.json?`
    const res = await fetch(
      url +
        new URLSearchParams({
          username: username,
        })
    )

    if (res.ok) {
      return {
        props: {
          username: username,
          files: await res.json(),
        },
      }
    }

    return {
      status: res.status,
      error: new Error(`Could not load ${url}`),
    }
  }
</script>

<script>
  export let username, files

  import { onMount } from 'svelte'
  import Repl from '$lib/repl.svelte'

  import '../app.scss'

  onMount(async () => {
    if (username === undefined) {
      const href = location.href.split('/')
      username = href[href.length - 1].slice(1)
    }
  })
</script>

<Repl {username} {files} />
