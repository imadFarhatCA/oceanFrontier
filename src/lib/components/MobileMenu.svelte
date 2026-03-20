<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import { isMobileMenuOpen } from '$lib/stores/pageState';
	import { isCartOpen } from '$lib/cart/cartStore';

	export let onNavClick: (e: Event, target: string) => void;
	export let hidden: boolean = false;

	function toggleMobileMenu() {
		isMobileMenuOpen.update((v) => !v);
	}
</script>

<!-- Hamburger Button -->
<button
	class="hamburger-button"
	class:hidden={hidden || $isCartOpen}
	class:open={$isMobileMenuOpen}
	on:click={toggleMobileMenu}
	aria-label="Toggle menu"
>
	<span></span>
	<span></span>
	<span></span>
</button>

<!-- Mobile Menu Overlay -->
{#if $isMobileMenuOpen}
	<div class="mobile-menu-overlay" on:click={toggleMobileMenu}>
		<div class="mobile-menu-content" on:click|stopPropagation>
			<Nav
				variant="mobile"
				centered={false}
				activeLink={null}
				{onNavClick}
				onMobileClose={toggleMobileMenu}
			/>
			<div class="mobile-social">
				<a href="https://facebook.com" target="_blank" rel="noopener">FB</a>
				<span> . </span>
				<a href="https://linkedin.com" target="_blank" rel="noopener">IN</a>
				<span> . </span>
				<a href="mailto:info@oceanfrontier.com" class="mail-icon">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<rect x="2" y="4" width="20" height="16" rx="2" />
						<path d="m2 7 10 7 10-7" />
					</svg>
				</a>
			</div>
			<div class="mobile-contact-info">
				<span class="contact-location">Cyprus, Nicosia</span>
				<a href="tel:+35795119881" class="contact-phone">+357 95 119 881</a>
				<a
					href="https://www.oceanfrontier.com"
					target="_blank"
					rel="noopener"
					class="contact-website">www.oceanfrontier.com</a
				>
			</div>
		</div>
	</div>
{/if}
