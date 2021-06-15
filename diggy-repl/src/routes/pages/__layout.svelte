<script>
  import '../../app.scss'
  import Nav from '$lib/nav.svelte'
  import Footer from '$lib/footer.svelte'
</script>

<Nav />

<div class="columns is-mobile is-gapless">
  <div class="column is-half is-offset-1">
    <div class="content">
      <slot />
    </div>
  </div>
</div>

<Footer />
