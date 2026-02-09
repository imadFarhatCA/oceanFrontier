<script lang="ts">
	export let icon: string;
	export let title: string;
	export let subtitle: string;
	export let description: string;
	export let side: 'left' | 'right' = 'right';
	export let x: number;
	export let y: number;
</script>

<div
	class="hotspot-popup {side}"
	style="--x: {x}%; --y: {y}%;"
>
	<div class="popup-connector"></div>
	<div class="popup-content">
		<div class="popup-icon">{icon}</div>
		<div class="popup-text">
			<h3 class="popup-title">{title}</h3>
			<p class="popup-subtitle">{subtitle}</p>
			<p class="popup-description">{description}</p>
		</div>
	</div>
</div>

<style>
	.hotspot-popup {
		position: absolute;
		z-index: 20;
		pointer-events: none;
		animation: popupSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

	.hotspot-popup.left {
		right: calc(100% - var(--x));
		top: var(--y);
		transform: translateY(-50%);
		padding-right: 24px;
	}

	.hotspot-popup.right {
		left: var(--x);
		top: var(--y);
		transform: translateY(-50%);
		padding-left: 24px;
		animation-name: popupSlideInRight;
	}

	@keyframes popupSlideIn {
		from {
			opacity: 0;
			transform: translateY(-50%) translateX(-16px);
		}
		to {
			opacity: 1;
			transform: translateY(-50%) translateX(0);
		}
	}

	@keyframes popupSlideInRight {
		from {
			opacity: 0;
			transform: translateY(-50%) translateX(16px);
		}
		to {
			opacity: 1;
			transform: translateY(-50%) translateX(0);
		}
	}

	/* Connector line */
	.popup-connector {
		position: absolute;
		top: 50%;
		height: 1px;
		background: linear-gradient(90deg, transparent, rgba(0, 162, 255, 0.6), rgba(0, 162, 255, 0.6), transparent);
	}

	.hotspot-popup.left .popup-connector {
		right: 0;
		width: 24px;
	}

	.hotspot-popup.right .popup-connector {
		left: 0;
		width: 24px;
	}

	/* Card */
	.popup-content {
		display: flex;
		gap: 12px;
		align-items: flex-start;
		background: rgba(30, 40, 50, 0.65);
		backdrop-filter: blur(12px);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 8px;
		padding: 16px;
		max-width: 320px;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
		pointer-events: auto;
		cursor: default;
		transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.popup-content:hover {
		background: rgba(35, 45, 55, 0.75);
		border-color: rgba(255, 255, 255, 0.12);
	}

	.popup-icon {
		font-size: 32px;
		line-height: 1;
		flex-shrink: 0;
	}

	.popup-text {
		flex: 1;
		text-align: left;
	}

	.popup-title {
		font-size: 16px;
		font-weight: 700;
		color: rgba(0, 162, 255, 1);
		margin: 0 0 4px 0;
		letter-spacing: 0.5px;
		text-align: left;
	}

	.popup-subtitle {
		font-size: 11px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.6);
		margin: 0 0 8px 0;
		letter-spacing: 1px;
		text-transform: uppercase;
		text-align: left;
	}

	.popup-description {
		font-size: 13px;
		line-height: 1.5;
		color: rgba(255, 255, 255, 0.75);
		margin: 0;
		font-weight: 400;
		text-align: left;
	}

	@media (max-width: 768px) {
		.popup-content {
			max-width: 240px;
			padding: 12px;
			gap: 10px;
		}

		.popup-icon {
			font-size: 24px;
		}

		.popup-title {
			font-size: 14px;
		}

		.popup-subtitle {
			font-size: 10px;
			margin-bottom: 6px;
		}

		.popup-description {
			font-size: 12px;
		}
	}
</style>
