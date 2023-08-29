<script lang="ts">
	import { userData } from "$lib/firebase";
</script>

{#if $userData?.isAdmin}
	<slot />
{:else}
	<p class="text-error my-10">You must be an admin to view this page</p>
{/if}
