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

<div class="brands-row">
	{#each brands as brand, i}
		<div class="brand-item" style="--i: {i}">
			<img src="/images/brands/{brand.file}" alt={brand.name} />
		</div>
	{/each}
</div>

<style>
	.brands-row {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 48px;
		padding: 16px 0;
		width: 100%;
	}

	@keyframes brandFadeIn {
		0% {
			opacity: 0;
			transform: translateY(12px);
		}
		100% {
			opacity: 0.55;
			transform: translateY(0);
		}
	}

	.brand-item {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 50px;
		opacity: 0;
		animation: brandFadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		animation-delay: calc(0.3s + var(--i) * 0.08s);
		transition: opacity 0.3s ease;
	}

	.brand-item:hover {
		opacity: 1 !important;
	}

	.brand-item img {
		height: 40px;
		width: auto;
		max-width: none;
		object-fit: contain;
		filter: invert(1) brightness(1.1);
	}

	@media (max-width: 768px) {
		.brands-row {
			gap: 24px;
			flex-wrap: wrap;
			justify-content: center;
		}

		.brand-item {
			height: 40px;
		}

		.brand-item img {
			height: 30px;
		}
	}
</style>
