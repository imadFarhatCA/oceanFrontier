<script lang="ts">
	import HotspotPopup from './HotspotPopup.svelte';
	import { gearItems } from '$lib/data/gearItems';

	let activeHotspot: string | null = null;

	function toggleHotspot(id: string) {
		activeHotspot = activeHotspot === id ? null : id;
	}
</script>

<div class="gear-diagram-container">
	<div class="diagram-wrapper">
		<!-- Silhouette Image -->
		<img
			src="/images/gear-silhouette.png"
			alt="Diver silhouette with gear"
			class="silhouette"
		/>

		<!-- Hotspots and Labels -->
		{#each gearItems as item, i}
			<button
				class="hotspot"
				class:active={activeHotspot === item.id}
				data-id={item.id}
				style="left: {item.position.x}%; top: {item.position.y}%; --delay: {i * 0.08}s;"
				on:click={() => toggleHotspot(item.id)}
				aria-label={item.title}
			>
				<span class="hotspot-pulse"></span>
				<span class="hotspot-dot"></span>
				<span class="hotspot-label {item.labelPosition}">{@html item.title}</span>
			</button>

			{/each}

	</div>
</div>

{#each gearItems as item}
	{#if activeHotspot === item.id}
		<HotspotPopup
			id={item.id}
			icon={item.icon}
			title={item.title}
			subtitle={item.subtitle}
			description={item.description}
			products={item.products}
			brands={item.brands}
			on:close={() => activeHotspot = null}
		/>
	{/if}
{/each}

<style>
	.gear-diagram-container {
		width: 100%;
		padding: 60px 0 80px 0;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		animation: chunkFadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.6s backwards;
		margin-left: 20px;
	}

	/* Mobile-only line breaks (hidden on desktop) */
	:global(.mobile-br) {
		display: none;
	}
	:global(.desktop-only) {
		display: inline;
	}

	.diagram-wrapper {
		position: relative;
		width: 450px;
		aspect-ratio: 396 / 500;
	}

	.silhouette {
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 1;
	}

	/* Hotspot Button */
	.hotspot {
		position: absolute;
		width: 16px;
		height: 16px;
		transform: translate(-50%, -50%);
		background: none;
		border: none;
		cursor: pointer;
		z-index: 10;
		opacity: 0;
		animation: hotspotFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
		animation-delay: calc(0.8s + var(--delay));
	}

	.hotspot-dot {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 12px;
		height: 12px;
		background: rgba(0, 162, 255, 0.9);
		border: 2px solid white;
		border-radius: 50%;
		box-shadow: 0 2px 8px rgba(0, 162, 255, 0.4);
		transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.hotspot:hover .hotspot-dot {
		transform: translate(-50%, -50%) scale(2);
		box-shadow: 0 2px 16px rgba(0, 162, 255, 0.7);
	}

	.hotspot.active .hotspot-dot {
		background: white;
		border-color: rgba(0, 162, 255, 1);
		transform: translate(-50%, -50%) scale(1.3);
	}

	.hotspot:hover .hotspot-pulse {
		animation: none;
		opacity: 0;
	}

	/* Label — always visible */
	.hotspot-label {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		white-space: nowrap;
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 1px;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.7);
		cursor: pointer;
		opacity: 0;
		animation: labelFadeIn 0.4s ease forwards;
		animation-delay: calc(1s + var(--delay));
		transition: color 0.25s ease;
		background: rgba(0, 0, 0, 0.4);
		padding: 3px 8px;
		border-radius: 4px;
	}

	.hotspot-label.right {
		left: calc(100% + 12px);
	}

	.hotspot-label.left {
		right: calc(100% + 12px);
	}

	.hotspot:hover .hotspot-label,
	.hotspot-label:hover {
		color: rgba(255, 255, 255, 1);
		background: rgba(0, 0, 0, 0.55);
	}

	@keyframes labelFadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.hotspot-pulse {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 12px;
		height: 12px;
		background: rgba(0, 162, 255, 0.4);
		border-radius: 50%;
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	@keyframes pulse {
		0%, 100% {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1);
		}
		50% {
			opacity: 0;
			transform: translate(-50%, -50%) scale(2.5);
		}
	}

	@keyframes hotspotFadeIn {
		from {
			opacity: 0;
			transform: translate(-50%, -50%) scale(0);
		}
		to {
			opacity: 1;
			transform: translate(-50%, -50%) scale(1);
		}
	}

	@media (max-width: 768px) {
		.gear-diagram-container {
			padding: 20px 0 160px 0;
			justify-content: center;
			overflow: visible;
			margin-left: 0;
		}

		.diagram-wrapper {
			width: 70vw;
			max-width: 320px;
		}

		.hotspot[data-id="gauge"] {
			margin-top: -10px;
			margin-left: -5px;
		}

		.hotspot[data-id="lights"] {
			margin-top: -10px;
		}

		.hotspot[data-id="computer"] {
			margin-top: 15px;
		}

		:global(.mobile-br) {
			display: inline;
		}
		:global(.desktop-only) {
			display: none;
		}
	}
</style>
