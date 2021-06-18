<script>
  import { createForm } from "svelte-forms-lib"

  let message = ''

  const { form, handleChange, handleSubmit } = createForm({
    initialValues: {
      name: "",
      email: "",
      message: ""
    },
    onSubmit: async (values) => {
      const response = await fetch(
	'/contact.json',
	{
	  method: 'POST',
	  headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
	  },
	  body: JSON.stringify(values),
	}
      )

      const body = await response.json()
      message = body.message
    }
  });  
</script>

<h2>Contact me</h2>

<p>Thanks for trying out Diggy and taking the time to share your
feedback. Happy to chat over if you are interested.</p>

{message}

<div class="columns">
  <div class="column is-6">
    <form class="contactform" on:submit={handleSubmit}>
      <div class="field">
        <label class="label" for="name">Name</label>
        <div class="control">
          <input type="text" id="name" name="name" required="true" placeholder="Your name" class='input' on:change={handleChange} bind:value={$form.name} />
        </div>
      </div>

      <div class="field">
        <label class="label" for="email">Email</label>
        <div class="control">
          <input type="text" id="email" name="email" required="true" class="input" placeholder="Your email" on:change={handleChange} bind:value={$form.email} />
        </div>
      </div>

      <div class="field">
        <label class="label" for="message">Message</label>
        <div class="control">
          <textarea id="message" name="message" required="true" class="textarea" placeholder="Message" on:change={handleChange} bind:value={$form.message}></textarea>
        </div>
      </div>

      <div style="display: none;">
        <label>URL</label>
        <div class="control" for="url">
          <input type="text" id="url" name="url" hint="Leave this field blank!" />
	</div>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <input type="submit" value='Send' class='button is-link' />
        </div>
      </div>
    </form>
  </div>
</div>
