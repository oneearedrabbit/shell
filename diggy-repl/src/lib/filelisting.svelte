<script>
  import { editorStore, filenameStore, termStore } from '$lib/stores.js'
  import { onMount } from 'svelte'

  export let files

  onMount(async () => {
    // Utils
    function getAll(selector) {
      let parent =
        arguments.length > 1 && arguments[1] !== undefined
          ? arguments[1]
          : document

      return Array.prototype.slice.call(parent.querySelectorAll(selector), 0)
    }

    // Dropdowns
    let $dropdowns = getAll('.dropdown-trigger:not(.is-hoverable)')

    if ($dropdowns.length > 0) {
      $dropdowns.forEach(function ($el) {
        $el.addEventListener('click', (event) => {
          event.stopPropagation()
          $el.parentNode.parentNode.classList.toggle('is-active')
        })
      })

      document.addEventListener('click', () => {
        closeDropdowns()
      })
    }

    function closeDropdowns() {
      $dropdowns.forEach(($el) => {
        $el.parentNode.parentNode.classList.remove('is-active')
      })
    }
  })

  async function readFile(filename) {
    const url = `/fs/${filename}.json`
    const res = await fetch(url)

    if (res.ok) {
      const text = await res.text()
      editorStore.setContent(text)
      filenameStore.set(filename)
      return
    }

    // TODO: handle error
  }

  function beautifyPath(pathname) {
    const chunks = pathname.split('/')
    const folder = chunks.slice(0, -1).join('/')
    const filename = chunks.slice(-1).join()
    return `<span class="folder">${folder}/</span><span class="filename">${filename}</span>`
  }

  async function openFile(pathname) {
    const url = `/fs${pathname}/raw`
    history.pushState({}, '', url)
    window.location.assign(url)
  }

  async function delFile(pathname) {
    const areYouSure = confirm('Are you sure want to delete ' + pathname + '?')

    if (!areYouSure) {
      return
    }

    const response = await fetch('/fs.json', {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filename: pathname }),
    })

    const body = await response.json()
    termStore.println(body.message)
    filenameStore.set(null)
  }
</script>

<style>
  :global(span.folder) { display: none; }
</style>

<aside class="menu">
  <ul class="menu-list">
    {#each (files || []).sort() as pathname}
      <li>
        <div class="dropdown is-right">
          <div class={$filenameStore === pathname ? 'is-active' : ''}>
            <a
              class={$filenameStore === pathname ? 'is-active' : ''}
              on:click={readFile(pathname)}
            >
              {@html beautifyPath(pathname)}
            </a>
            <a class="dropdown-trigger" aria-haspopup="true">
              <span aria-controls="dropdown-menu3" class="is-small"
                >&hellip;</span
              >
            </a>
          </div>
          <div class="dropdown-menu" id="dropdown-menu3" role="menu">
            <div class="dropdown-content">
              <a class="dropdown-item" on:click={openFile(pathname)}>Open</a>
              <hr class="dropdown-divider" />
              <a class="dropdown-item" on:click={delFile(pathname)}>Delete</a>
            </div>
          </div>
        </div>
      </li>
    {/each}
  </ul>
</aside>
