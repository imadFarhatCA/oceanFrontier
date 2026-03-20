<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import CourseCard from '$lib/components/CourseCard.svelte';
	import { trainingCourses } from '$lib/data/trainingCourses';
	import type { TrainingCourse } from '$lib/data/trainingCourses';
	import { selectedCourse } from '$lib/stores/pageState';

	export let flow: string = '';
	export let section: 'training' | 'gear' = 'training';

	const dispatch = createEventDispatcher();

	type Message = {
		type: 'question' | 'answer' | 'products';
		text: string;
		typing?: boolean;
	};

	let messages: Message[] = [];
	let currentQuestion: string | null = null;
	let questionOptions: string[] = [];
	let showProducts = false;
	let products: TrainingCourse[] = [];
	let currentProductIndex = 0;
	let showCallToAction = false;
	let showGearTypeSelection = false;
	let productsGrid: HTMLDivElement;
	let scrollRaf: number | null = null;

	function resolveCourses(names: string[]): TrainingCourse[] {
		return names
			.map((name) => trainingCourses.find((c) => c.title === name))
			.filter(Boolean) as TrainingCourse[];
	}

	function resetState() {
		messages = [];
		currentQuestion = null;
		questionOptions = [];
		showProducts = false;
		products = [];
		currentProductIndex = 0;
		showCallToAction = false;
		showGearTypeSelection = false;
	}

	function startFlow(flowId: string) {
		resetState();
		if (flowId === 'better-diver') {
			startBetterDiverFlow();
		} else if (flowId === 'ccr') {
			startCCRFlow();
		} else if (flowId === 'instructor') {
			startInstructorFlow();
		} else if (flowId === 'premium') {
			startPremiumEquipmentFlow();
		}
	}

	$: if (flow) {
		startFlow(flow);
	}

	async function startBetterDiverFlow() {
		const questionText = 'Are you an existing diver with any other agency?';
		messages = [{ type: 'question', text: questionText, typing: false }];
		await new Promise((resolve) => setTimeout(resolve, 400));
		currentQuestion = 'existing-diver';
		questionOptions = ['Yes', 'No', 'I am already a GUE certified diver'];
	}

	async function startCCRFlow() {
		const titleText =
			'A modern tool with a purpose, cross into the CCR world as an effective approach for a multitude of diving goals, such as but not limited to, deeper dives, extended ranges, underwater content creation';
		messages = [{ type: 'question', text: titleText, typing: false }];
		await new Promise((resolve) => setTimeout(resolve, 500));
		showProducts = true;
		currentProductIndex = 0;
		products = resolveCourses([
			'GUE Symbios CCR Fundamentals',
			'GUE JJ CCR Fundamentals',
			'JJ CCR - MOD 1'
		]);
	}

	async function startInstructorFlow() {
		const questionText =
			"If you see yourself as a GUE Instructor, that's your starting point here";
		messages = [{ type: 'question', text: questionText, typing: false }];
		await new Promise((resolve) => setTimeout(resolve, 400));
		showCallToAction = true;
	}

	async function startPremiumEquipmentFlow() {
		messages = [
			{
				type: 'question',
				text: 'WE ONLY SELL YOU WHAT WE USE !\n\nwhether you are starting up or optimizing your diving path, we will consult you on what is best, modular, and would serve you as a long term investment',
				typing: false
			}
		];
		await new Promise((resolve) => setTimeout(resolve, 400));
		showGearTypeSelection = true;
	}

	async function handleAnswer(answer: string) {
		messages = [...messages, { type: 'answer', text: answer }];
		currentQuestion = null;
		questionOptions = [];
		await new Promise((resolve) => setTimeout(resolve, 500));

		if (answer === 'Yes') {
			showProducts = true;
			currentProductIndex = 0;
			products = resolveCourses([
				'GUE Performance Diver',
				'GUE Basic Fundamentals',
				'GUE Technical Fundamentals',
				'GUE Doubles Primer',
				'GUE Drysuit Primer'
			]);
		} else if (answer === 'No') {
			showProducts = true;
			currentProductIndex = 0;
			products = resolveCourses([
				'GUE Discover Diving',
				'GUE Scuba Diver',
				'GUE Open Water Diver'
			]);
		} else if (answer === 'I am already a GUE certified diver') {
			showProducts = true;
			currentProductIndex = 0;
			products = resolveCourses([
				'GUE DPV 1',
				'GUE Navigation Primer',
				'GUE Deep Primer',
				'GUE Doubles Primer',
				'GUE Drysuit Primer'
			]);
		}
	}

	function scrollProducts(direction: 'prev' | 'next') {
		if (!productsGrid) return;
		if (direction === 'next') {
			currentProductIndex = Math.min(currentProductIndex + 1, products.length - 1);
		} else {
			currentProductIndex = Math.max(currentProductIndex - 1, 0);
		}
		const cardWidth = productsGrid.scrollWidth / products.length;
		productsGrid.scrollTo({
			left: currentProductIndex * cardWidth,
			behavior: 'smooth'
		});
	}

	function handleProductScroll(e: Event) {
		if (scrollRaf) return;
		scrollRaf = requestAnimationFrame(() => {
			scrollRaf = null;
			const grid = e.target as HTMLDivElement;
			if (!grid || !products.length) return;
			const cardWidth = grid.scrollWidth / products.length;
			currentProductIndex = Math.max(
				0,
				Math.min(Math.round(grid.scrollLeft / cardWidth), products.length - 1)
			);
		});
	}
</script>

<div class="questionnaire-panel" class:active={true}>
	<div class="questionnaire-content-wrapper">
		<button class="close-button" on:click={() => dispatch('close')} aria-label="Close">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<line x1="18" y1="6" x2="6" y2="18"></line>
				<line x1="6" y1="6" x2="18" y2="18"></line>
			</svg>
		</button>

		<div class="questionnaire-content">
			<h2 class="questionnaire-title">
				{#if flow === 'ccr'}
					Cross into the Closed Circuit Rebreather World
				{:else if flow === 'instructor'}
					Instructor Development
				{:else if flow === 'premium'}
					Modular Gear Approach
				{:else}
					Find Your Path
				{/if}
			</h2>

			<!-- Messages -->
			<div class="messages-container">
				{#each messages as message, i}
					<div class="message message-{message.type}" style="--message-index: {i}">
						{#if message.type === 'question'}
							<div
								class="message-bubble bot-message"
								class:instructor-message={flow === 'instructor' || flow === 'ccr'}
							>
								{message.text}
								{#if message.typing}
									<span class="typing-indicator">
										<span></span>
										<span></span>
										<span></span>
									</span>
								{/if}
							</div>
						{:else if message.type === 'answer'}
							<div class="message-bubble user-message">
								{message.text}
							</div>
						{/if}
					</div>
				{/each}
			</div>

			<!-- Question Options -->
			{#if currentQuestion && questionOptions.length > 0}
				<div class="options-container">
					{#each questionOptions as option}
						<button class="option-button" on:click={() => handleAnswer(option)}>
							{option}
						</button>
					{/each}
				</div>
			{/if}

			<!-- Gear Type Selection -->
			{#if showGearTypeSelection}
				<div class="gear-type-selection">
					<button
						class="gear-type-card"
						on:click|stopPropagation={() =>
							dispatch('openGearView', { type: 'basic', filter: 'basic' })}
					>
						<div class="gear-type-frame">
							<svg
								class="gear-icon"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 283.46 283.46"
							>
								<rect x="116.91" y="88.54" width="54.93" height="97.06" />
								<path
									d="M171.84,90.48h-54.93v-5.36c0-4.36,4.79-11.89,8.14-14.68,9.73-8.1,30.34-7.92,39.6.93,3.11,2.97,7.2,10.39,7.2,14.68v4.43Z"
								/>
								<path
									d="M171.84,174.98v74.71c0,6.87-6.55,15.62-12.55,18.64-7.65,3.86-23.64,3.81-31.07-.63-4.65-2.78-11.32-11.07-11.32-16.62v-76.11h54.93Z"
								/>
								<rect x="134.14" y="50.65" width="20.48" height="11.17" />
								<path d="M149.71,48.11v.25h-.08c.03-.08.06-.16.08-.25Z" />
								<path
									d="M152.13,28.53h-2.42v-2.51c0-1.1-.88-1.98-1.98-1.98h-7.05c-1.09,0-1.98.88-1.98,1.98v2.51h-1.96c-1.1,0-1.99.89-1.99,1.98v4.66s-.08-.01-.11-.01h-4.16c-.13,0-.25.01-.36.04v-.46c0-1.09-.89-1.98-1.98-1.98l-10.96-2c-1.09,0-1.98.89-1.98,1.98v10.62c0,1.09.89,1.98,1.98,1.98l10.96-2c1.09,0,1.98-.89,1.98-1.98v-.46c.11.03.24.04.36.04h4.16s.08,0,.11-.01v5.47c0,1.09.89,1.98,1.99,1.98h1.96v.46c0,1.09.89,1.98,1.98,1.98h7.05c1.1,0,1.98-.89,1.98-1.98v-.46h-.08c.03-.08.06-.16.08-.25v.25h2.42c1.1,0,1.98-.89,1.98-1.98v-15.87c0-1.09-.88-1.98-1.98-1.98ZM144.17,43.79c-3.36,0-6.09-2.73-6.09-6.09s2.73-6.09,6.09-6.09,6.09,2.73,6.09,6.09-2.73,6.09-6.09,6.09Z"
								/>
							</svg>
						</div>
						<span class="gear-type-label">Basic</span>
					</button>
					<button
						class="gear-type-card"
						on:click|stopPropagation={() =>
							dispatch('openGearView', { type: 'technical', filter: 'technical' })}
					>
						<div class="gear-type-frame">
							<svg
								class="gear-icon"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 283.46 283.46"
							>
								<rect x="82.4" y="107.56" width="54.93" height="48.02" />
								<rect x="143.85" y="107.56" width="54.93" height="48.02" />
								<path
									d="M198.79,90.48h-54.93v-5.36c0-7.34,8.16-16.25,14.78-18.74,6.14-2.31,19.61-2.3,25.72.13,6.62,2.63,14.44,11.78,14.44,19.08v4.89Z"
								/>
								<path
									d="M137.34,90.48h-54.93v-5.36c0-4.36,4.79-11.89,8.14-14.68,9.73-8.1,30.34-7.92,39.6.93,3.11,2.97,7.2,10.39,7.2,14.68v4.43Z"
								/>
								<path
									d="M137.34,174.98v74.71c0,6.87-6.55,15.62-12.55,18.64-7.65,3.86-23.64,3.81-31.07-.63-4.65-2.78-11.32-11.07-11.32-16.62v-76.11h54.93Z"
								/>
								<path
									d="M198.79,174.98v74.71c0,4.29-4.09,11.7-7.2,14.68-9.38,8.97-30.46,9.09-40.06.46-3.01-2.7-7.67-10.21-7.67-14.21v-75.64h54.93Z"
								/>
								<path
									d="M181.56,50.65v11.17h-20.48v-10.94l.7-.7h18.16c.25,0,1.04.72,1.63.47Z"
								/>
								<rect x="99.63" y="50.65" width="20.48" height="11.17" />
								<path d="M115.2,48.11v.25h-.08c.03-.08.06-.16.08-.25Z" />
								<path
									d="M117.62,28.53h-2.42v-2.51c0-1.1-.88-1.98-1.98-1.98h-7.05c-1.09,0-1.98.88-1.98,1.98v2.51h-1.96c-1.1,0-1.99.89-1.99,1.98v4.66s-.08-.01-.11-.01h-4.16c-.13,0-.25.01-.36.04v-.46c0-1.09-.89-1.98-1.98-1.98l-10.96-2c-1.09,0-1.98.89-1.98,1.98v10.62c0,1.09.89,1.98,1.98,1.98l10.96-2c1.09,0,1.98-.89,1.98-1.98v-.46c.11.03.24.04.36.04h4.16s.08,0,.11-.01v5.47c0,1.09.89,1.98,1.99,1.98h1.96v.46c0,1.09.89,1.98,1.98,1.98h7.05c1.1,0,1.98-.89,1.98-1.98v-.46h-.08c.03-.08.06-.16.08-.25v.25h2.42c1.1,0,1.98-.89,1.98-1.98v-15.87c0-1.09-.88-1.98-1.98-1.98ZM109.66,43.79c-3.36,0-6.09-2.73-6.09-6.09s2.73-6.09,6.09-6.09,6.09,2.73,6.09,6.09-2.73,6.09-6.09,6.09Z"
								/>
								<path
									d="M150.45,33.11c0-1.11-.89-2-1.98-2h-4.65s.01-.08.01-.11v-2.17c0-.13-.01-.25-.04-.36h.46c1.09,0,1.98-.89,1.98-1.99l.99-8.98c0-1.09-.89-1.99-1.98-1.99h-8.59c-1.09,0-1.98.89-1.98,1.99l.99,8.98c0,1.09.89,1.99,1.98,1.99h.46c-.03.11-.04.24-.04.36v2.17s0,.08.01.11h-5.45c-1.09,0-1.98.89-1.98,2h19.78Z"
								/>
								<path d="M165.73,48.11v.25s.08,0,.08,0c-.03-.08-.06-.16-.08-.25Z" />
								<path
									d="M161.33,30.51v15.87c0,1.09.88,1.98,1.98,1.98h2.42s0-.25,0-.25c.01.09.05.18.08.25h-.08s0,.46,0,.46c0,1.09.88,1.98,1.98,1.98h7.05c1.09,0,1.98-.89,1.98-1.98v-.46h1.96c1.1,0,1.99-.89,1.99-1.98v-5.47s.08.01.11.01h4.16c.13,0,.25-.01.36-.04v.46c0,1.09.89,1.98,1.98,1.98l10.96,2c1.09,0,1.98-.89,1.98-1.98v-10.62c0-1.09-.89-1.98-1.98-1.98l-10.96,2c-1.09,0-1.98.89-1.98,1.98v.46c-.11-.03-.24-.04-.36-.04h-4.16s-.08,0-.11.01v-4.66c0-1.09-.89-1.98-1.99-1.98h-1.96v-2.51c0-1.1-.89-1.98-1.98-1.98h-7.05c-1.1,0-1.98.88-1.98,1.98v2.51h-2.42c-1.1,0-1.98.89-1.98,1.98ZM165.17,37.7c0-3.36,2.73-6.09,6.09-6.09s6.09,2.73,6.09,6.09-2.73,6.09-6.09,6.09-6.09-2.73-6.09-6.09Z"
								/>
								<rect x="117.42" y="35.04" width="45.5" height="5.99" />
								<rect x="132.53" y="42.85" width="16.38" height="2.4" />
							</svg>
						</div>
						<span class="gear-type-label">Technical</span>
					</button>
				</div>
			{/if}

			<!-- Call to Action Button -->
			{#if showCallToAction}
				<div class="cta-button-container">
					<button class="primary-cta-button">Let us discuss your path</button>
				</div>
			{/if}

			<!-- Products Display -->
			{#if showProducts}
				<div class="products-container">
					<h3 class="products-title">
						{section === 'gear' ? 'Recommended Equipment' : 'Recommended Courses'}
					</h3>
					<div class="products-carousel-wrapper">
						<button
							class="carousel-button prev"
							on:click={() => scrollProducts('prev')}
							aria-label="Previous products"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<polyline points="15 18 9 12 15 6"></polyline>
							</svg>
						</button>
						<div
							class="products-grid"
							bind:this={productsGrid}
							on:scroll={handleProductScroll}
						>
							{#each products as course, i}
								<CourseCard
									{course}
									index={i}
									on:learnmore={(e) => selectedCourse.set(e.detail)}
								/>
							{/each}
						</div>
						<button
							class="carousel-button next"
							on:click={() => scrollProducts('next')}
							aria-label="Next products"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<polyline points="9 18 15 12 9 6"></polyline>
							</svg>
						</button>
					</div>
					<div class="product-counter">
						<div class="product-dots">
							{#each products as _, i}
								<span
									class="product-dot"
									class:active={i === Math.min(currentProductIndex, products.length - 1)}
								></span>
							{/each}
						</div>
						<span class="product-counter-text"
							>{Math.min(currentProductIndex + 1, products.length)}/{products.length}</span
						>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
