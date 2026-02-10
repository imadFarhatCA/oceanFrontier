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
		brands: string[];
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
				{ name: 'YRVA Hood', image: '/images/gear-products/YRVA hoods.jpg', category: 'technical' }
			],
			brands: []
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
				{ name: 'Halcyon Omnis Mask', image: '/images/gear-products/Halcyon Omnis Mask.jpg', category: 'technical' },
				{ name: 'Fourth Element Seeker Mask', image: '/images/gear-products/fourthElement Seeker Mask.jpg', category: 'basic' }
			],
			brands: ['halcyon.svg', 'fourth-element.svg']
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
				{ name: 'Halcyon H-50 Regulator', image: '/images/gear-products/Halcyon H50 Regulators 001.jpg', category: 'basic' },
				{ name: 'Halcyon Single Tank Regulator', image: '/images/gear-products/Halcyon Regulators singleTank.jpg', category: 'basic' },
				{ name: 'Halcyon Deco Regulator', image: '/images/gear-products/Halcyon decoReg.jpg', category: 'technical' }
			],
			brands: ['halcyon.svg']
		},
		{
			id: 'undergarments',
			title: 'UNDERGARMENTS',
			subtitle: 'Thermal Insulation',
			description: 'Thermal undergarments worn beneath drysuits to provide insulation and maintain body temperature during cold water dives',
			icon: '/images/gear-icons/undergarments gearIcon.svg',
			position: { x: 32, y: 16 },
			labelPosition: 'left',
			products: [
				{ name: 'Fourth Element Xerotherm', image: '/images/gear-products/Xerotherm fourthElement.jpg', category: 'basic' },
				{ name: 'Fourth Element Arctic', image: '/images/gear-products/Arctic fourthElement.jpg', category: 'basic' },
				{ name: 'Fourth Element J2', image: '/images/gear-products/J2 fourthElement.jpg', category: 'technical' }
			],
			brands: ['fourth-element.svg']
		},
		{
			id: 'suit',
			title: 'EXPOSURE SUIT',
			subtitle: 'Wet / Dry',
			description: 'Exposure Suits chosen for specific environmental parameters, whether you go for a drysuit or a wetsuit, the below products are rugged and recommended to handle the work we have put them through.<br><br>Get in touch with us for more details and information about the specifications that make these suits a selected choice in our opinion, and what are the leverage points of strength that made us adopt these products.',
			icon: '/images/gear-icons/drysuit.svg',
			position: { x: 71, y: 26 },
			labelPosition: 'right',
			products: [
				{ name: 'Ursuit Cordura Grey', image: '/images/gear-products/ursuit-cordura-grey.jpg', category: 'technical' },
				{ name: 'Fourth Element Argonaut 3.0', image: '/images/gear-products/fourth-element-argonaut.jpg', category: 'technical' },
				{ name: 'Fourth Element Proteus II', image: '/images/gear-products/fourth-element-proteus.jpg', category: 'basic' }
			],
			brands: ['ursuit.svg', 'fourth-element.svg']
		},
		{
			id: 'wing',
			title: 'WING<span class="desktop-only"> / </span><br class="mobile-br">BACKPLATE',
			subtitle: 'Buoyancy Compensator',
			description: 'Doughnut shaped wings are used for different configurations and lift capacities',
			icon: '/images/gear-icons/wing.svg',
			position: { x: 29, y: 31 },
			labelPosition: 'left',
			products: [
				{ name: 'Halcyon Single Tank Wings', image: '/images/gear-products/Halcyon singleWings.jpg', category: 'basic' },
				{ name: 'Halcyon Doubles Wing', image: '/images/gear-products/Halcyon DoublesWing.jpg', category: 'technical' },
				{ name: 'Halcyon CCR Wing', image: '/images/gear-products/Halcyon CCRWing.jpg', category: 'technical' }
			],
			brands: ['halcyon.svg']
		},
		{
			id: 'gauge',
			title: 'GAUGE',
			subtitle: 'Submersible Pressure Gauge',
			description: 'Submersible pressure gauges big in size, clear and can come in Imperial or Metric formats',
			icon: '/images/gear-icons/gauge.svg',
			position: { x: 63, y: 44 },
			labelPosition: 'right',
			products: [
				{ name: 'Halcyon Master SPG', image: '/images/gear-products/Halcyon SPG big.jpg', category: 'technical' }
			],
			brands: ['halcyon.svg', 'suunto.svg']
		},
		{
			id: 'lights',
			title: 'LIGHTS',
			subtitle: 'Primary & Backup',
			description: 'Dive lights for visibility, communication, and safety. Includes primary canister lights and backup lights for redundancy',
			icon: '/images/gear-icons/lights gearIcon.svg',
			position: { x: 37, y: 44 },
			labelPosition: 'left',
			products: [
				{ name: 'Halcyon Photon Backup Light', image: '/images/gear-products/Halcyon Photon backupLight.jpg', category: 'basic' },
				{ name: 'Halcyon Focus Light', image: '/images/gear-products/Halcyon Focus Light.jpg', category: 'technical' },
				{ name: 'Halcyon Expedition Light', image: '/images/gear-products/Halcyon Expedition Light.jpg', category: 'technical' }
			],
			brands: ['halcyon.svg']
		},
		{
			id: 'computer',
			title: 'DIVE<br class="mobile-br"> COMPUTER',
			subtitle: 'GAUGE or DIVE COMPUTER',
			description: 'Whether a depth gauge or dive computer, it is an essential tool to give the diver the ability to read the parameters of the dive',
			icon: '/images/gear-icons/dive-computer.svg',
			position: { x: 24, y: 48 },
			labelPosition: 'left',
			products: [
				{ name: 'Halcyon Dive Computer HUD', image: '/images/gear-products/halcyon diveComputer HUD.jpg', category: 'technical' },
				{ name: 'Halcyon Dive Computer Handset', image: '/images/gear-products/halcyon diveComputer Handset.jpg', category: 'technical' },
				{ name: 'Halcyon Dive Computer POD', image: '/images/gear-products/halcyon diveComputer POD.jpg', category: 'technical' }
			],
			brands: ['halcyon.svg']
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
				{ name: 'Suunto SK-8', image: '/images/gear-products/Suunto Compass.jpg', category: 'basic' },
				{ name: 'DGX Compass', image: '/images/gear-products/DGX Compass.jpg', category: 'basic' }
			],
			brands: ['suunto.svg']
		},
		{
			id: 'pockets',
			title: 'POCKETS<br>ACCESSORIES',
			subtitle: 'Storage & Tools',
			description: 'Pockets and accessories for carrying essential tools, slates, reels, and other dive accessories',
			icon: '/images/gear-icons/accessories.svg',
			position: { x: 69, y: 63 },
			labelPosition: 'right',
			products: [
				{ name: 'Halcyon SMB', image: '/images/gear-products/Halcyon SMB.jpg', category: 'basic' },
				{ name: 'Halcyon Spools', image: '/images/gear-products/Halcyon Spools.jpg', category: 'basic' },
				{ name: 'Halcyon Wet Notes', image: '/images/gear-products/Halcyon wetNotes.jpg', category: 'basic' }
			],
			brands: ['halcyon.svg']
		},
		{
			id: 'diving-accessories',
			title: 'DIVING<br>ACCESSORIES',
			subtitle: 'DPV & Tools',
			description: 'Diver Propulsion Vehicles (DPV/Scooters) and essential diving accessories including cutting tools, reels, SMBs, slates, and safety equipment',
			icon: '/images/gear-icons/DPV gearIcon.svg',
			position: { x: 31, y: 63 },
			labelPosition: 'left',
			products: [
				{ name: 'Halcyon Pathfinder Reel', image: '/images/gear-products/Halcyon PathfinderReel.jpg', category: 'technical' },
				{ name: 'Gramper GPS', image: '/images/gear-products/gramperGPS.jpg', category: 'technical' },
				{ name: 'SUEX DPV', image: '/images/gear-products/SUEX DPV.jpg', category: 'technical' }
			],
			brands: ['halcyon.svg', 'suex.svg']
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
				{ name: 'Halcyon Vector Fins', image: '/images/gear-products/Halcyon vectorFins.jpg', category: 'technical' },
				{ name: 'ScubaPro Jet Fins', image: '/images/gear-products/scubaPro JetFins.jpg', category: 'basic' }
			],
			brands: ['halcyon.svg', 'scubaPro.svg']
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

		:global(.mobile-br) {
			display: inline;
		}
		:global(.desktop-only) {
			display: none;
		}
	}
</style>
