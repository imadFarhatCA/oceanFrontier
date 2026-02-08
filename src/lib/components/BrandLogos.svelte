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
		justify-content: flex-start;
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
		min-width: 100px;
	}

	.brand-logo-item:hover {
		opacity: 1;
		border-bottom-color: rgba(255, 255, 255, 0.4);
		transform: translateY(-3px);
	}

	.brand-logo-item img {
		height: 55px;
		width: auto;
		max-width: 200px;
		object-fit: contain;
		filter: invert(1) brightness(1.1);
	}

	/* Make SUEX logo larger to compensate for its square aspect ratio */
	.brand-logo-item img[alt="SUEX"] {
		height: 70px;
		max-width: 220px;
	}

	@media (max-width: 768px) {
		.brand-logos-strip {
			justify-content: center;
			gap: 32px;
		}

		.brand-logo-item img {
			height: 45px;
		}

		.brand-logo-item img[alt="SUEX"] {
			height: 58px;
		}
	}
</style>
