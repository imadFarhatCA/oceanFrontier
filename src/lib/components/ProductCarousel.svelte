<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import type { GearProduct } from '$lib/data/gearItems';

	export let products: GearProduct[] = [];

	let productsGrid: HTMLDivElement;
	let activeIndex = 0;
	let needsScrolling = false;
	let isAtStart = true;
	let isAtEnd = false;

	function checkScrollability() {
		if (!productsGrid) return;
		const scrollWidth = productsGrid.scrollWidth;
		const clientWidth = productsGrid.clientWidth;
		needsScrolling = scrollWidth > clientWidth + 5; // 5px tolerance
		updateScrollPosition();
	}

	function updateScrollPosition() {
		if (!productsGrid) return;
		const scrollLeft = productsGrid.scrollLeft;
		const scrollWidth = productsGrid.scrollWidth;
		const clientWidth = productsGrid.clientWidth;

		isAtStart = scrollLeft <= 5;
		isAtEnd = scrollLeft >= scrollWidth - clientWidth - 5;
	}

	function updateActiveIndex() {
		if (!productsGrid || !productsGrid.children.length) return;
		const children = Array.from(productsGrid.children) as HTMLElement[];
		const scrollLeft = productsGrid.scrollLeft;
		const itemWidth = children[0].offsetWidth + 12;
		activeIndex = Math.round(scrollLeft / itemWidth);
		activeIndex = Math.max(0, Math.min(activeIndex, products.length - 1));
		updateScrollPosition();
	}

	function scrollCarousel(direction: 'prev' | 'next') {
		if (!productsGrid || !needsScrolling) return;
		const next = direction === 'next' ? activeIndex + 1 : activeIndex - 1;
		goToItem(Math.max(0, Math.min(next, products.length - 1)));
	}

	function goToItem(index: number) {
		if (!productsGrid) return;
		const children = Array.from(productsGrid.children) as HTMLElement[];
		if (children[index]) {
			children[index].scrollIntoView({
				behavior: 'smooth',
				block: 'nearest',
				inline: 'start'
			});
		}
	}

	onMount(() => {
		if (productsGrid) {
			updateActiveIndex();
			checkScrollability();
			productsGrid.addEventListener('scroll', updateActiveIndex);
			window.addEventListener('resize', checkScrollability);
		}

		return () => {
			productsGrid?.removeEventListener('scroll', updateActiveIndex);
			window.removeEventListener('resize', checkScrollability);
		};
	});

	afterUpdate(() => {
		checkScrollability();
	});
</script>

<div class="carousel-section">
	<div class="carousel-wrapper">
		{#if needsScrolling}
			<button
				class="carousel-btn prev"
				class:disabled={isAtStart}
				on:click={() => scrollCarousel('prev')}
				aria-label="Previous"
				disabled={isAtStart}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
			</button>
		{/if}
		<div class="carousel-grid" class:centered={!needsScrolling} bind:this={productsGrid}>
			{#each products as product, i}
				<div class="product-item" style="--idx: {i}">
					<div class="product-card {product.category}">
						{#if product.image}
							<img src={product.image} alt={product.name} />
						{:else}
							<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
						{/if}
					</div>
					<div class="product-underline"></div>
					<span class="product-name">{product.name}</span>
				</div>
			{/each}
		</div>
		{#if needsScrolling}
			<button
				class="carousel-btn next"
				class:disabled={isAtEnd}
				on:click={() => scrollCarousel('next')}
				aria-label="Next"
				disabled={isAtEnd}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
			</button>
		{/if}
	</div>

	{#if products.length > 1}
		<div class="pagination-dots">
			{#each products as _, i}
				<button
					class="dot"
					class:active={i === activeIndex}
					on:click={() => goToItem(i)}
					aria-label="Go to product {i + 1}"
				></button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.carousel-section {
		border-top: none;
		padding-top: 0;
		position: relative;
	}

	.carousel-wrapper {
		position: relative;
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 20px;
	}

	/* Carousel grid */
	.carousel-grid {
		display: flex;
		gap: 12px;
		overflow-x: auto;
		scrollbar-width: none;
		-ms-overflow-style: none;
		scroll-snap-type: x mandatory;
		padding: 4px 0;
		mask-image: linear-gradient(to right, transparent 0%, black 2.5%, black 97.5%, transparent 100%);
		align-items: flex-start;
	}

	.carousel-grid.centered {
		justify-content: center;
		overflow-x: visible;
		mask-image: none;
	}

	.carousel-grid::-webkit-scrollbar {
		display: none;
	}

	/* Carousel nav buttons */
	.carousel-btn {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.3);
		color: white;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 5;
		transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.carousel-btn:hover:not(:disabled) {
		background: rgba(255, 255, 255, 0.15);
		color: white;
		transform: translateY(-50%) scale(1.1);
	}

	.carousel-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
		pointer-events: none;
	}

	.carousel-btn.prev { left: -16px; }
	.carousel-btn.next { right: -16px; }

	/* Product item wrapper */
	.product-item {
		flex: 0 0 207px;
		scroll-snap-align: start;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		animation: fadeIn 0.5s ease-out calc(var(--idx) * 0.05s) both;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Product card */
	.product-card {
		width: 207px;
		height: 207px;
		border-radius: 8px;
		overflow: hidden;
		position: relative;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #111;
	}

	.product-card.basic {
		border: 1px solid rgba(255, 255, 255, 0.15);
	}

	.product-card.technical {
		border: 1px solid rgba(0, 149, 255, 0.3);
	}

	.product-card:hover {
		transform: scale(1.02);
	}

	.product-card img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.product-card svg {
		color: rgba(255, 255, 255, 0.3);
	}

	/* Product underline */
	.product-underline {
		width: 60%;
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
	}

	/* Product name */
	.product-name {
		font-size: 12px;
		color: rgba(255, 255, 255, 0.9);
		text-align: center;
		max-width: 207px;
		line-height: 1.4;
	}

	/* Pagination dots */
	.pagination-dots {
		display: flex;
		gap: 8px;
		justify-content: center;
		align-items: center;
		margin-top: 12px;
	}

	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.3);
		border: none;
		cursor: pointer;
		transition: all 0.3s ease;
		padding: 0;
	}

	.dot.active {
		background: rgba(255, 255, 255, 0.9);
		transform: scale(1.2);
	}

	.dot:hover:not(.active) {
		background: rgba(255, 255, 255, 0.5);
	}

	@media (max-width: 768px) {
		.product-item {
			flex: 0 0 203px;
		}

		.product-card {
			width: 203px;
			height: 203px;
		}

		.product-name {
			font-size: 11px;
			max-width: 203px;
		}

		.carousel-btn {
			display: none;
		}
	}
</style>
