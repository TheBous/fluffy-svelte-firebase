<script lang="ts">
	import AuthCheck from "$lib/components/AuthCheck.svelte";

	import { db, user, userData } from "$lib/firebase";
	import { doc, getDoc, writeBatch } from "firebase/firestore";

	let debounceTimer: NodeJS.Timeout;

	let username = "";
	let loading = false;
	let isAvailable = false;

	const usernameRE = /^(?=[a-zA-Z0-9._]{3,16}$)(?!.*[_.]{2})[^_.].*[^_.]$/;
	$: isValid =
		username?.length > 2 && username.length < 16 && usernameRE.test(username);
	$: isTouched = username.length > 0;
	$: isTaken = isValid && !isAvailable && !loading;

	const checkAvailability = async () => {
		isAvailable = false;
		clearTimeout(debounceTimer);
		loading = true;

		debounceTimer = setTimeout(async () => {
			const docRef = doc(db, "usernames", username);
			const exist = await getDoc(docRef);
			isAvailable = !exist.exists();
			loading = false;
		}, 500);
	};

	const confirmUsername = async () => {
		console.log("confirming username", username);
		const batch = writeBatch(db);
		batch.set(doc(db, "usernames", username), { uid: $user?.uid });
		batch.set(doc(db, "users", $user!.uid), {
			username,
			isAdmin: false,
			photoURL: $user?.photoURL ?? null,
			published: true,
			bio: "I am the Walrus",
			links: [
				{
					title: "Test Link",
					url: "https://kung.foo",
					icon: "custom",
				},
			],
		});

		await batch.commit();

		username = "";
		isAvailable = false;
	};
</script>

<AuthCheck>
	{#if $userData?.username}
		<p class="text-lg">
			Your username is <span class="text-success font-bold"
				>@{$userData.username}</span
			>
		</p>
		<p class="text-sm">(Usernames cannot be changed)</p>
		<a class="btn btn-primary" href="/login/photo">Upload Profile Image</a>
	{:else}
		<form class="w-2/5" on:submit|preventDefault={confirmUsername}>
			<input
				type="text"
				placeholder="Username"
				class="input w-full"
				bind:value={username}
				on:input={checkAvailability}
				class:input-error={!isValid && isTouched}
				class:input-warning={isTaken}
				class:input-success={isAvailable && isValid && !loading}
			/>
			<div class="my-4 min-h-16 px-8 w-full">
				{#if loading}
					<p class="text-secondary">Checking availability of @{username}...</p>
				{/if}

				{#if !isValid && isTouched}
					<p class="text-error text-sm">
						must be 3-16 characters long, alphanumeric only
					</p>
				{/if}

				{#if isValid && !isAvailable && !loading}
					<p class="text-warning text-sm">
						@{username} is not available
					</p>
				{/if}

				{#if isAvailable}
					<button class="btn btn-success">Confirm username @{username} </button>
				{/if}
			</div>
		</form>
	{/if}
</AuthCheck>
