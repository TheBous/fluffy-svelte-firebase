<script lang="ts">
	import { page } from "$app/stores";
	import AnimatedRoute from "$lib/components/AnimatedRoute.svelte";
	import { userData } from "$lib/firebase";
</script>

<nav class="flex justify-center my-6">
	<ul class="steps">
		<a href="/login" class="step step-primary">Sign In</a>
		<a
			href="/login/username"
			class="step"
			class:step-primary={$page.route.id?.match(/username|photo|admin/g)}
		>
			Choose Username
		</a>
		<a
			href="/login/photo"
			class="step"
			class:step-primary={$page.route.id?.match(/photo|admin/g)}
		>
			Upload Photo
		</a>
		{#if $userData?.isAdmin}
			<a
				href="/login/admin"
				class="step"
				class:step-primary={$page.route.id?.includes("admin")}
			>
				Admin panel
			</a>
		{/if}
	</ul>
</nav>

<AnimatedRoute>
	<main class="card w-4/6 bg-neutral text-neutral-content mx-auto">
		<div class="card-body items-center text-center">
			<slot />
		</div>
	</main>
</AnimatedRoute>
