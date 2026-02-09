<script lang="ts">
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
			id: 'regulators',
			title: 'REGULATORS',
			subtitle: 'Backup & Primary',
			description: 'A secondary regulator on a bungee necklace to be reachable and used as backup. Primary connected via 1.5-2m hose.',
			icon: '🔧',
			position: { x: 45, y: 25 },
			labelPosition: 'left'
		},
		{
			id: 'tank',
			title: 'TANK',
			subtitle: 'SCUBA Cylinder',
			description: 'Tanks used can be of different compounds and sizes',
			icon: '🪂',
			position: { x: 55, y: 15 },
			labelPosition: 'right'
		},
		{
			id: 'wing',
			title: 'WING',
			subtitle: 'Buoyancy Compensator',
			description: 'Doughnut shaped wings are used for different configurations and lift capacities',
			icon: '🎈',
			position: { x: 58, y: 35 },
			labelPosition: 'right'
		},
		{
			id: 'computer',
			title: 'DIVE COMPUTER',
			subtitle: 'GAUGE or DIVE COMPUTER',
			description: 'Whether a depth gauge or dive computer, it is an essential tool to give the diver the ability to read the parameters of the dive',
			icon: '⌚',
			position: { x: 35, y: 45 },
			labelPosition: 'left'
		},
		{
			id: 'spg',
			title: 'SPG',
			subtitle: 'Submersible Pressure Gauge',
			description: 'Submersible pressure gauges big in size, clear and can come in Imperial or Metric formats',
			icon: '📊',
			position: { x: 62, y: 48 },
			labelPosition: 'right'
		},
		{
			id: 'mask',
			title: 'MASK',
			subtitle: 'LOW VOLUME',
			description: 'Any low volume mask with a single or dual lense profile permitting for minimal use of gas to clear it out',
			icon: '🥽',
			position: { x: 48, y: 58 },
			labelPosition: 'left'
		},
		{
			id: 'compass',
			title: 'COMPASS',
			subtitle: 'MAGNETIC OR DIGITAL',
			description: 'Any type of magnetic or digital compass, used for underwater navigation & bearing allocation. Some dive computers have a digital compass embedded.',
			icon: '🧭',
			position: { x: 55, y: 65 },
			labelPosition: 'right'
		},
		{
			id: 'fins',
			title: 'FINS',
			subtitle: 'RIGID RUBBER',
			description: 'Rigid rubber compound fins facilitating finning technics, while minimizing effort. Heel springs for ease of use, wide stiff blade for better backward frog kick control',
			icon: '🦭',
			position: { x: 48, y: 85 },
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
			</button>

			{#if activeHotspot === item.id}
				<div
					class="gear-label {item.labelPosition}"
					style="--x: {item.position.x}%; --y: {item.position.y}%;"
				>
					<div class="label-connector"></div>
					<div class="label-content">
						<div class="label-icon">{item.icon}</div>
						<div class="label-text">
							<h3 class="label-title">{item.title}</h3>
							<p class="label-subtitle">{item.subtitle}</p>
							<p class="label-description">{item.description}</p>
						</div>
					</div>
				</div>
			{/if}
		{/each}
	</div>
</div>

<style>
	.gear-diagram-container {
		width: 100%;
		padding: 60px 0;
		display: flex;
		justify-content: center;
		align-items: center;
		animation: chunkFadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.6s backwards;
	}

	.diagram-wrapper {
		position: relative;
		width: 100%;
		max-width: 900px;
		aspect-ratio: 16 / 10;
	}

	.silhouette {
		width: 100%;
		height: 100%;
		object-fit: contain;
		opacity: 0.85;
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

	/* Gear Label */
	.gear-label {
		position: absolute;
		z-index: 20;
		pointer-events: none;
		animation: labelSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	.gear-label.left {
		right: calc(100% - var(--x));
		top: var(--y);
		transform: translateY(-50%);
		padding-right: 24px;
	}

	.gear-label.right {
		left: var(--x);
		top: var(--y);
		transform: translateY(-50%);
		padding-left: 24px;
	}

	@keyframes labelSlideIn {
		from {
			opacity: 0;
			transform: translateY(-50%) translateX(-16px);
		}
		to {
			opacity: 1;
			transform: translateY(-50%) translateX(0);
		}
	}

	.gear-label.right {
		animation-name: labelSlideInRight;
	}

	@keyframes labelSlideInRight {
		from {
			opacity: 0;
			transform: translateY(-50%) translateX(16px);
		}
		to {
			opacity: 1;
			transform: translateY(-50%) translateX(0);
		}
	}

	.label-connector {
		position: absolute;
		top: 50%;
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(0, 162, 255, 0.6), rgba(0, 162, 255, 0.6), transparent);
	}

	.gear-label.left .label-connector {
		right: 0;
		width: 24px;
	}

	.gear-label.right .label-connector {
		left: 0;
		width: 24px;
	}

	.label-content {
		display: flex;
		gap: 12px;
		align-items: flex-start;
		background: rgba(0, 0, 0, 0.85);
		backdrop-filter: blur(12px);
		border: 1px solid rgba(0, 162, 255, 0.3);
		border-radius: 8px;
		padding: 16px;
		max-width: 320px;
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
	}

	.label-icon {
		font-size: 32px;
		line-height: 1;
		flex-shrink: 0;
	}

	.label-text {
		flex: 1;
	}

	.label-title {
		font-size: 16px;
		font-weight: 700;
		color: rgba(0, 162, 255, 1);
		margin: 0 0 4px 0;
		letter-spacing: 0.5px;
	}

	.label-subtitle {
		font-size: 11px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.6);
		margin: 0 0 8px 0;
		letter-spacing: 1px;
		text-transform: uppercase;
	}

	.label-description {
		font-size: 13px;
		line-height: 1.5;
		color: rgba(255, 255, 255, 0.75);
		margin: 0;
		font-weight: 400;
	}

	@media (max-width: 768px) {
		.gear-diagram-container {
			padding: 40px 0;
		}

		.diagram-wrapper {
			max-width: 100%;
			padding: 0 20px;
		}

		.label-content {
			max-width: 240px;
			padding: 12px;
			gap: 10px;
		}

		.label-icon {
			font-size: 24px;
		}

		.label-title {
			font-size: 14px;
		}

		.label-subtitle {
			font-size: 10px;
			margin-bottom: 6px;
		}

		.label-description {
			font-size: 12px;
		}
	}
</style>
