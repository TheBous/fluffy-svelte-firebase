<script>
	import { page } from "$app/stores";
	import { blur } from "svelte/transition";
</script>

{#key $page.url}
	<div in:blur={{ duration: 600 }}>
		<slot />
	</div>
{/key}
