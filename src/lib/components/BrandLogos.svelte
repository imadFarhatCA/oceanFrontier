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
			<div class="brand-line"></div>
			<img src="/images/brands/{brand.file}" alt={brand.name} class={brand.name === 'SUEX' ? 'suex' : ''} />
			<span class="brand-name">{brand.name}</span>
		</div>
	{/each}
</div>

<style>
	.brands-row {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 0;
		padding: 20px 0;
		width: 100%;
	}

	@keyframes brandReveal {
		0% {
			opacity: 0;
			transform: scale(0.85);
			filter: blur(4px);
		}
		100% {
			opacity: 1;
			transform: scale(1);
			filter: blur(0);
		}
	}

	@keyframes lineGrow {
		0% { height: 0; opacity: 0; }
		100% { height: 24px; opacity: 0.15; }
	}

	.brand-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex: 1;
		padding: 12px 8px;
		opacity: 0;
		animation: brandReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		animation-delay: calc(0.4s + var(--i) * 0.1s);
		cursor: default;
		position: relative;
	}

	.brand-line {
		position: absolute;
		right: 0;
		top: 50%;
		transform: translateY(-50%);
		width: 1px;
		height: 0;
		background: white;
		opacity: 0;
		animation: lineGrow 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		animation-delay: calc(0.7s + var(--i) * 0.1s);
	}

	.brand-item:last-child .brand-line {
		display: none;
	}

	.brand-item img {
		height: 36px;
		width: auto;
		max-width: none;
		object-fit: contain;
		filter: invert(1) brightness(1.1);
		opacity: 0.5;
		transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.brand-item img.suex {
		height: 18px;
	}

	.brand-item:hover img {
		opacity: 1;
		transform: scale(1.08);
	}

	.brand-name {
		font-size: 8px;
		letter-spacing: 2px;
		text-transform: uppercase;
		color: white;
		opacity: 0;
		margin-top: 8px;
		font-weight: 300;
		transition: opacity 0.3s ease;
	}

	.brand-item:hover .brand-name {
		opacity: 0.5;
	}

	@media (max-width: 768px) {
		.brands-row {
			flex-wrap: wrap;
			justify-content: center;
			gap: 0;
		}

		.brand-item {
			flex: 0 0 33.33%;
			padding: 10px 4px;
		}

		.brand-line {
			display: none;
		}

		.brand-item img {
			height: 28px;
		}

		.brand-item img.suex {
			height: 14px;
		}

		.brand-name {
			font-size: 7px;
			margin-top: 6px;
		}
	}
</style>
