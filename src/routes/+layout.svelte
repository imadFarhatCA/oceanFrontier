<script lang="ts">
	let { children } = $props();
</script>

<svelte:head>
	<script src="https://website-control-panel.pages.dev/tracker.js"></script>
</svelte:head>

{@render children()}
