<h2>Architecture</h2>

<p>Diggy runs a container for executing code in isolation aka
sandbox. There are some <a href="/pages/limitations">limitations</a>
you might want to be aware of.</p>

<p>A client sends code to a sandbox, the sandbox executes the code,
and finally the results of the execution are returned to the
client.</p>

<p>The code is executed in a Python process that is launched through
<a href="https://nsjail.dev/">NsJail</a>, which is responsible for
sandboxing your code.</p>

<p>The output returned by sandbox is truncated at around 1 MB.</p>
