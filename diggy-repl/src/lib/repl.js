import { get } from 'svelte/store'
import { termStore, filenameStore } from '$lib/stores.js'

export async function runCode(host, username) {
  termStore.println(`$ Running ${get(filenameStore)}...`)

  const response = await fetch(
    `http://${host}/eval`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      // TODO: some crazy filename manipulation, perhaps align it with
      // chroot
      body: JSON.stringify({
        input: get(filenameStore).split('/').slice(2).join('/'),
        username: username,
      }),
    }
  )

  const body = await response.json()
  termStore.println(body.stdout)
  termStore.println(body.stderr)
}

export async function newFile(username) {
  const filename = prompt('New filename: ', 'filename')

  if (!filename) {
    return
  }

  const response = await fetch('/fs.json', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filename: filename,
      username: username,
    }),
  })

  const body = await response.json()
  termStore.println(body.message)
}
