<script lang="ts">
	import { cart, cartCount, cartTotal, isCartOpen } from './cartStore';
	import type { CartItem } from './cartStore';
	import { fly, fade } from 'svelte/transition';

	const TURNSTILE_SITE_KEY = '0x4AAAAAACumGj3Wq8ivI4Fk'; // replace with your Cloudflare Turnstile site key

	let checkoutStep = false;
	let email = '';
	let phone = '';
	let whatsapp = '';
	let submitted = false;
	let submitting = false;
	let submitError = '';
	let turnstileToken = '';

	function close() {
		isCartOpen.set(false);
		checkoutStep = false;
		submitted = false;
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

	function onTurnstileSuccess(token: string) {
		turnstileToken = token;
	}

	if (typeof window !== 'undefined') {
		(window as any).onTurnstileVerified = onTurnstileSuccess;
	}

	async function submitInquiry() {
		if (!turnstileToken || submitting) return;
		submitting = true;
		submitError = '';

		try {
			const res = await fetch('/api/inquiry', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email,
					phone,
					whatsapp,
					turnstileToken,
					items: $cart.map(i => ({ name: i.name, type: i.type, quantity: i.quantity }))
				})
			});

			const data = await res.json();
			if (data.success) {
				submitted = true;
			} else {
				submitError = data.error ?? 'Something went wrong. Please try again.';
			}
		} catch {
			submitError = 'Network error. Please try again.';
		} finally {
			submitting = false;
		}
	}
</script>

{#if $isCartOpen}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="cart-overlay" on:click={handleOverlayClick} transition:fade={{ duration: 150 }}>
		<div class="cart-drawer" transition:fly={{ x: 360, duration: 200 }}>
			<!-- Header -->
			<div class="cart-header">
				{#if checkoutStep}
					<button class="back-btn" on:click={() => { checkoutStep = false; submitted = false; }} aria-label="Back to cart">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
					</button>
					<h2>Submit Inquiry</h2>
				{:else}
					<h2>Your Cart</h2>
				{/if}
				<button class="cart-close" on:click={close} aria-label="Close cart">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
			</div>

			{#if checkoutStep}
				<!-- Checkout form -->
				<div class="checkout-panel">
					{#if submitted}
						<div class="submitted-state" in:fade={{ duration: 200 }}>
							<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#30d158" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
							<h3>Inquiry Received</h3>
							<p>We'll review your request, check availability, and get back to you with the best options and next steps.</p>
							<button class="checkout-btn" on:click={close}>Close</button>
						</div>
					{:else}
						<div class="consulting-notice">
							<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(0,162,255,0.8)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
							<div>
								<p>We are not a retail shop — we are a <strong>consulting partner</strong>. Once you submit your inquiry, we will review your order, check availability, provide options, and advise on how to best proceed with delivery and shipping.</p>
								<ul>
									<li>For <strong>classes</strong>, we will check availability of spots or find potential dates that work for everyone.</li>
									<li>For <strong>gear</strong>, we will assess your needs and advise on the best option for you.</li>
								</ul>
							</div>
						</div>

						<div class="inquiry-form">
							<label for="inq-email">Email</label>
							<input id="inq-email" type="email" placeholder="your@email.com" bind:value={email} />

							<label for="inq-phone">Phone Number</label>
							<input id="inq-phone" type="tel" placeholder="+1 234 567 890" bind:value={phone} />

							<label for="inq-whatsapp">WhatsApp Number</label>
							<input id="inq-whatsapp" type="tel" placeholder="+1 234 567 890" bind:value={whatsapp} />
						</div>

						<div
							class="cf-turnstile"
							data-sitekey={TURNSTILE_SITE_KEY}
							data-callback="onTurnstileVerified"
							data-theme="dark"
						></div>

						<div class="checkout-footer">
							{#if submitError}
								<p class="submit-error">{submitError}</p>
							{/if}
							<button class="checkout-btn" on:click={submitInquiry} disabled={!email || !turnstileToken || submitting}>
								{submitting ? 'Submitting…' : 'Submit Inquiry'}
							</button>
						</div>
					{/if}
				</div>
			{:else}
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
								<div class="item-meta">
									<span class="item-name">{item.name}</span>
									<span class="item-type">{item.type === 'course' ? 'Course' : 'Gear'}</span>
									<div class="item-bottom">
										<span class="item-price">{formatPrice(item.price)}</span>
										<div class="qty-controls">
											<button on:click={() => updateQty(item, -1)} aria-label="Decrease quantity">−</button>
											<span>{item.quantity}</span>
											<button on:click={() => updateQty(item, 1)} aria-label="Increase quantity">+</button>
										</div>
									</div>
								</div>
								<button class="item-remove" on:click={() => removeItem(item)} aria-label="Remove item">
									<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
										<polyline points="3 6 5 6 21 6"></polyline>
										<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
									</svg>
								</button>
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
						<button class="checkout-btn" on:click={() => checkoutStep = true}>Proceed to Checkout</button>
						<button class="clear-btn" on:click={() => cart.clear()}>Clear Cart</button>
					</div>
				{/if}
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
		align-items: flex-start;
		gap: 14px;
		padding: 16px 24px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.06);
	}

	.cart-item:last-child {
		border-bottom: none;
	}

	.item-image {
		width: 72px;
		height: 72px;
		border-radius: 10px;
		overflow: hidden;
		flex-shrink: 0;
		background: rgba(255, 255, 255, 0.06);
	}

	.item-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.item-image-placeholder {
		width: 100%;
		height: 100%;
	}

	.item-meta {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 3px;
		padding-top: 2px;
	}

	.item-name {
		font-size: 14px;
		font-weight: 600;
		color: white;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: 1.3;
	}

	.item-type {
		font-size: 11px;
		color: rgba(255, 255, 255, 0.4);
		font-weight: 400;
	}

	.item-bottom {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 8px;
	}

	.item-price {
		font-size: 14px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.85);
	}

	/* Quantity controls */
	.qty-controls {
		display: flex;
		align-items: center;
		gap: 12px;
		background: rgba(255, 255, 255, 0.07);
		border-radius: 8px;
		padding: 4px 8px;
	}

	.qty-controls button {
		width: 20px;
		height: 20px;
		border: none;
		background: transparent;
		color: rgba(255, 255, 255, 0.6);
		font-size: 16px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		transition: color 0.15s ease;
		line-height: 1;
	}

	.qty-controls button:hover {
		color: white;
	}

	.qty-controls span {
		font-size: 13px;
		font-weight: 600;
		color: white;
		min-width: 16px;
		text-align: center;
	}

	.item-remove {
		border: none;
		background: transparent;
		color: rgba(255, 255, 255, 0.2);
		cursor: pointer;
		padding: 4px;
		display: flex;
		align-items: flex-start;
		flex-shrink: 0;
		transition: color 0.2s ease;
		margin-top: 2px;
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

	/* Back button */
	.back-btn {
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
		transition: background 0.15s ease;
		flex-shrink: 0;
	}

	.back-btn:hover {
		background: rgba(255, 255, 255, 0.15);
		color: white;
	}

	/* Checkout panel */
	.checkout-panel {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		padding: 24px;
		gap: 20px;
	}

	.consulting-notice {
		display: flex;
		gap: 12px;
		align-items: flex-start;
		background: rgba(0, 162, 255, 0.07);
		border: 1px solid rgba(0, 162, 255, 0.2);
		border-radius: 10px;
		padding: 14px;
	}

	.consulting-notice svg {
		flex-shrink: 0;
		margin-top: 1px;
	}

	.consulting-notice p {
		font-size: 12.5px;
		color: rgba(255, 255, 255, 0.65);
		line-height: 1.6;
		margin: 0 0 8px;
	}

	.consulting-notice ul {
		margin: 0;
		padding-left: 16px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.consulting-notice li {
		font-size: 12.5px;
		color: rgba(255, 255, 255, 0.55);
		line-height: 1.5;
	}

	.consulting-notice strong {
		color: rgba(255, 255, 255, 0.9);
	}

	.inquiry-form {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.inquiry-form label {
		font-size: 11px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.45);
		text-transform: uppercase;
		letter-spacing: 0.6px;
		margin-bottom: -4px;
	}

	.inquiry-form input {
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 8px;
		padding: 11px 14px;
		color: white;
		font-size: 14px;
		outline: none;
		transition: border-color 0.15s ease;
		width: 100%;
		box-sizing: border-box;
	}

	.inquiry-form input::placeholder {
		color: rgba(255, 255, 255, 0.25);
	}

	.inquiry-form input:focus {
		border-color: rgba(0, 162, 255, 0.5);
	}

	.checkout-footer {
		margin-top: auto;
	}

	/* Submitted state */
	.submitted-state {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		gap: 16px;
		padding: 24px;
	}

	.submitted-state h3 {
		font-size: 18px;
		font-weight: 600;
		color: white;
		margin: 0;
	}

	.submitted-state p {
		font-size: 13px;
		color: rgba(255, 255, 255, 0.55);
		line-height: 1.6;
		max-width: 260px;
	}

	.submit-error {
		font-size: 12px;
		color: rgba(255, 80, 80, 0.85);
		margin: 0 0 8px;
		text-align: center;
	}

	.checkout-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
		transform: none;
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
