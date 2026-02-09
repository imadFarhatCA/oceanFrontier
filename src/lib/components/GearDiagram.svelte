<script lang="ts">
	import HotspotPopup from './HotspotPopup.svelte';

	let activeHotspot: string | null = null;

	interface Product {
		name: string;
		image: string;
		category: 'basic' | 'technical';
	}

	interface GearItem {
		id: string;
		title: string;
		subtitle: string;
		description: string;
		icon: string;
		position: { x: number; y: number };
		labelPosition: 'left' | 'right';
		products: Product[];
	}

	const gearItems: GearItem[] = [
		{
			id: 'hood',
			title: 'HOOD',
			subtitle: 'THERMAL PROTECTION',
			description: 'A neoprene hood to protect the head from cold water exposure and maintain core body temperature during dives',
			icon: '/images/gear-icons/hood.svg',
			position: { x: 62, y: 3 },
			labelPosition: 'right',
			products: [
				{ name: 'Waterproof H1 5/7mm', image: '', category: 'basic' },
				{ name: 'Fourth Element 5mm', image: '', category: 'basic' },
				{ name: 'Santi Flex 2.0', image: '', category: 'technical' }
			]
		},
		{
			id: 'mask',
			title: 'MASK',
			subtitle: 'LOW VOLUME',
			description: 'Any low volume mask with a single or dual lense profile permitting for minimal use of gas to clear it out',
			icon: '/images/gear-icons/mask.svg',
			position: { x: 35, y: 8 },
			labelPosition: 'left',
			products: [
				{ name: 'Omer Alien', image: '', category: 'basic' },
				{ name: 'Cressi Nano', image: '', category: 'basic' },
				{ name: 'OMS Tattoo', image: '', category: 'technical' },
				{ name: 'Halcyon H-View', image: '', category: 'technical' }
			]
		},
		{
			id: 'regulators',
			title: 'REGULATORS',
			subtitle: 'Backup & Primary',
			description: 'A secondary regulator on a bungee necklace to be reachable and used as backup. Primary connected via 1.5-2m hose.',
			icon: '/images/gear-icons/regulator.svg',
			position: { x: 68, y: 16 },
			labelPosition: 'right',
			products: [
				{ name: 'Apeks XTX50', image: '', category: 'basic' },
				{ name: 'Hollis 150LX', image: '', category: 'basic' },
				{ name: 'Halcyon H-75P', image: '', category: 'technical' },
				{ name: 'Apeks XTX200', image: '', category: 'technical' }
			]
		},
		{
			id: 'suit',
			title: 'EXPOSURE SUIT',
			subtitle: 'Wet / Dry',
			description: 'Thermal protection suited to the dive environment. Wet suits for warm water, dry suits for cold water diving.',
			icon: '/images/gear-icons/drysuit.svg',
			position: { x: 71, y: 26 },
			labelPosition: 'right',
			products: [
				{ name: 'Mares Rover 5mm', image: '', category: 'basic' },
				{ name: 'Waterproof W4 5mm', image: '', category: 'basic' },
				{ name: 'Santi E.Lite', image: '', category: 'technical' },
				{ name: 'DUI CF200X', image: '', category: 'technical' }
			]
		},
		{
			id: 'wing',
			title: 'WING / BACKPLATE',
			subtitle: 'Buoyancy Compensator',
			description: 'Doughnut shaped wings are used for different configurations and lift capacities',
			icon: '/images/gear-icons/wing.svg',
			position: { x: 29, y: 31 },
			labelPosition: 'left',
			products: [
				{ name: 'OMS SS Backplate', image: '', category: 'basic' },
				{ name: 'Halcyon Evolve 40', image: '', category: 'basic' },
				{ name: 'Halcyon Eclipse 40', image: '', category: 'technical' },
				{ name: 'OMS Double Wing 60lb', image: '', category: 'technical' }
			]
		},
		{
			id: 'gauge',
			title: 'GAUGE',
			subtitle: 'Submersible Pressure Gauge',
			description: 'Submersible pressure gauges big in size, clear and can come in Imperial or Metric formats',
			icon: '/images/gear-icons/gauge.svg',
			position: { x: 64, y: 46 },
			labelPosition: 'right',
			products: [
				{ name: 'OMS SPG', image: '', category: 'basic' },
				{ name: 'Halcyon Master SPG', image: '', category: 'technical' },
				{ name: 'Suunto SM-36', image: '', category: 'basic' }
			]
		},
		{
			id: 'computer',
			title: 'DIVE COMPUTER',
			subtitle: 'GAUGE or DIVE COMPUTER',
			description: 'Whether a depth gauge or dive computer, it is an essential tool to give the diver the ability to read the parameters of the dive',
			icon: '/images/gear-icons/dive-computer.svg',
			position: { x: 24, y: 48 },
			labelPosition: 'left',
			products: [
				{ name: 'Shearwater Peregrine', image: '', category: 'basic' },
				{ name: 'Garmin Descent Mk3', image: '', category: 'basic' },
				{ name: 'Shearwater Perdix 2', image: '', category: 'technical' },
				{ name: 'Shearwater Petrel 3', image: '', category: 'technical' }
			]
		},
		{
			id: 'compass',
			title: 'COMPASS',
			subtitle: 'MAGNETIC OR DIGITAL',
			description: 'Any type of magnetic or digital compass, used for underwater navigation & bearing allocation. Some dive computers have a digital compass embedded.',
			icon: '/images/gear-icons/compass.svg',
			position: { x: 75, y: 48 },
			labelPosition: 'right',
			products: [
				{ name: 'Suunto SK-8', image: '', category: 'basic' },
				{ name: 'OMS Compass', image: '', category: 'basic' },
				{ name: 'Halcyon Compass', image: '', category: 'technical' }
			]
		},
		{
			id: 'pockets',
			title: 'POCKETS ACCESSORIES',
			subtitle: 'Storage & Tools',
			description: 'Pockets and accessories for carrying essential tools, slates, reels, and other dive accessories',
			icon: '/images/gear-icons/accessories.svg',
			position: { x: 69, y: 63 },
			labelPosition: 'right',
			products: [
				{ name: 'OMS Utility Pocket', image: '', category: 'basic' },
				{ name: 'Halcyon Bellows Pocket', image: '', category: 'technical' },
				{ name: 'OMS Safety Reel', image: '', category: 'technical' },
				{ name: 'Halcyon Slate', image: '', category: 'technical' }
			]
		},
		{
			id: 'fins',
			title: 'FINS',
			subtitle: 'RIGID RUBBER',
			description: 'Rigid rubber compound fins facilitating finning technics, while minimizing effort. Heel springs for ease of use, wide stiff blade for better backward frog kick control',
			icon: '/images/gear-icons/fins.svg',
			position: { x: 32, y: 92 },
			labelPosition: 'left',
			products: [
				{ name: 'OMS Slipstream', image: '', category: 'basic' },
				{ name: 'Hollis F1', image: '', category: 'basic' },
				{ name: 'Halcyon Flextreme', image: '', category: 'technical' },
				{ name: 'Deep6 Eddy Fin', image: '', category: 'technical' }
			]
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
			</button>

			{/each}

		{#each gearItems as item}
			{#if activeHotspot === item.id}
				<HotspotPopup
					icon={item.icon}
					title={item.title}
					subtitle={item.subtitle}
					description={item.description}
					products={item.products}
					on:close={() => activeHotspot = null}
				/>
			{/if}
		{/each}
	</div>
</div>

<style>
	.gear-diagram-container {
		width: 100%;
		padding: 60px 0 80px 0;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		animation: chunkFadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.6s backwards;
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
		transform: translate(-50%, -50%) scale(1.5);
		box-shadow: 0 2px 12px rgba(0, 162, 255, 0.6);
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
		}

		.diagram-wrapper {
			width: 70vw;
			max-width: 320px;
		}
	}
</style>
