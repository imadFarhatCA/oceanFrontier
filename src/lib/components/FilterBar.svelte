<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	type FilterOption = {
		id: string;
		label: string;
	};

	export let filters: FilterOption[] = [];
	export let activeFilter: string = 'all';

	const dispatch = createEventDispatcher<{ filter: string }>();

	function handleFilter(filterId: string) {
		dispatch('filter', filterId);
	}
</script>

<div class="filter-content">
	<nav class="filter-bar">
		{#each filters as filter, i}
			{#if i > 0}
				<span class="filter-separator">/</span>
			{/if}
			<a
				href="#{filter.id}"
				class="filter-link"
				class:active={activeFilter === filter.id}
				on:click|preventDefault|stopPropagation={() => handleFilter(filter.id)}
			>
				{filter.label}
			</a>
		{/each}
	</nav>
</div>
