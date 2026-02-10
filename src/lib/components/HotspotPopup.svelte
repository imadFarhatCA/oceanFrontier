<script lang="ts">
	import { createEventDispatcher, onMount, afterUpdate } from 'svelte';

	export let id: string;
	export let icon: string;
	export let title: string;
	export let subtitle: string;
	export let description: string;
	export let products: { name: string; image: string; category: 'basic' | 'technical' }[] = [];
	export let brands: string[] = [];

	$: cleanTitle = title.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

	const dispatch = createEventDispatcher();

	let productsGrid: HTMLDivElement;
	let overlayEl: HTMLDivElement;
	let activeIndex = 0;
	let needsScrolling = false;
	let isAtStart = true;
	let isAtEnd = false;

	function close() {
		dispatch('close');
	}

	function handleOverlayClick(e: MouseEvent) {
		if (e.target === e.currentTarget) close();
	}

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
			const itemWidth = children[0].offsetWidth + 12;
			productsGrid.scrollTo({
				left: index * itemWidth,
				behavior: 'smooth'
			});
		}
	}

	onMount(() => {
		// Portal to body so position:fixed works regardless of parent transforms
		document.body.appendChild(overlayEl);

		if (productsGrid) {
			updateActiveIndex();
			checkScrollability();
			productsGrid.addEventListener('scroll', updateActiveIndex);
			window.addEventListener('resize', checkScrollability);
		}

		return () => {
			productsGrid?.removeEventListener('scroll', updateActiveIndex);
			window.removeEventListener('resize', checkScrollability);
			if (overlayEl?.parentNode) {
				overlayEl.parentNode.removeChild(overlayEl);
			}
		};
	});
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="modal-overlay" bind:this={overlayEl} on:click={handleOverlayClick}>
	<div class="modal-card">
		<button class="close-button" on:click={close} aria-label="Close">
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<line x1="18" y1="6" x2="6" y2="18"></line>
				<line x1="6" y1="6" x2="18" y2="18"></line>
			</svg>
		</button>

		<div class="modal-header">
			<img class="modal-icon" src={icon} alt={title} />
			<div class="icon-line"></div>
			<h3 class="modal-title" class:lights-title={id === 'lights'} class:computer-title={id === 'computer'}>{cleanTitle}</h3>
			<p class="modal-subtitle">{subtitle}</p>
		</div>

		<p class="modal-description">{@html description}</p>

		{#if products.length > 0}
			<div class="carousel-section">
				{#if brands.length > 0}
					<div class="modal-brands">
						{#each brands as brand}
							<img src="/images/brands/{brand}" alt={brand.replace('.svg', '')} class="modal-brand-logo {brand.includes('suunto') ? 'suunto-logo' : ''} {brand.includes('suex') ? 'suex-logo' : ''}" />
						{/each}
					</div>
				{/if}
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
								aria-label="Go to item {i + 1}"
							></button>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	/* Full-screen overlay */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(4px);
		z-index: 500;
		display: flex;
		align-items: center;
		justify-content: center;
		animation: overlayFadeIn 0.3s ease forwards;
		padding: 20px;
	}

	@keyframes overlayFadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	/* Modal card */
	.modal-card {
		background: rgba(42, 42, 42, 0.98);
		backdrop-filter: blur(20px);
		border-radius: 24px;
		padding: 48px 36px;
		max-width: 560px;
		width: 100%;
		position: relative;
		box-shadow:
			0 20px 60px rgba(0, 0, 0, 0.3),
			0 8px 24px rgba(0, 0, 0, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
		animation: modalSlideIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
		max-height: 90vh;
		min-height: 420px;
		overflow-y: auto;
		scrollbar-width: none;
	}

	.modal-card::-webkit-scrollbar {
		display: none;
	}

	@keyframes modalSlideIn {
		0% {
			opacity: 0;
			transform: scale(0.96);
			filter: blur(4px);
		}
		60% { filter: blur(0); }
		100% {
			opacity: 1;
			transform: scale(1);
			filter: blur(0);
		}
	}

	/* Close button */
	.close-button {
		position: absolute;
		top: 16px;
		right: 16px;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		border: none;
		background: rgba(255, 255, 255, 0.08);
		color: rgba(255, 255, 255, 0.6);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
		z-index: 10;
	}

	.close-button:hover {
		background: rgba(255, 255, 255, 0.15);
		color: white;
		transform: scale(1.1) rotate(90deg);
	}

	/* Header — centered vertically */
	.modal-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		margin-bottom: 20px;
		gap: 8px;
	}

	.modal-icon {
		width: 48px;
		height: 48px;
		flex-shrink: 0;
		filter: invert(1);
	}

	/* 20px line under icon */
	.icon-line {
		width: 20px;
		height: 1px;
		background: rgba(255, 255, 255, 0.3);
		margin: 4px 0;
	}

	.modal-title {
		font-size: 22px;
		font-weight: 700;
		color: rgba(0, 162, 255, 1);
		margin: 0;
		letter-spacing: 0.5px;
	}

	.modal-subtitle {
		font-size: 11px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.5);
		margin: 0;
		letter-spacing: 1px;
		text-transform: uppercase;
	}

	/* Description — centered */
	.modal-description {
		font-size: 14px;
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.7);
		margin: 0 0 28px 0;
		text-align: center;
	}

	/* Brand logos strip */
	.modal-brands {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 32px;
		margin-bottom: 24px;
	}

	.modal-brand-logo {
		height: 42px;
		width: auto;
		object-fit: contain;
		filter: invert(1) brightness(1.1);
		opacity: 0.28;
	}

	.modal-brand-logo.suunto-logo {
		height: 84px;
	}

	.modal-brand-logo.suex-logo {
		height: 28px;
	}

	.carousel-section {
		border-top: none;
		padding-top: 0;
		position: relative;
	}

	.carousel-wrapper {
		position: relative;
	}

	.carousel-grid {
		display: flex;
		gap: 12px;
		overflow-x: auto;
		scroll-behavior: smooth;
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
		width: 32px;
		height: 32px;
		border-radius: 50%;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(255, 255, 255, 0.06);
		color: rgba(255, 255, 255, 0.6);
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
		transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
		cursor: default;
	}

	.product-item:hover {
		transform: translateY(-4px);
	}

	/* Product card — image fills the whole square */
	.product-card {
		width: 207px;
		height: 207px;
		min-height: 207px;
		max-height: 207px;
		flex-shrink: 0;
		border-radius: 10px;
		overflow: hidden;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgba(255, 255, 255, 0.2);
	}

	.product-card img {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* Basic category — light grey */
	.product-card.basic {
		background: rgba(200, 200, 200, 0.12);
	}

	/* Technical category — dark/black */
	.product-card.technical {
		background: rgba(10, 10, 10, 0.85);
	}

	/* Hover underline — sits between card and name with equal spacing */
	.product-underline {
		width: 60%;
		height: 1px;
		background: rgba(255, 255, 255, 0.5);
		margin: 10px auto;
		transform: scaleX(0);
		transition: transform 0.3s ease;
	}

	.product-item:hover .product-underline {
		transform: scaleX(1);
	}

	/* Name outside the card — all names start at same vertical position */
	.product-name {
		font-size: 13px;
		font-weight: 400;
		color: rgba(255, 255, 255, 0.8);
		text-align: center;
		line-height: 1.3;
		letter-spacing: 0.3px;
		max-width: 207px;
	}

	/* Instagram-style pagination dots */
	.pagination-dots {
		display: flex;
		justify-content: center;
		gap: 8px;
		margin-top: 16px;
	}

	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		border: none;
		background: rgba(255, 255, 255, 0.25);
		cursor: pointer;
		padding: 0;
		transition: all 0.3s ease;
	}

	.dot.active {
		background: rgba(0, 162, 255, 1);
		transform: scale(1.2);
	}

	.dot:hover:not(.active) {
		background: rgba(255, 255, 255, 0.5);
	}

	@media (max-width: 768px) {
		.modal-card {
			padding: 36px 24px;
			max-width: 92vw;
			border-radius: 20px;
			max-height: 90vh;
			min-height: 520px;
		}

		.modal-icon {
			width: 40px;
			height: 40px;
		}

		.modal-title {
			font-size: 18px;
		}

		.modal-title.lights-title {
			margin-top: -30px;
		}

		.modal-title.computer-title {
			margin-top: -10px;
		}

		.modal-description {
			font-size: 13px;
		}

		.product-item {
			flex: 0 0 203px;
		}

		.product-card {
			width: 203px;
			height: 203px;
			min-height: 203px;
			max-height: 203px;
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
