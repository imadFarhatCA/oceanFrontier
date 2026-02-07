<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	type CardItem = {
		id: number | string;
		title: string;
		description: string;
		image: string;
		category?: string;
	};

	export let items: CardItem[] = [];
	export let ctaText: string = 'Learn More';

	const dispatch = createEventDispatcher<{ cardClick: CardItem }>();

	function handleCardClick(item: CardItem) {
		dispatch('cardClick', item);
	}
</script>

<div class="cards-container">
	<div class="cards-grid">
		{#each items as item, i (item.id)}
			<div class="card" style="--card-index: {i}">
				<div class="card-image-wrapper">
					<div class="card-image" style="background-image: url('{item.image}')">
						<div class="image-overlay"></div>
					</div>
				</div>
				<div class="card-content">
					<h3 class="card-title">{item.title}</h3>
					<p class="card-description">{item.description}</p>
					<button class="card-cta" on:click|stopPropagation={() => handleCardClick(item)}>
						{ctaText}
					</button>
				</div>
			</div>
		{/each}
	</div>
</div>
