<script>
  export let username, files, templatize

  import { SANDBOX_HOST, WS_HOST } from '$lib/env.js'
  import { runCode, newFile } from './repl.js'
  import { onMount } from 'svelte'
  import CodeEditor from '$lib/codeeditor.svelte'
  import ReplTerminal from '$lib/replterminal.svelte'
  import FileListing from '$lib/filelisting.svelte'

  import {
    editorStore,
    termStore,
    filenameStore,
    socketStore,
  } from '$lib/stores.js'

  import '../app.scss'

  onMount(async () => {
    const ioClient = await import('socket.io-client')
    const socket = ioClient.io(WS_HOST, {
      query: { username: username },
    })
    socketStore.set(socket)

    $socketStore.on('message', async (data) => {
      // NOTE: I'm just lazy and doing a full refresh
      const url = `/fs.json?`
      const res = await fetch(
        url +
          new URLSearchParams({
            username: username,
          })
      )
      files = await res.json()
    })

    // Get all "navbar-burger" elements
    const navbarBurgers = Array.prototype.slice.call(
      document.querySelectorAll('.navbar-burger'),
      0
    )

    // Check if there are any navbar burgers
    if (navbarBurgers.length > 0) {
      // Add a click event on each of them
      navbarBurgers.forEach((el) => {
        el.addEventListener('click', () => {
          // Get the target from the "data-target" attribute
          const target = el.dataset.target
          const _target = document.getElementById(target)

          // Toggle the "is-active" class on both the
          // "navbar-burger" and the "navbar-menu"
          el.classList.toggle('is-active')
          _target.classList.toggle('is-active')
        })
      })
    }
  })
</script>

<div class="columns editor is-centered p-3">
  <div class="column is-one-fifth" style="border-right:1px solid #333333;">
    <div>
      <a class="is-small is-white" on:click={newFile(username)}>New file</a>
    </div>
    <hr class="divider is-light" />
    <FileListing {files} />
  </div>
  <div class="column is-two-fifths editor-column">
    {#if $filenameStore}
      <CodeEditor {username} />
    {:else}
      <div>Please select a file</div>
    {/if}
  </div>
  <div class="column is-two-fifths" style="border-left:1px solid #333333;">
    <div class="has-text-weight-bold pb-2">
      <a
        class="button is-link is-small"
        on:click={runCode(SANDBOX_HOST, username)}>Run &#9658;</a
      >
    </div>

    <ReplTerminal />
  </div>
</div>
