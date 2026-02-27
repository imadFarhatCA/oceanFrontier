<script lang="ts">
	let { children } = $props();
</script>

<svelte:head>
	<script
		src="https://website-control-panel.pages.dev/tracker.js"
		data-key="wcp_7b33239d466c0391cb8d45258d919135cc2600c5"
		data-endpoint="https://website-control-panel.pages.dev/api/track"
		defer
	></script>
</svelte:head>

{@render children()}
