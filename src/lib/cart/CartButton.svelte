<script lang="ts">
	import { cartCount, isCartOpen } from './cartStore';

	function toggleCart() {
		isCartOpen.update((v) => !v);
	}
</script>

{#if !$isCartOpen}
<button class="cart-button" on:click={toggleCart} aria-label="Shopping cart">
	<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
		<circle cx="9" cy="21" r="1"></circle>
		<circle cx="20" cy="21" r="1"></circle>
		<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
	</svg>
	{#if $cartCount > 0}
		<span class="cart-badge">{$cartCount}</span>
	{/if}
</button>
{/if}

<style>
	.cart-button {
		position: fixed;
		bottom: 28px;
		right: 28px;
		width: 52px;
		height: 52px;
		border-radius: 50%;
		border: 1px solid rgba(255, 255, 255, 0.15);
		background: rgb(42, 42, 42);
		color: white;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 400;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
		transition: transform 0.2s ease, background 0.2s ease;
	}

	.cart-button:hover {
		transform: scale(1.08);
		background: rgba(50, 50, 50, 0.98);
		border-color: rgba(255, 255, 255, 0.25);
	}

	.cart-badge {
		position: absolute;
		top: -4px;
		right: -4px;
		min-width: 20px;
		height: 20px;
		border-radius: 10px;
		background: rgba(0, 162, 255, 1);
		color: white;
		font-size: 11px;
		font-weight: 700;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 5px;
		line-height: 1;
	}

	@media (max-width: 768px) {
		.cart-button {
			bottom: 20px;
			right: 20px;
			width: 48px;
			height: 48px;
		}
	}
</style>
