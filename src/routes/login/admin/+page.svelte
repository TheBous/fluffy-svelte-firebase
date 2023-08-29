<script lang="ts">
	import AdminCheck from "$lib/components/AdminCheck.svelte";
	import type { PageData } from "./$types";
	export let data: PageData;

</script>

<AdminCheck>
	<h1 class="text-4xl text-green-400">Admin page</h1>
	<div class="overflow-x-auto">
		<table class="table w-full">
			<thead>
				<tr>
					<th>Username</th>
					<th>Admin</th>
					<th>Bio</th>
				</tr>
			</thead>
			<tbody>
				{#each data.users as user}
					<tr>
						<td>{user.username}</td>
						<td>{user.isAdmin}</td>
						<td>{user.bio}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</AdminCheck>
