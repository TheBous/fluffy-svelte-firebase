<script lang="ts">
	import { auth, user } from "$lib/firebase";
	import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

	const signInWithGoogle = async () => {
		const provider = new GoogleAuthProvider();
		const credential = await signInWithPopup(auth, provider);
		const idToken = await credential.user.getIdToken();
		await fetch("/api/signin", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ idToken }),
		});
	};

	const signOutSSR = async () => {
		await fetch("/api/signin", { method: "DELETE" });
		await signOut(auth);
	};
</script>

<h2>Login</h2>

{#if $user}
	<h3>User logged</h3>
	<button on:click={signOutSSR} class="btn btn-primary">Sign Out</button>
{:else}
	<button on:click={signInWithGoogle} class="btn btn-primary"
		>Login with Google</button
	>
{/if}
