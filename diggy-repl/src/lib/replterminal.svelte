<script>
  import { onMount } from 'svelte'
  import { termStore } from '$lib/stores.js'

  const refs = {}

  onMount(async () => {
    let { Terminal } = await import('xterm')
    let { FitAddon } = await import('xterm-addon-fit')

    let term = new Terminal({
      theme: {
        background: '#0a0a0a',
      },
    })
    const fitAddon = new FitAddon()
    term.loadAddon(fitAddon)

    termStore.set(term)
    term.open(refs.terminal)

    fitAddon.fit()

    termStore.println('$ Welcome to Diggy!')
  })
</script>

<div bind:this={refs.terminal} />
