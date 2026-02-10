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
				<span class="brand-name">{brand.name}</span>
			</div>
		{/each}
	</div>
</div>

<style>
	.brands-strip {
		position: relative;
		padding: 20px 0 0;
		width: 100%;
	}

	.brands-line {
		position: relative;
		height: 1px;
		width: 0;
		margin-bottom: 20px;
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
		gap: 24px;
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
		display: flex;
		flex-direction: column;
		align-items: center;
		opacity: 0;
		animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		animation-delay: calc(0.5s + var(--i) * 0.07s);
		position: relative;
		padding: 8px 0 30px;
		transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
	}

	/* Line between logo and name */
	.brand-cell::after {
		content: '';
		position: absolute;
		bottom: 16px;
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

	/* Adjacent logos spread on hover */
	.brand-cell:hover + .brand-cell {
		transform: translateX(5px);
	}
	.brand-cell:has(+ .brand-cell:hover) {
		transform: translateX(-5px);
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
		height: 18px;
	}

	.brand-cell:hover img {
		opacity: 0.9;
		transform: translateY(-2px);
	}

	.brand-name {
		font-size: 8px;
		letter-spacing: 2px;
		text-transform: uppercase;
		color: white;
		opacity: 0;
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		white-space: nowrap;
		font-weight: 300;
		transition: opacity 0.3s ease;
	}

	.brand-cell:hover .brand-name {
		opacity: 0.5;
	}

	@media (max-width: 768px) {
		.brands-items {
			flex-wrap: wrap;
			justify-content: flex-start;
			gap: 16px 20px;
		}

		.brand-cell {
			padding: 6px 0 26px;
		}

		.brand-cell img {
			height: 24px;
		}

		.brand-cell img.suex {
			height: 14px;
		}

		.brand-name {
			font-size: 7px;
			bottom: 0;
		}
	}
</style>
