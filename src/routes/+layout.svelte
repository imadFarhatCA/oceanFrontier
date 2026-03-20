<script lang="ts">
	import WebsiteTracker from '$lib/components/WebsiteTracker.svelte';
	import CartButton from '$lib/cart/CartButton.svelte';
	import CartDrawer from '$lib/cart/CartDrawer.svelte';
	let { children } = $props();
</script>

<WebsiteTracker />
<CartButton />
<CartDrawer />
{@render children()}
