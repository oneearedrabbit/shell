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
  import { onMount } from 'svelte'
  import Repl from '$lib/repl.svelte'
  import { UUID } from '$lib/utils.js'

  export let files, username

  onMount(async () => {
    window.addEventListener('DOMContentLoaded', (event) => {
      console.log('DOM fully loaded and parsed')
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
          // const _target = document.getElementById(target);

          // Toggle the "is-active" class on both the
          // "navbar-burger" and the "navbar-menu"
          el.classList.toggle('is-active')
          // _target.classList.toggle('is-active');
        })
      })
    }
  })

  function newProject() {
    const uuid = UUID()
    const url = `/@${uuid}`
    history.pushState({}, '', url)
    window.location.assign(url)
  }
</script>

<div class="block mb-3">
  <nav
    class="navbar is-transparent"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="container">
      <div class="navbar-brand">
        <a href="/" class="navbar-item has-text-weight-bold">Diggy</a>

        <a
          role="button"
          class="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbar"
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </a>
      </div>

      <div id="navbar" class="navbar-menu">
        <div class="navbar-start">
          <div class="navbar-item">
            <a class="navbar-item">Join the list</a>
          </div>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <a class="navbar-item">
              <span class="icon">
                <i class="fab fa-github-alt" />
              </span>
              <span>Github</span>
            </a>
          </div>

          <div class="navbar-item">
            <a class="button is-black" on:click={newProject}>New Project</a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</div>

<div class="columns is-mobile is-gapless">
  <div class="column is-half is-offset-1">
    <div class="content">
      <p>
        Diggy is an <a>open-source playground</a> that runs 70 programming
        languages. Simply <a on:click={newProject}>click a link</a> to use Diggy
        or give it a try in the code editor below. No accounts required. You can
        also self-host Diggy if you want.
      </p>

      <p>
        Your code is executed in a sandboxed environment, and the
        results are sent back to the browser. Since everything runs in
        a protected sandbox you cannot access network interfaces or
        (hopefully!) break anything. See <a>limitations</a > for more
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
        If you have any comments, find a security vulnerability or just want to
        say "Hi", <a>drop me a message</a>. I would love to know what you think
        about it.
      </p>

      <p>
        You can also <a>subscribe to the mailing list</a>, if you want to stay
        in the loop. I will be occasionally sending updates when a new major
        feature lands in.
      </p>
    </div>
  </div>
</div>

<footer class="footer pt-4 pb-4">
  <div class="container">
    <div class="columns is-mobile is-gapless">
      <div class="column is-4">
        <p class="has-text-weight-bold">Diggy</p>
        <div><a>What is Diggy</a></div>
        <div><a>Help</a></div>
        <div><a>Architecture</a></div>
      </div>
      <div class="column is-4">
        <p class="has-text-weight-bold">About</p>
        <div><a>About</a></div>
        <div><a>Contact</a></div>
      </div>
    </div>
  </div>
  <div class="container mt-3">Diggy by Kruzenshtern, LLC</div>
</footer>
