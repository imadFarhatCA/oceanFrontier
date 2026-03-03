<script lang="ts">
	import WebsiteTracker from '$lib/components/WebsiteTracker.svelte';
	let { children } = $props();
</script>

<WebsiteTracker />
{@render children()}
