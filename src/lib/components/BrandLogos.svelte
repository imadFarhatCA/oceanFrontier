<script lang="ts">
	const brands = [
		{ name: 'Halcyon', file: 'halcyon.svg' },
		{ name: 'Ursuit', file: 'ursuit.svg' },
		{ name: 'Fourth Element', file: 'fourth-element.svg' },
		{ name: 'Bigblue', file: 'bigblue.svg' },
		{ name: 'JJCCR', file: 'jjccr.svg' },
		{ name: 'SUEX', file: 'suex.svg' }
	];
</script>

<div class="brand-logos-strip">
	{#each brands as brand}
		<div class="brand-logo-item">
			<img src="/images/brands/{brand.file}" alt={brand.name} />
		</div>
	{/each}
</div>

<style>
	.brand-logos-strip {
		display: flex;
		align-items: center;
		gap: 32px;
		padding: 20px 0;
		flex-wrap: wrap;
	}

	.brand-logo-item {
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0.5;
		transition: opacity 0.2s ease;
	}

	.brand-logo-item:hover {
		opacity: 0.85;
	}

	.brand-logo-item img {
		height: 36px;
		width: auto;
		filter: invert(1);
	}
</style>
