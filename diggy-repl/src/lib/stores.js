import { writable } from 'svelte/store'

function createEditor() {
  const { subscribe, set } = writable('')

  return {
    subscribe,
    setContent: (code) => set(code),
    reset: () => set(''),
  }
}

export const editorStore = createEditor()

function createTerminal() {
  const { subscribe, set } = writable()

  let terminal, fitAddon

  return {
    subscribe,
    set: (ref, fit) => {
      // TODO: I don't understand Svelte stores enough. Should it be
      // done differently?
      terminal = ref
      fitAddon = fit
      return set(ref)
    },
    println: (text) => {
      if (text) {
        const textWithNewLines = text.replace(/\n/g, '\r\n')
        terminal.write(textWithNewLines + '\r\n')
      }
    },
    fit: () => {
      fitAddon.fit()
    },
  }
}

export const termStore = createTerminal()
export const socketStore = writable(null)
export const filenameStore = writable('')
