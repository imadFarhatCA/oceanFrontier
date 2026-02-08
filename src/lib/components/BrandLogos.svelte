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
		justify-content: center;
		gap: 48px;
		padding: 20px 0;
		flex-wrap: wrap;
	}

	.brand-logo-item {
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0.7;
		transition: all 0.3s ease;
		padding: 8px 12px;
		border-bottom: 2px solid transparent;
		min-width: 80px;
	}

	.brand-logo-item:hover {
		opacity: 1;
		border-bottom-color: rgba(255, 255, 255, 0.4);
		transform: translateY(-3px);
	}

	.brand-logo-item img {
		height: 50px;
		width: auto;
		max-width: 180px;
		object-fit: contain;
		filter: invert(1) brightness(1.1);
	}
</style>
