<script lang="ts">
	let { children } = $props();
</script>

<svelte:head>
	<!-- Website Control Panel Analytics — replace data-key and data-endpoint with values from Settings -->
	<script
		src="https://website-control-panel.pages.dev/tracker.js"
		data-key="wcp_ffdccebbb511dd0c0689f038e07f887bb6d7b9b1"
		data-endpoint="https://website-control-panel.pages.dev/api/track"
		defer
	></script>
</svelte:head>

{@render children()}
