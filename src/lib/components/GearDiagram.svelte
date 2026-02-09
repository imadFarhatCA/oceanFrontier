<script lang="ts">
	import HotspotPopup from './HotspotPopup.svelte';

	let activeHotspot: string | null = null;

	interface GearItem {
		id: string;
		title: string;
		subtitle: string;
		description: string;
		icon: string;
		position: { x: number; y: number }; // percentage positions
		labelPosition: 'left' | 'right';
	}

	const gearItems: GearItem[] = [
		{
			id: 'mask',
			title: 'MASK',
			subtitle: 'LOW VOLUME',
			description: 'Any low volume mask with a single or dual lense profile permitting for minimal use of gas to clear it out',
			icon: '/images/gear-icons/mask.svg',
			position: { x: 51, y: 9 },
			labelPosition: 'left'
		},
		{
			id: 'regulators',
			title: 'REGULATORS',
			subtitle: 'Backup & Primary',
			description: 'A secondary regulator on a bungee necklace to be reachable and used as backup. Primary connected via 1.5-2m hose.',
			icon: '/images/gear-icons/regulator.svg',
			position: { x: 56, y: 18 },
			labelPosition: 'right'
		},
		{
			id: 'suit',
			title: 'EXPOSURE SUIT',
			subtitle: 'Wet / Dry',
			description: 'Thermal protection suited to the dive environment. Wet suits for warm water, dry suits for cold water diving.',
			icon: '/images/gear-icons/mask.svg',
			position: { x: 55, y: 26 },
			labelPosition: 'right'
		},
		{
			id: 'wing',
			title: 'WING / BACKPLATE',
			subtitle: 'Buoyancy Compensator',
			description: 'Doughnut shaped wings are used for different configurations and lift capacities',
			icon: '/images/gear-icons/wing.svg',
			position: { x: 41, y: 37 },
			labelPosition: 'left'
		},
		{
			id: 'gauge',
			title: 'GAUGE',
			subtitle: 'Submersible Pressure Gauge',
			description: 'Submersible pressure gauges big in size, clear and can come in Imperial or Metric formats',
			icon: '/images/gear-icons/gauge.svg',
			position: { x: 54, y: 43 },
			labelPosition: 'right'
		},
		{
			id: 'computer',
			title: 'DIVE COMPUTER',
			subtitle: 'GAUGE or DIVE COMPUTER',
			description: 'Whether a depth gauge or dive computer, it is an essential tool to give the diver the ability to read the parameters of the dive',
			icon: '/images/gear-icons/dive-computer.svg',
			position: { x: 41, y: 53 },
			labelPosition: 'left'
		},
		{
			id: 'compass',
			title: 'COMPASS',
			subtitle: 'MAGNETIC OR DIGITAL',
			description: 'Any type of magnetic or digital compass, used for underwater navigation & bearing allocation. Some dive computers have a digital compass embedded.',
			icon: '/images/gear-icons/compass.svg',
			position: { x: 53, y: 58 },
			labelPosition: 'right'
		},
		{
			id: 'pockets',
			title: 'POCKETS ACCESSORIES',
			subtitle: 'Storage & Tools',
			description: 'Pockets and accessories for carrying essential tools, slates, reels, and other dive accessories',
			icon: '/images/gear-icons/compass.svg',
			position: { x: 53, y: 70 },
			labelPosition: 'right'
		},
		{
			id: 'fins',
			title: 'FINS',
			subtitle: 'RIGID RUBBER',
			description: 'Rigid rubber compound fins facilitating finning technics, while minimizing effort. Heel springs for ease of use, wide stiff blade for better backward frog kick control',
			icon: '/images/gear-icons/fins.svg',
			position: { x: 46, y: 90 },
			labelPosition: 'left'
		}
	];

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
				style="left: {item.position.x}%; top: {item.position.y}%; --delay: {i * 0.08}s;"
				on:click={() => toggleHotspot(item.id)}
				aria-label={item.title}
			>
				<span class="hotspot-pulse"></span>
				<span class="hotspot-dot"></span>
				<img class="hotspot-icon" src={item.icon} alt={item.title} />
			</button>

			{#if activeHotspot === item.id}
				<HotspotPopup
					icon={item.icon}
					title={item.title}
					subtitle={item.subtitle}
					description={item.description}
					side={item.labelPosition}
					x={item.position.x}
					y={item.position.y}
				/>
			{/if}
		{/each}
	</div>
</div>

<style>
	.gear-diagram-container {
		width: 100%;
		padding: 60px 0 60px 50px;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		animation: chunkFadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.6s backwards;
	}

	.diagram-wrapper {
		position: relative;
		width: 100%;
		max-width: 700px;
		aspect-ratio: 16 / 10;
	}

	.silhouette {
		width: 100%;
		height: 100%;
		object-fit: contain;
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

	.hotspot.active .hotspot-dot {
		background: white;
		border-color: rgba(0, 162, 255, 1);
		transform: translate(-50%, -50%) scale(1.3);
	}

	.hotspot-icon {
		position: absolute;
		top: 50%;
		left: calc(100% + 8px);
		transform: translateY(-50%);
		width: 20px;
		height: 20px;
		opacity: 0.7;
		pointer-events: none;
		transition: opacity 0.3s ease;
		filter: invert(1);
	}

	.hotspot:hover .hotspot-icon,
	.hotspot.active .hotspot-icon {
		opacity: 1;
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
			padding: 40px 20px 40px 5%;
		}

		.diagram-wrapper {
			max-width: 100%;
		}

		.hotspot-icon {
			width: 16px;
			height: 16px;
			left: calc(100% + 6px);
		}
	}
</style>
