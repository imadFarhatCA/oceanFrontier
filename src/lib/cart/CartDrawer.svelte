<script lang="ts">
	import { cart, cartCount, cartTotal, isCartOpen } from './cartStore';
	import type { CartItem } from './cartStore';
	import { fly, fade } from 'svelte/transition';

	function close() {
		isCartOpen.set(false);
	}

	function handleOverlayClick(e: MouseEvent) {
		if (e.target === e.currentTarget) close();
	}

	function removeItem(item: CartItem) {
		cart.removeItem(item.id, item.type);
	}

	function updateQty(item: CartItem, delta: number) {
		cart.updateQuantity(item.id, item.type, item.quantity + delta);
	}

	function formatPrice(amount: number): string {
		return new Intl.NumberFormat('en-EU', { style: 'currency', currency: 'EUR' }).format(amount);
	}
</script>

{#if $isCartOpen}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="cart-overlay" on:click={handleOverlayClick} transition:fade={{ duration: 150 }}>
		<div class="cart-drawer" transition:fly={{ x: 360, duration: 200 }}>
			<!-- Header -->
			<div class="cart-header">
				<h2>Your Cart</h2>
				<button class="cart-close" on:click={close} aria-label="Close cart">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
			</div>

			<!-- Items -->
			<div class="cart-items">
				{#if $cartCount === 0}
					<div class="cart-empty">
						<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
							<circle cx="9" cy="21" r="1"></circle>
							<circle cx="20" cy="21" r="1"></circle>
							<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
						</svg>
						<p>Your cart is empty</p>
					</div>
				{:else}
					{#each $cart as item (item.type + '-' + item.id)}
						<div class="cart-item">
							<div class="item-image">
								{#if item.image}
									<img src={item.image} alt={item.name} loading="lazy" />
								{:else}
									<div class="item-image-placeholder"></div>
								{/if}
							</div>
							<div class="item-details">
								<span class="item-type">{item.type === 'course' ? 'Course' : 'Gear'}</span>
								<span class="item-name">{item.name}</span>
								<span class="item-price">{formatPrice(item.price)}</span>
							</div>
							<div class="item-actions">
								<div class="qty-controls">
									<button on:click={() => updateQty(item, -1)} aria-label="Decrease quantity">−</button>
									<span>{item.quantity}</span>
									<button on:click={() => updateQty(item, 1)} aria-label="Increase quantity">+</button>
								</div>
								<button class="item-remove" on:click={() => removeItem(item)} aria-label="Remove item">
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<polyline points="3 6 5 6 21 6"></polyline>
										<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
									</svg>
								</button>
							</div>
						</div>
					{/each}
				{/if}
			</div>

			<!-- Footer -->
			{#if $cartCount > 0}
				<div class="cart-footer">
					<div class="cart-total">
						<span>Total</span>
						<span class="total-amount">{formatPrice($cartTotal)}</span>
					</div>
					<button class="checkout-btn">Proceed to Checkout</button>
					<button class="clear-btn" on:click={() => cart.clear()}>Clear Cart</button>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.cart-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
		z-index: 9999;
		display: flex;
		justify-content: flex-end;
	}

	.cart-drawer {
		width: 360px;
		max-width: 90vw;
		height: 100%;
		background: rgb(30, 30, 30);
		display: flex;
		flex-direction: column;
		border-left: 1px solid rgba(255, 255, 255, 0.08);
	}

	/* Header */
	.cart-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20px 24px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
	}

	.cart-header h2 {
		font-size: 18px;
		font-weight: 600;
		color: white;
		margin: 0;
		letter-spacing: 0.3px;
	}

	.cart-close {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		border: none;
		background: rgba(255, 255, 255, 0.08);
		color: rgba(255, 255, 255, 0.6);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.15s ease, color 0.15s ease;
	}

	.cart-close:hover {
		background: rgba(255, 255, 255, 0.15);
		color: white;
	}

	/* Items */
	.cart-items {
		flex: 1;
		overflow-y: auto;
		padding: 12px 0;
		scrollbar-width: none;
	}

	.cart-items::-webkit-scrollbar {
		display: none;
	}

	.cart-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		gap: 16px;
		color: rgba(255, 255, 255, 0.3);
	}

	.cart-empty p {
		font-size: 14px;
	}

	/* Cart Item */
	.cart-item {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 24px;
		transition: background 0.2s ease;
	}

	.cart-item:hover {
		background: rgba(255, 255, 255, 0.03);
	}

	.item-image {
		width: 56px;
		height: 56px;
		border-radius: 8px;
		overflow: hidden;
		flex-shrink: 0;
		background: #111;
	}

	.item-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.item-image-placeholder {
		width: 100%;
		height: 100%;
		background: rgba(255, 255, 255, 0.05);
	}

	.item-details {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.item-type {
		font-size: 9px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 1px;
		color: rgba(0, 162, 255, 0.8);
	}

	.item-name {
		font-size: 13px;
		color: rgba(255, 255, 255, 0.9);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.item-price {
		font-size: 12px;
		color: rgba(255, 255, 255, 0.5);
	}

	.item-actions {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 6px;
		flex-shrink: 0;
	}

	/* Quantity controls */
	.qty-controls {
		display: flex;
		align-items: center;
		gap: 8px;
		background: rgba(255, 255, 255, 0.06);
		border-radius: 6px;
		padding: 2px 4px;
	}

	.qty-controls button {
		width: 24px;
		height: 24px;
		border: none;
		background: transparent;
		color: rgba(255, 255, 255, 0.7);
		font-size: 14px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		transition: background 0.15s ease;
	}

	.qty-controls button:hover {
		background: rgba(255, 255, 255, 0.1);
		color: white;
	}

	.qty-controls span {
		font-size: 12px;
		font-weight: 600;
		color: white;
		min-width: 16px;
		text-align: center;
	}

	.item-remove {
		border: none;
		background: transparent;
		color: rgba(255, 255, 255, 0.3);
		cursor: pointer;
		padding: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: color 0.2s ease;
	}

	.item-remove:hover {
		color: rgba(255, 80, 80, 0.8);
	}

	/* Footer */
	.cart-footer {
		padding: 20px 24px;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.cart-total {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.cart-total span {
		font-size: 14px;
		color: rgba(255, 255, 255, 0.6);
	}

	.total-amount {
		font-size: 18px !important;
		font-weight: 700;
		color: white !important;
	}

	.checkout-btn {
		width: 100%;
		padding: 14px;
		border: none;
		border-radius: 10px;
		background: rgba(0, 162, 255, 1);
		color: white;
		font-size: 14px;
		font-weight: 600;
		letter-spacing: 0.3px;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.checkout-btn:hover {
		background: rgba(0, 140, 230, 1);
		transform: translateY(-1px);
	}

	.clear-btn {
		width: 100%;
		padding: 10px;
		border: none;
		border-radius: 8px;
		background: transparent;
		color: rgba(255, 255, 255, 0.4);
		font-size: 12px;
		cursor: pointer;
		transition: color 0.2s ease;
	}

	.clear-btn:hover {
		color: rgba(255, 80, 80, 0.7);
	}

	@media (max-width: 768px) {
		.cart-drawer {
			width: 100vw;
			max-width: 100vw;
			border-left: none;
		}

		.cart-header {
			padding: 24px 24px 20px;
			padding-top: max(24px, env(safe-area-inset-top));
		}
	}
</style>
