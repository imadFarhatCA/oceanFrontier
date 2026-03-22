<script lang="ts">
	import type { GearProduct } from '$lib/data/gearItems';
	import { cart } from '$lib/cart/cartStore';

	export let products: GearProduct[] = [];

	function addProductToCart(product: GearProduct) {
		cart.addItem({
			type: 'gear',
			id: product.id ?? product.name.toLowerCase().replace(/\s+/g, '-'),
			name: product.name,
			image: product.image,
			price: product.price ?? 0
		});
	}

	let activeIndex = -1;
	let initialized = false;

	$: if (products.length > 0 && !initialized) {
		activeIndex = Math.floor(products.length / 2);
		initialized = true;
	}

	$: isAtStart = activeIndex === 0;
	$: isAtEnd = activeIndex === products.length - 1;
	$: prevProduct = activeIndex > 0 ? products[activeIndex - 1] : null;
	$: currentProduct = products[activeIndex];
	$: nextProduct = activeIndex < products.length - 1 ? products[activeIndex + 1] : null;

	function go(direction: 'prev' | 'next') {
		if (direction === 'next' && !isAtEnd) activeIndex++;
		if (direction === 'prev' && !isAtStart) activeIndex--;
	}

	function goToItem(index: number) {
		activeIndex = Math.max(0, Math.min(index, products.length - 1));
	}

	// Swipe support
	let touchStartX = 0;
	let touchStartY = 0;
	let swiping = false;

	function handleTouchStart(e: TouchEvent) {
		touchStartX = e.touches[0].clientX;
		touchStartY = e.touches[0].clientY;
		swiping = true;
	}

	function handleTouchEnd(e: TouchEvent) {
		if (!swiping) return;
		swiping = false;
		const dx = e.changedTouches[0].clientX - touchStartX;
		const dy = e.changedTouches[0].clientY - touchStartY;
		// Only trigger if horizontal swipe is dominant and > 40px
		if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
			if (dx < 0) go('next');
			else go('prev');
		}
	}
</script>

<div class="carousel-section">
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="carousel-track" on:touchstart={handleTouchStart} on:touchend={handleTouchEnd}>
		<!-- Previous item (left side) -->
		<div class="side-item side-left" class:empty={!prevProduct}>
			{#if prevProduct}
				<button class="side-card" on:click={() => go('prev')}>
					{#if prevProduct.image}
						<img src={prevProduct.image} alt={prevProduct.name} loading="lazy" />
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
					{/if}
				</button>
			{/if}
		</div>

		<!-- Active center item -->
		{#if currentProduct}
			{#key activeIndex}
				<div class="center-item">
					<div class="product-card">
						{#if currentProduct.image}
							<img src={currentProduct.image} alt={currentProduct.name} loading="lazy" />
						{:else}
							<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
						{/if}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div class="cart-overlay" role="button" tabindex="0" on:click|stopPropagation={() => addProductToCart(currentProduct)} aria-label="Add {currentProduct.name} to cart">
							<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
						</div>
					</div>
					<div class="product-underline"></div>
					<span class="product-name">{currentProduct.name}</span>
					{#if currentProduct.price}
						<button class="product-cart-btn" on:click|stopPropagation={() => addProductToCart(currentProduct)} aria-label="Add {currentProduct.name} to cart">
							<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
								<line x1="12" y1="5" x2="12" y2="19"></line>
								<line x1="5" y1="12" x2="19" y2="12"></line>
							</svg>
							Add to Cart
						</button>
					{/if}
				</div>
			{/key}
		{/if}

		<!-- Next item (right side) -->
		<div class="side-item side-right" class:empty={!nextProduct}>
			{#if nextProduct}
				<button class="side-card" on:click={() => go('next')}>
					{#if nextProduct.image}
						<img src={nextProduct.image} alt={nextProduct.name} loading="lazy" />
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
					{/if}
				</button>
			{/if}
		</div>
	</div>

	{#if products.length > 1}
		<div class="nav-row">
			<button
				class="nav-arrow"
				on:click={() => go('prev')}
				aria-label="Previous"
				disabled={isAtStart}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
			</button>
			<div class="product-counter">
				<div class="product-dots">
					{#each products as _, i}
						<button
							class="product-dot"
							class:active={i === activeIndex}
							on:click={() => goToItem(i)}
							aria-label="Go to product {i + 1}"
						></button>
					{/each}
				</div>
				<span class="product-counter-text">{activeIndex + 1}/{products.length}</span>
			</div>
			<button
				class="nav-arrow"
				on:click={() => go('next')}
				aria-label="Next"
				disabled={isAtEnd}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
			</button>
		</div>
	{/if}
</div>

<style>
	.carousel-section {
		border-top: none;
		padding-top: 0;
		position: relative;
	}

	/* 3-item track: side - center - side */
	.carousel-track {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16px;
		margin-bottom: 16px;
		overflow: hidden;
		padding: 8px 0;
	}

	/* Side items — smaller, faded, clickable */
	.side-item {
		flex: 0 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: opacity 0.3s ease;
	}

	.side-item.empty {
		width: 150px;
	}

	.side-card {
		width: 150px;
		height: 150px;
		border-radius: 8px;
		overflow: hidden;
		background: #111;
		border: 1px solid rgba(255, 255, 255, 0.08);
		opacity: 0.45;
		transform: scale(0.9);
		transition: all 0.3s ease;
		cursor: pointer;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.side-card:hover {
		opacity: 0.7;
		transform: scale(0.95);
	}

	.side-card img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.side-card svg {
		color: rgba(255, 255, 255, 0.2);
	}

	/* Center active item */
	.center-item {
		flex: 0 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		animation: itemFadeIn 0.3s ease-out both;
	}

	@keyframes itemFadeIn {
		from {
			opacity: 0;
			transform: scale(0.96);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	/* Product card */
	.product-card {
		width: 200px;
		height: 200px;
		border-radius: 8px;
		overflow: hidden;
		position: relative;
		transition: transform 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #111;
		border: 1px solid rgba(255, 255, 255, 0.1);
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
		max-width: 200px;
		line-height: 1.4;
	}

	/* Add to cart button */
	.product-cart-btn {
		display: flex;
		align-items: center;
		gap: 5px;
		padding: 5px 12px;
		border: 1px solid rgba(0, 162, 255, 0.4);
		border-radius: 6px;
		background: rgba(0, 162, 255, 0.1);
		color: rgba(0, 162, 255, 0.9);
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.5px;
		text-transform: uppercase;
		cursor: pointer;
		transition: all 0.2s ease;
		margin-top: 2px;
	}

	.product-cart-btn:hover {
		background: rgba(0, 162, 255, 0.2);
		border-color: rgba(0, 162, 255, 0.6);
		color: rgba(0, 162, 255, 1);
	}

	/* Navigation row — arrows flanking dots */
	.nav-row {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16px;
		margin-top: 4px;
	}

	.nav-arrow {
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.2);
		color: rgba(255, 255, 255, 0.7);
		width: 28px;
		height: 28px;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
		padding: 0;
	}

	.nav-arrow:hover:not(:disabled) {
		background: rgba(255, 255, 255, 0.15);
		color: white;
	}

	.nav-arrow:disabled {
		opacity: 0.25;
		cursor: not-allowed;
		pointer-events: none;
	}

	/* Dots contrast override for dark background */
	.nav-row :global(.product-counter) {
		margin-top: 0;
	}

	.nav-row :global(.product-dots) {
		display: flex;
		align-items: center;
		gap: 6px;
	}

	.nav-row :global(.product-dot) {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.3);
		border: none;
		padding: 0;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.nav-row :global(.product-dot.active) {
		width: 18px;
		border-radius: 3px;
		background: rgba(255, 255, 255, 0.9);
	}

	.nav-row :global(.product-counter-text) {
		font-size: 11px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.5);
		letter-spacing: 0.5px;
	}

	/* Cart hover overlay */
	.cart-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.55);
		opacity: 0;
		transition: opacity 0.2s ease;
		cursor: pointer;
		border-radius: 8px;
	}

	.product-card:hover .cart-overlay {
		opacity: 1;
	}

	@media (max-width: 768px) {
		.side-card {
			width: 110px;
			height: 110px;
		}

		.side-item.empty {
			width: 110px;
		}

		.product-card {
			width: 160px;
			height: 160px;
		}

		.product-name {
			font-size: 11px;
			max-width: 160px;
		}

		.carousel-track {
			gap: 10px;
		}
	}
</style>
