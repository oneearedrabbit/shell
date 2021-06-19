<script>
  import { onMount } from 'svelte'
  import { newProject } from '$lib/utils.js'

  let active = false

  onMount(async () => {
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
          active = !active

          // NOTE: something doesn't work on / page
          // Get the target from the "data-target" attribute
          // const target = el.dataset.target
          // const dataTarget = document.getElementById(target);

          // Toggle the "is-active" class on both the
          // "navbar-burger" and the "navbar-menu"
          // el.classList.toggle('is-active')
          // dataTarget.classList.toggle('is-active');
        })
      })
    }
  })
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
          class={active ? 'is-active navbar-burger' : 'navbar-burger'}
          aria-label="menu"
          aria-expanded="false"
          data-target="navbar"
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </a>
      </div>

      <div id="navbar" class={active ? 'is-active navbar-menu' : 'navbar-menu'}>
        <div class="navbar-start">
          <div class="navbar-item">
            <a href="/pages/join" class="navbar-item">Join the list</a>
          </div>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <a href="https://github.com/diggyhq/shell" class="navbar-item">
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
