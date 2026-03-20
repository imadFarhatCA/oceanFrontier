<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import type { TrainingCourse } from '$lib/data/trainingCourses';
	import { cart } from '$lib/cart/cartStore';

	export let course: TrainingCourse;

	const dispatch = createEventDispatcher();

	function close() {
		dispatch('close');
	}

	function handleOverlayClick(e: MouseEvent) {
		if (e.target === e.currentTarget) close();
	}

	function addToCart() {
		if (!course.price) return;
		cart.addItem({
			type: 'course',
			id: String(course.id),
			name: course.title,
			image: course.image,
			price: course.price
		});
	}

	function getCategoryLabel(cat: string): string {
		const labels: Record<string, string> = {
			'none-diver': 'Non Diver',
			'existing-diver': 'Existing Diver',
			'gue-diver': 'GUE Diver',
			'rebreathers': 'Rebreathers',
			'instructor': 'Instructor'
		};
		return labels[cat] ?? cat;
	}

	let panelEl: HTMLDivElement;

	onMount(() => {
		document.body.appendChild(panelEl);
		return () => {
			if (panelEl?.parentNode) {
				panelEl.parentNode.removeChild(panelEl);
			}
		};
	});
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="panel-overlay" bind:this={panelEl} on:click={handleOverlayClick} transition:fade={{ duration: 150 }}>
	<div class="panel" transition:fly={{ x: 500, duration: 250 }}>
		<!-- Close button -->
		<button class="panel-close" on:click={close} aria-label="Close">
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<line x1="18" y1="6" x2="6" y2="18"></line>
				<line x1="6" y1="6" x2="18" y2="18"></line>
			</svg>
		</button>

		<!-- Scrollable content -->
		<div class="panel-scroll">
			<!-- Hero image -->
			<div class="panel-hero">
				<div class="panel-hero-image" style="background-image: url('{course.image}')">
					<div class="panel-hero-overlay"></div>
				</div>
				<div class="panel-hero-content">
					<span class="panel-category">{getCategoryLabel(course.category)}</span>
					<h2 class="panel-title">{course.title}</h2>
				</div>
			</div>

			<!-- Meta bar -->
			{#if course.details}
				<div class="panel-meta">
					{#if course.details.duration}
						<div class="meta-item">
							<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<circle cx="12" cy="12" r="10"></circle>
								<polyline points="12 6 12 12 16 14"></polyline>
							</svg>
							<span>{course.details.duration}</span>
						</div>
					{/if}
					{#if course.price}
						<div class="meta-item price">
							<span>{course.price} EUR</span>
						</div>
					{/if}
				</div>
			{/if}

			<!-- Description -->
			<div class="panel-section">
				<p class="panel-description">
					{course.details?.longDescription ?? course.description}
				</p>
			</div>

			<!-- Prerequisites -->
			{#if course.details?.prerequisites}
				<div class="panel-section">
					<h3 class="section-title">Prerequisites</h3>
					<p class="section-text">{course.details.prerequisites}</p>
				</div>
			{/if}

			<!-- Highlights -->
			{#if course.details?.highlights}
				<div class="panel-section">
					<h3 class="section-title">What You'll Learn</h3>
					<ul class="highlights-list">
						{#each course.details.highlights as item}
							<li>{item}</li>
						{/each}
					</ul>
				</div>
			{/if}

			<!-- Includes -->
			{#if course.details?.includes}
				<div class="panel-section">
					<h3 class="section-title">Course Includes</h3>
					<ul class="includes-list">
						{#each course.details.includes as item}
							<li>{item}</li>
						{/each}
					</ul>
				</div>
			{/if}

			<!-- Tags -->
			{#if course.details?.tags}
				<div class="panel-tags">
					{#each course.details.tags as tag}
						<span class="tag-pill">{tag}</span>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Sticky footer -->
		{#if course.price}
			<div class="panel-footer">
				<button class="panel-cart-btn" on:click={addToCart}>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="9" cy="21" r="1"></circle>
						<circle cx="20" cy="21" r="1"></circle>
						<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
					</svg>
					Add to Cart — {course.price} EUR
				</button>
			</div>
		{/if}
	</div>
</div>

<style>
	.panel-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 500;
		display: flex;
		justify-content: flex-end;
	}

	.panel {
		width: 480px;
		max-width: 100vw;
		height: 100%;
		background: #f5f5f5;
		display: flex;
		flex-direction: column;
		position: relative;
		box-shadow: -8px 0 30px rgba(0, 0, 0, 0.15);
	}

	/* Close button */
	.panel-close {
		position: absolute;
		top: 16px;
		right: 16px;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		border: none;
		background: rgba(0, 0, 0, 0.3);
		color: white;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
		transition: background 0.15s ease;
	}

	.panel-close:hover {
		background: rgba(0, 0, 0, 0.5);
	}

	/* Scrollable area */
	.panel-scroll {
		flex: 1;
		overflow-y: auto;
		scrollbar-width: none;
	}

	.panel-scroll::-webkit-scrollbar {
		display: none;
	}

	/* Hero */
	.panel-hero {
		position: relative;
		width: 100%;
		height: 340px;
		overflow: hidden;
	}

	.panel-hero-image {
		width: 100%;
		height: 100%;
		background-size: cover;
		background-position: center;
		background-color: #d4d4d4;
	}

	.panel-hero-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, transparent 60%);
	}

	.panel-hero-content {
		position: absolute;
		bottom: 24px;
		left: 28px;
		right: 28px;
	}

	.panel-category {
		display: inline-block;
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 1.5px;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.7);
		margin-bottom: 8px;
	}

	.panel-title {
		font-size: 26px;
		font-weight: 700;
		color: white;
		margin: 0;
		line-height: 1.2;
		letter-spacing: -0.02em;
	}

	/* Meta bar */
	.panel-meta {
		display: flex;
		gap: 16px;
		padding: 16px 28px;
		border-bottom: 1px solid rgba(0, 0, 0, 0.06);
		background: white;
	}

	.meta-item {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 13px;
		font-weight: 600;
		color: #6b6b6b;
	}

	.meta-item.price {
		margin-left: auto;
		color: #2a2a2a;
		font-size: 15px;
		font-weight: 700;
	}

	/* Tags */
	.panel-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		padding: 16px 28px;
		border-bottom: 1px solid rgba(0, 0, 0, 0.04);
	}

	.tag-pill {
		display: inline-block;
		padding: 5px 12px;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.3px;
		color: #6b6b6b;
		background: rgba(0, 0, 0, 0.04);
		border: 1px solid rgba(0, 0, 0, 0.08);
		border-radius: 20px;
	}

	/* Sections */
	.panel-section {
		padding: 20px 28px;
		border-bottom: 1px solid rgba(0, 0, 0, 0.04);
	}

	.panel-description {
		font-size: 14px;
		line-height: 1.7;
		color: #4a4a4a;
		margin: 0;
	}

	.section-title {
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.8px;
		text-transform: uppercase;
		color: #2a2a2a;
		margin: 0 0 12px 0;
	}

	.section-text {
		font-size: 13px;
		line-height: 1.6;
		color: #6b6b6b;
		margin: 0;
	}

	/* Lists */
	.highlights-list,
	.includes-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.highlights-list li {
		font-size: 13px;
		line-height: 1.5;
		color: #4a4a4a;
		padding-left: 20px;
		position: relative;
	}

	.highlights-list li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 7px;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #2a2a2a;
	}

	.includes-list li {
		font-size: 13px;
		line-height: 1.5;
		color: #4a4a4a;
		padding-left: 20px;
		position: relative;
	}

	.includes-list li::before {
		content: '';
		position: absolute;
		left: 2px;
		top: 4px;
		width: 10px;
		height: 5px;
		border-left: 2px solid #2a2a2a;
		border-bottom: 2px solid #2a2a2a;
		transform: rotate(-45deg);
	}

	/* Sticky footer */
	.panel-footer {
		padding: 16px 28px;
		padding-bottom: max(16px, env(safe-area-inset-bottom));
		border-top: 1px solid rgba(0, 0, 0, 0.08);
		background: white;
	}

	.panel-cart-btn {
		width: 100%;
		padding: 14px;
		border: none;
		border-radius: 12px;
		background: linear-gradient(135deg, #2a2a2a 0%, #3d3d3d 100%);
		color: white;
		font-size: 14px;
		font-weight: 600;
		letter-spacing: 0.3px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		transition: transform 0.15s ease, box-shadow 0.15s ease;
		font-family: inherit;
	}

	.panel-cart-btn:hover {
		transform: translateY(-1px);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
	}

	@media (max-width: 768px) {
		.panel {
			width: 100vw;
		}

		.panel-hero {
			height: 260px;
		}

		.panel-title {
			font-size: 22px;
		}

		.panel-hero-content {
			left: 20px;
			right: 20px;
			bottom: 20px;
		}

		.panel-meta {
			padding: 14px 20px;
		}

		.panel-section {
			padding: 18px 20px;
		}

		.panel-footer {
			padding: 14px 20px;
			padding-bottom: max(14px, env(safe-area-inset-bottom));
		}

		.meta-item.price {
			font-size: 20px;
		}
	}
</style>
