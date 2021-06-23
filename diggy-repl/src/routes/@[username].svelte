<script context="module">
  /**
   * @type {import('@sveltejs/kit').Load}
   */
  // TODO: this code duplicates index.svelte, extract it repl.svelte component
  export async function load({ page, fetch }) {
    const username = page.params.username

    const url = `/fs.json?`
    const res = await fetch(
      url +
        new URLSearchParams({
          username: username,
        })
    )

    if (res.ok) {
      const files = await res.json()

      return {
        props: {
          files: files,
          username: username,
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
