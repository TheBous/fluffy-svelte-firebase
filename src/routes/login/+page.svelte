<script lang="ts">
	import { auth, user } from "$lib/firebase";
	import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

	const signInWithGoogle = async () => {
		const provider = new GoogleAuthProvider();
		const user = await signInWithPopup(auth, provider);
		console.warn(user);
	};
</script>

<h2>Login</h2>

{#if $user}
	<h3>User logged</h3>
	<button on:click={() => signOut(auth)} class="btn btn-primary"
		>Sign Out</button
	>
{:else}
	<button on:click={signInWithGoogle} class="btn btn-primary"
		>Login with Google</button
	>
{/if}
