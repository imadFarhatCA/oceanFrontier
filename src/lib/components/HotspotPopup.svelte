<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import type { GearProduct } from '$lib/data/gearItems';
	import ProductCarousel from './ProductCarousel.svelte';
	import ModalBrandLogos from './ModalBrandLogos.svelte';

	export let id: string;
	export let icon: string;
	export let title: string;
	export let subtitle: string;
	export let description: string;
	export let products: GearProduct[] = [];
	export let brands: string[] = [];

	$: cleanTitle = title.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

	const dispatch = createEventDispatcher();
	let overlayEl: HTMLDivElement;

	function close() {
		dispatch('close');
	}

	function handleOverlayClick(e: MouseEvent) {
		if (e.target === e.currentTarget) close();
	}

	onMount(() => {
		// Portal to body so position:fixed works regardless of parent transforms
		document.body.appendChild(overlayEl);

		return () => {
			if (overlayEl?.parentNode) {
				overlayEl.parentNode.removeChild(overlayEl);
			}
		};
	});
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="modal-overlay" bind:this={overlayEl} on:click={handleOverlayClick}>
	<div class="modal-card">
		<button class="close-button" on:click={close} aria-label="Close">
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<line x1="18" y1="6" x2="6" y2="18"></line>
				<line x1="6" y1="6" x2="18" y2="18"></line>
			</svg>
		</button>

		<div class="modal-header">
			<img class="modal-icon" src={icon} alt={title} />
			<div class="icon-line"></div>
			<h3 class="modal-title" class:lights-title={id === 'lights'} class:computer-title={id === 'computer'}>{cleanTitle}</h3>
			<p class="modal-subtitle" class:lights-subtitle={id === 'lights'} class:computer-subtitle={id === 'computer'}>{subtitle}</p>
		</div>

		<p class="modal-description">{@html description}</p>

		{#if products.length > 0}
			<ModalBrandLogos {brands} />
			<ProductCarousel {products} />
		{/if}
	</div>
</div>

<style>
	/* Full-screen overlay */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(4px);
		z-index: 500;
		display: flex;
		align-items: center;
		justify-content: center;
		animation: overlayFadeIn 0.3s ease forwards;
		padding: 20px;
	}

	@keyframes overlayFadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	/* Modal card */
	.modal-card {
		background: rgba(42, 42, 42, 0.98);
		backdrop-filter: blur(20px);
		border-radius: 24px;
		padding: 48px 36px;
		max-width: 560px;
		width: 100%;
		position: relative;
		box-shadow:
			0 20px 60px rgba(0, 0, 0, 0.3),
			0 8px 24px rgba(0, 0, 0, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
		animation: modalSlideIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
		max-height: 90vh;
		min-height: 420px;
		overflow-y: auto;
		scrollbar-width: none;
	}

	.modal-card::-webkit-scrollbar {
		display: none;
	}

	@keyframes modalSlideIn {
		0% {
			opacity: 0;
			transform: scale(0.96);
			filter: blur(4px);
		}
		60% { filter: blur(0); }
		100% {
			opacity: 1;
			transform: scale(1);
			filter: blur(0);
		}
	}

	/* Close button */
	.close-button {
		position: absolute;
		top: 16px;
		right: 16px;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		border: none;
		background: rgba(255, 255, 255, 0.08);
		color: rgba(255, 255, 255, 0.6);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
		z-index: 10;
	}

	.close-button:hover {
		background: rgba(255, 255, 255, 0.15);
		color: white;
		transform: scale(1.1) rotate(90deg);
	}

	/* Header — centered vertically */
	.modal-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		margin-bottom: 20px;
		gap: 8px;
	}

	.modal-icon {
		width: 48px;
		height: 48px;
		flex-shrink: 0;
		filter: invert(1);
	}

	/* 20px line under icon */
	.icon-line {
		width: 20px;
		height: 1px;
		background: rgba(255, 255, 255, 0.3);
		margin: 4px 0;
	}

	.modal-title {
		font-size: 22px;
		font-weight: 700;
		color: rgba(0, 162, 255, 1);
		margin: 0;
		letter-spacing: 0.5px;
	}

	.modal-subtitle {
		font-size: 11px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.5);
		margin: 0;
		letter-spacing: 1px;
		text-transform: uppercase;
	}

	/* Description — centered */
	.modal-description {
		font-size: 14px;
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.7);
		margin: 0 0 28px 0;
		text-align: center;
	}

	@media (max-width: 768px) {
		.modal-card {
			padding: 36px 24px;
			max-width: 92vw;
			border-radius: 20px;
			max-height: 90vh;
			min-height: 520px;
		}

		.modal-icon {
			width: 40px;
			height: 40px;
		}

		.modal-title {
			font-size: 18px;
		}

		.modal-title.lights-title {
			transform: translateY(-50px);
		}

		.modal-title.computer-title {
			transform: translateY(-10px);
		}

		.modal-subtitle.lights-subtitle {
			transform: translateY(-50px);
		}

		.modal-subtitle.computer-subtitle {
			transform: translateY(-10px);
		}

		.modal-description {
			font-size: 13px;
		}
	}
</style>
