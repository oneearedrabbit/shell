<script context="module">
  let EditorView, EditorState, basicSetup, python, keymap

  import { runCode } from './repl.js'

  export async function loadCodeMirror() {
    // Core
    const CodeMirrorView = await import('@codemirror/view')
    EditorView = CodeMirrorView.EditorView
    keymap = CodeMirrorView.keymap

    let state = await import('@codemirror/state')
    let Prec = state.Prec
    EditorState = state.EditorState

    // Basic setup
    let { highlightSpecialChars, drawSelection } = await import(
      '@codemirror/view'
    )
    let { indentOnInput } = await import('@codemirror/language')
    let { history, historyKeymap } = await import('@codemirror/history')
    let { foldKeymap } = await import('@codemirror/fold')
    let { defaultKeymap } = await import('@codemirror/commands')
    let { bracketMatching } = await import('@codemirror/matchbrackets')
    let { closeBrackets, closeBracketsKeymap } = await import(
      '@codemirror/closebrackets'
    )
    let { autocompletion, completionKeymap } = await import(
      '@codemirror/autocomplete'
    )
    let { commentKeymap } = await import('@codemirror/comment')
    let { highlightSelectionMatches } = await import('@codemirror/search')
    let { defaultHighlightStyle } = await import('@codemirror/highlight')
    let { lineNumbers } = await import('@codemirror/gutter')

    // Python specific addons
    python = (await import('@codemirror/lang-python')).python

    basicSetup = [
      lineNumbers(),
      highlightSpecialChars(),
      history(),
      drawSelection(),
      indentOnInput(),
      Prec.fallback(defaultHighlightStyle),
      bracketMatching(),
      closeBrackets(),
      autocompletion(),
      highlightSelectionMatches(),
      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...commentKeymap,
        ...completionKeymap,
      ]),
    ]
  }
</script>

<script>
  import { SANDBOX_HOST } from '$lib/env.js'
  import { editorStore, filenameStore, socketStore } from '$lib/stores.js'
  import { onMount, createEventDispatcher } from 'svelte'
  import { oneDark } from './one-dark'

  export let username

  const dispatch = createEventDispatcher()

  let w, h

  const refs = {}
  let editor
  let destroyed = false
  let interval

  $: if (editor && $editorStore !== undefined) {
    createEditor($editorStore)
  }

  onMount(() => {
    ;(async () => {
      if (!basicSetup) {
        await loadCodeMirror()
      }

      await createEditor($editorStore)
    })()

    return () => {
      destroyed = true
      clearInterval(interval)
    }
  })

  async function createEditor(editorStore) {
    if (destroyed) return

    const onEditorChange = EditorView.updateListener.of((event) => {
      if (
        !event.docChanged ||
        event.state.doc.toJSON().join('\n') === editorStore
      ) {
        return
      }

      // const text = editor.viewState.state.doc.toJSON() || []
      const text = editor.viewState.state.sliceDoc()

      clearTimeout(interval)
      interval = setTimeout(() => {
        if (!$socketStore) {
          return
        }

        // TODO: extract from ws to a REST call
        $socketStore.emit('save', { filename: $filenameStore, body: text })
      }, 750)

      dispatch('change', { text })
    })

    const mod = /Mac/.test(navigator.platform) ? 'Cmd' : 'Ctrl'
    const editorState = EditorState.create({
      doc: editorStore || '',
      extensions: [
        basicSetup,
        python(),
        oneDark,
        onEditorChange,
        keymap.of([
          {
            key: `${mod}-Enter`,
            run: async () => {
              runCode(SANDBOX_HOST, username)
            },
          },
        ]),
      ],
    })

    if (editor) {
      editor.setState(editorState)
    } else {
      const editorView = new EditorView({
        state: editorState,
        editable: true,
        lineWrapping: true,
        parent: refs.editor,
      })
      editor = editorView
    }

    editor.focus()
  }
</script>

<div bind:offsetWidth={w} bind:offsetHeight={h} bind:this={refs.editor} />

{#if !editor}
  <div>Initializing editor...</div>
  <textarea class="cm-content">{$editorStore}</textarea>
{/if}

<style>
  :global(.cm-content) {
    font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono,
      DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
    font-size: 0.8em;
    border: 0;
    white-space: pre-wrap !important;
  }

  :global(.cm-focused) {
    outline: none !important;
  }

  :global(.cm-wrap) {
    height: 55vh;
  }

  :global(.cm-scroller) {
    overflow: auto;
  }

  :global(.cm-wrap .cm-cursorLayer) {
    display: none;
  }

  :global(.cm-focused .cm-cursorLayer) {
    display: block;
  }
</style>
