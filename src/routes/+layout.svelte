<script lang="ts">
	let { children } = $props();
</script>

<svelte:head>
	<!-- Website Control Panel Analytics — replace data-key and data-endpoint with values from Settings -->
	<script
		src="https://CONTROL_PANEL_URL/tracker.js"
		data-key="OCEAN_FRONTIER_API_KEY"
		data-endpoint="https://CONTROL_PANEL_URL/api/track"
		defer
	></script>
</svelte:head>

{@render children()}
