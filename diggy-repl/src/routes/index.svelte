<script context="module">
  /**
   * @type {import('@sveltejs/kit').Load}
   */
  import { UUID } from '$lib/utils.js'

  let username = UUID()

  // TODO: this code duplicates index.svelte, extract it repl.svelte component
  export async function load({ page, fetch }) {
    const url = `/fs.json?`
    const res = await fetch(
      url +
        new URLSearchParams({
          username: username,
          templatize: true,
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
  import '../app.scss'
  import Repl from '$lib/repl.svelte'
  import Nav from '$lib/nav.svelte'
  import Footer from '$lib/footer.svelte'
  import { newProject } from '$lib/utils.js'

  export let files, username
</script>

<Nav />

<div class="columns is-mobile is-gapless">
  <div class="column is-half is-offset-1">
    <div class="content">
      <p>
        Diggy is an <a href="https://github.com/diggyhq/shell"
          >open-source playground</a
        > that runs practical and recreational programming languages. Simply put,
        you can Ruby or Python in the browser.
      </p>

      <p>
        <a on:click={newProject}>Click a link</a> to use Diggy or give it a try in
        the code editor below. It creates a new workspace everytime you load a page.
        No accounts required.
      </p>

      <p>
        Your code is executed in a sandboxed environment, and the results are
        sent back to the browser. Since everything runs in a protected sandbox
        you cannot access network interfaces or (hopefully!) break anything.
      </p>

      <p>Ultimatelly, have fun!</p>
    </div>
  </div>
</div>

<div class="columns is-gapless">
  <div class="column is-1" />
  <div class="column">
    <Repl {username} {files} templatize={true} />
  </div>
  <div class="column is-1" />
</div>

<div class="columns is-mobile is-gapless">
  <div class="column is-half is-offset-1">
    <div class="content">
      <p>
        Diggy is an ongoing experiment, and there are a few features that are
        not suppported yet, but I would like to implement them eventually.
      </p>

      <ol>
        <li>Collaborative editor</li>
        <li>Install Language Server Protocol</li>
        <li>Support more practical and recreational languages</li>
        <li>Protected/read-only namespaces</li>
        <li>
          Some niceties: search box in the file listing window, more careful
          mobile support and responsiviness
        </li>
        <li>REPL interface for languages that support it</li>
      </ol>

      <p>
        I maintain roadmap in <a
          href="https://github.com/diggyhq/shell/blob/master/ROADMAP.md"
          >this file</a
        >.
      </p>

      <p>
        That being said, I suggest not to run anything critical or sensetive at
        this point on Diggy. I think I will be cleaning up anonymous projects
        from time to time. At some point, I will implement permanent accounts.
      </p>

      <p>
        If you have any comments, find a security vulnerability or just want to
        say "Hi", <a href="/pages/contact">drop me a message</a>
        or <a href="https://github.com/diggyhq/shell/issues">file a defect</a>.
        I would love to know what you think about it.
      </p>

      <p>
        You can also <a href="/pages/join">subscribe to the mailing list</a>, if
        you want to stay in the loop. I will be occasionally sending updates
        when a new major feature lands in.
      </p>

      <p>Thank you, Kirill</p>
    </div>
  </div>
</div>

<Footer />
