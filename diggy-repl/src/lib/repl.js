import { SANDBOX_HOST } from '$lib/env.js'
import { get } from 'svelte/store'
import { termStore, filenameStore } from '$lib/stores.js'

export async function runCode(username) {
  termStore.println(`$ Running ${get(filenameStore)}...`)

  const response = await fetch(`${SANDBOX_HOST}/run`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    // TODO: some crazy filename manipulation, perhaps align it with
    // chroot
    body: JSON.stringify({
      filename: get(filenameStore).split('/').slice(2).join('/'),
      username: username,
    }),
  })

  const body = await response.json()
  termStore.println(body.stdout)
  termStore.println(body.stderr)
}

export async function newFile(username) {
  const filename = prompt('New filename: ', 'filename')

  if (!filename) {
    return
  }

  const response = await fetch(`${SANDBOX_HOST}/fs`, {
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
