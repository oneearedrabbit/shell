<script context="module">
  /**
   * @type {import('@sveltejs/kit').Load}
   */

  let username = 'welcome'

  // NOTE: this code duplicates @[username].svelte, not sure how to
  // make it more organic
  export async function load({ page, fetch, session, context }) {
    const url = `/fs.json?`
    const res = await fetch(
      url +
        new URLSearchParams({
          username: username,
        })
    )

    if (res.ok) {
      return {
        props: {
          files: await res.json(),
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
        Diggy is
        an <a href="https://github.com/diggyhq/shell">open-source
        playground</a> that runs 70 programming
        languages. Simply <a on:click={newProject}>click a link</a> to
        use Diggy or give it a try in the code editor below. No
        accounts required. You can also self-host Diggy if you want.
      </p>

      <p>
        Your code is executed in a sandboxed environment, and the
        results are sent back to the browser. Since everything runs in
        a protected sandbox you cannot access network interfaces or
        (hopefully!) break
        anything. See <a href="/pages/limitations">limitations</a > for more
        detail.
      </p>

      <p>Ultimatelly, have fun!</p>
    </div>
  </div>
</div>

<div class="columns is-gapless">
  <div class="column is-1" />
  <div class="column">
    <Repl {username} {files} />
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
        That being said, I suggest not to run anything critical or sensetive at
        this point on Diggy. Also, I will reset <a href="/@welcome">@welcome</a>
        user every hour.
      </p>

      <p>
        If you have any comments, find a security vulnerability or
        just want to say "Hi", <a href="/pages/contact">drop me a
        message</a>. I would love to know what you think about it.
      </p>

      <p>
        You can also <a href="/pages/join">subscribe to the mailing
        list</a>, if you want to stay in the loop. I will be
        occasionally sending updates when a new major feature lands
        in.
      </p>
    </div>
  </div>
</div>

<Footer />
