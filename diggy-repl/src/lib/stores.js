import { writable } from 'svelte/store'

const createTerminal = instance => {
  const store = writable(instance)

  return {
    subscribe: store.subscribe,
    set: ref => store.set((instance = ref)),
    println: (text) => {
      if (text) {
        const textWithNewLines = text.replace(/\n/g, '\r\n')
        instance.write(textWithNewLines + '\r\n')
      }
    },
  }
}

export const termStore = createTerminal()
export const editorStore = writable()
export const socketStore = writable()
export const filenameStore = writable()
