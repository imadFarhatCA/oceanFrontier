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
		gap: 40px;
		padding: 0;
		flex-wrap: wrap;
	}

	.brand-logo-item {
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0.65;
		transition: all 0.3s ease;
		padding-bottom: 6px;
		border-bottom: 1px solid transparent;
	}

	.brand-logo-item:hover {
		opacity: 0.95;
		border-bottom-color: rgba(255, 255, 255, 0.3);
		transform: translateY(-2px);
	}

	.brand-logo-item img {
		height: 60px;
		width: auto;
		filter: invert(1);
	}
</style>
