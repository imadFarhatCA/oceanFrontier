<script lang="ts">
	const brands = [
		{ name: 'Halcyon', file: 'halcyon.svg' },
		{ name: 'Ursuit', file: 'ursuit.svg' },
		{ name: 'Fourth Element', file: 'fourth-element.svg' },
		{ name: 'Bigblue', file: 'bigblue.svg' },
		{ name: 'JJCCR', file: 'jjccr.svg' },
		{ name: 'SUEX', file: 'suex.svg' }
	];

	// Duplicate brands for seamless infinite scroll
	const duplicatedBrands = [...brands, ...brands, ...brands];
</script>

<div class="carousel-container">
	<div class="brand-logos-strip">
		{#each duplicatedBrands as brand, i}
			<div class="brand-logo-item">
				<img src="/images/brands/{brand.file}" alt="{brand.name}-{i}" />
			</div>
		{/each}
	</div>
</div>

<style>
	.carousel-container {
		width: 100%;
		overflow: hidden;
		padding: 20px 0;
		position: relative;
	}

	.brand-logos-strip {
		display: flex;
		align-items: center;
		gap: 60px;
		animation: scroll 30s linear infinite;
		will-change: transform;
	}

	@keyframes scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(calc(-100% / 3));
		}
	}

	/* Pause animation on hover */
	.carousel-container:hover .brand-logos-strip {
		animation-play-state: paused;
	}

	.brand-logo-item {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		opacity: 0.7;
		transition: opacity 0.3s ease;
		height: 60px;
		min-width: 120px;
	}

	.brand-logo-item:hover {
		opacity: 1;
	}

	.brand-logo-item img {
		height: 50px;
		width: auto;
		max-width: none;
		object-fit: contain;
		filter: invert(1) brightness(1.1);
	}

	/* SUEX logo - same height but can be wider */
	.brand-logo-item img[alt^="SUEX"] {
		height: 50px;
		width: auto;
	}

	@media (max-width: 768px) {
		.brand-logos-strip {
			gap: 40px;
			animation: scroll 20s linear infinite;
		}

		.brand-logo-item {
			height: 50px;
			min-width: 80px;
		}

		.brand-logo-item img {
			height: 40px;
		}

		.brand-logo-item img[alt^="SUEX"] {
			height: 40px;
		}
	}
</style>
