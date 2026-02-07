<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let title: string = '';
	export let description: string = '';
	export let tagline: string = '';
	export let introText: string = '';
	export let listItems: string[] = [];
	export let ctaTitle: string = '';
	export let ctaButtonText: string = '';
	export let ctaId: string = '';

	let expanded = false;

	const dispatch = createEventDispatcher<{ cta: string }>();

	function handleCTA() {
		dispatch('cta', ctaId);
	}
</script>

<div class="hero-section">
	<h1 class="hero-title">{title}</h1>
	<p class="hero-description">{description}</p>
	<p class="hero-tagline">{tagline}</p>

	<!-- Mobile: Collapsible content with read more -->
	<div class="hero-expandable" class:expanded>
		<div class="hero-expandable-content">
			{#if introText}
				<p class="hero-intro">{introText}</p>
			{/if}
			{#if listItems.length > 0}
				<ul class="hero-list">
					{#each listItems as item}
						<li>{item}</li>
					{/each}
				</ul>
			{/if}
			{#if ctaTitle && ctaButtonText}
				<div class="hero-cta-wrapper">
					<p class="hero-cta-title">{ctaTitle}</p>
					<button class="hero-cta" on:click={handleCTA}>
						{ctaButtonText}
					</button>
				</div>
			{/if}
		</div>
		<div class="hero-fade-overlay" class:hidden={expanded}></div>
	</div>

	<!-- Read More/Less Button (mobile only) -->
	<button class="read-more-button" class:expanded on:click={() => expanded = !expanded}>
		<span>{expanded ? 'Read less' : 'Read more'}</span>
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<polyline points="6 9 12 15 18 9"></polyline>
		</svg>
	</button>
</div>
