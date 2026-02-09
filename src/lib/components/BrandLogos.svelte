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

<div class="brands-strip">
	<div class="brands-line"></div>
	<div class="brands-items">
		{#each brands as brand, i}
			<div class="brand-cell" style="--i: {i}">
				<img src="/images/brands/{brand.file}" alt={brand.name} class={brand.name === 'SUEX' ? 'suex' : ''} />
			</div>
		{/each}
	</div>
</div>

<style>
	.brands-strip {
		position: relative;
		padding: 24px 0 16px;
		width: 100%;
	}

	/* Animated top line that sweeps across */
	.brands-line {
		position: absolute;
		top: 0;
		left: 0;
		height: 1px;
		width: 0;
		background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
		animation: lineSweep 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
	}

	@keyframes lineSweep {
		0% { width: 0; }
		100% { width: 100%; }
	}

	.brands-items {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 40px;
	}

	@keyframes slideIn {
		0% {
			opacity: 0;
			transform: translateX(-16px);
		}
		100% {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.brand-cell {
		opacity: 0;
		animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		animation-delay: calc(0.5s + var(--i) * 0.07s);
		position: relative;
		padding: 8px 0;
	}

	.brand-cell::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 0;
		height: 1px;
		background: rgba(255,255,255,0.4);
		transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.brand-cell:hover::after {
		width: 100%;
	}

	.brand-cell img {
		height: 32px;
		width: auto;
		object-fit: contain;
		filter: invert(1) brightness(1.1);
		opacity: 0.4;
		transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.brand-cell img.suex {
		height: 16px;
	}

	.brand-cell:hover img {
		opacity: 0.9;
		transform: translateY(-2px);
	}

	@media (max-width: 768px) {
		.brands-items {
			flex-wrap: wrap;
			justify-content: center;
			gap: 20px 28px;
		}

		.brand-cell img {
			height: 24px;
		}

		.brand-cell img.suex {
			height: 12px;
		}
	}
</style>
