<!-- Cloudflare Pages deployment test -->
<script lang="ts">
	import '../styles/main.css';
	import { onMount } from 'svelte';

	type Section = 'training' | 'gear';
	type Message = {
		type: 'question' | 'answer' | 'products';
		text: string;
		typing?: boolean;
	};

	let sliderPosition = 50; // Percentage
	let activeSection: Section | null = null;
	let isDragging = false;
	let isMobileMenuOpen = false;
	let leftSection: HTMLButtonElement;
	let rightSection: HTMLButtonElement;
	let sliderBar: HTMLDivElement;
	let arrowLeft: SVGSVGElement;
	let arrowRight: SVGSVGElement;
	let logoLeft: HTMLDivElement;
	let logoRight: HTMLDivElement;
	let productsGridLeft: HTMLDivElement;
	let productsGridRight: HTMLDivElement;

	// Questionnaire state
	let showQuestionnaire = false;
	let messages: Message[] = [];
	let currentQuestion: string | null = null;
	let questionOptions: string[] = [];
	let showProducts = false;
	let products: string[] = [];
	let currentProductIndex = 0;
	let showCallToAction = false;
	let currentFlow: string = '';

	// Training view state
	let showTrainingView = false;
	let heroExpanded = false;
	type CourseFilter = 'all' | 'none-diver' | 'existing-diver' | 'gue-diver' | 'rebreathers' | 'instructor';
	let activeFilter: CourseFilter = 'all';

	// Dynamic date
	let currentDate = '';

	function formatDate() {
		const now = new Date();
		const day = String(now.getDate()).padStart(2, '0');
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const year = String(now.getFullYear()).slice(-2);
		return `${day}/${month}/${year}`;
	}

	// Mobile swipe state
	let isMobile = false;
	let currentMobileSection = 0; // 0 = training, 1 = gear
	let touchStartX = 0;
	let touchStartY = 0;
	let touchCurrentX = 0;
	let isSwiping = false;
	let swipeHintShown = false;
	const courses = [
		{ id: 1, title: 'GUE Discover Diving', category: 'none-diver', description: 'Perfect introduction to diving for complete beginners.', image: '/images/courses/GUE discoverDiver.jpg' },
		{ id: 2, title: 'GUE Scuba Diver', category: 'none-diver', description: 'Entry-level certification for those new to diving.', image: '/images/courses/GUE scubaDiver.jpg' },
		{ id: 3, title: 'GUE Open Water Diver', category: 'none-diver', description: 'Comprehensive open water certification for beginners.', image: '/images/courses/GUE openWaterDiver.jpg' },
		{ id: 4, title: 'GUE Performance Diver', category: 'existing-diver', description: 'Enhance your skills and learn GUE techniques.', image: '/images/courses/GUE performanceDiver.jpg' },
		{ id: 5, title: 'GUE Basic Fundamentals', category: 'existing-diver', description: "Master fundamental diving skills with GUE's methodology.", image: '/images/courses/GUE BasicFundamentalsDiver.jpg' },
		{ id: 6, title: 'GUE Technical Fundamentals', category: 'existing-diver', description: 'Advanced fundamental skills for technical diving.', image: '/images/courses/GUE techFundamentalsDiver.jpg' },
		{ id: 7, title: 'GUE Doubles Primer', category: 'existing-diver', description: 'Introduction to diving with double cylinders.', image: '/images/courses/GUE doublesDiver.jpg' },
		{ id: 8, title: 'GUE Drysuit Primer', category: 'existing-diver', description: 'Learn proper drysuit diving techniques.', image: '/images/courses/GUE drysuitDiver.jpg' },
		{ id: 9, title: 'GUE DPV 1', category: 'gue-diver', description: 'Underwater scooter operations for GUE divers.', image: '/images/courses/GUE dpvDiver.jpg' },
		{ id: 10, title: 'GUE Navigation Primer', category: 'gue-diver', description: 'Advanced underwater navigation techniques.', image: '/images/courses/GUE navigationDiver.jpg' },
		{ id: 11, title: 'GUE Deep Primer', category: 'gue-diver', description: 'Introduction to deeper recreational diving.', image: '/images/courses/GUE deepDiver.jpg' },
		{ id: 12, title: 'GUE Symbios CCR Fundamentals', category: 'rebreathers', description: 'Closed circuit rebreather training on the Symbios.', image: '/images/courses/GUE symbiosDiver.jpg' },
		{ id: 13, title: 'GUE JJ CCR Fundamentals', category: 'rebreathers', description: 'JJ-CCR rebreather certification and skills.', image: '/images/courses/GUE JJDiver.jpg' },
		{ id: 14, title: 'JJ CCR - MOD 1', category: 'rebreathers', description: 'Advanced JJ-CCR training module.', image: '/images/courses/GUE JJMOD1Diver.jpg' },
		{ id: 15, title: 'GUE Instructor Development', category: 'instructor', description: 'Become a GUE instructor. Learn to teach effectively.', image: '/images/courses/GUE instructorDevelopment.jpg' }
	];
	let visibleCourses = courses;

	function filterCourses(filter: CourseFilter) {
		activeFilter = filter;
		visibleCourses = filter === 'all' ? courses : courses.filter(c => c.category === filter);
	}

	function openTrainingView() {
		showTrainingView = true;
		activeFilter = 'all';
		visibleCourses = courses;
		document.body.style.overflow = 'auto';
		document.body.style.height = 'auto';
		if (leftSection) leftSection.style.clipPath = 'inset(0 0 0 0)';
	}

	function closeTrainingView() {
		showTrainingView = false;
		document.body.style.overflow = 'hidden';
		document.body.style.height = '100vh';

		// On mobile, return to training section (section 0)
		if (isMobile) {
			currentMobileSection = 0;
		}

		// On desktop, restore clip paths
		if (!isMobile) {
			if (leftSection) leftSection.style.clipPath = `inset(0 ${100 - sliderPosition}% 0 0)`;
			if (rightSection) rightSection.style.clipPath = `inset(0 0 0 ${sliderPosition}%)`;
		}
	}

	function handleNavClick(e: Event, target: string) {
		e.preventDefault();
		e.stopPropagation();
		if (target === 'training') {
			if (!showTrainingView) openTrainingView();
		} else if (target === 'home') {
			if (showTrainingView) {
				closeTrainingView();
			} else if (isMobile) {
				// On mobile, Homepage always goes to Training section (section 0)
				currentMobileSection = 0;
			}
		}
	}

	const trainingCTAs = [
		{
			title: 'Become a BETTER diver',
			subtitle: 'GUE curriculums & classes',
			id: 'better-diver'
		},
		{
			title: 'Go Bubble-less',
			subtitle: 'CCR curriculums & trainings',
			id: 'ccr'
		},
		{
			title: 'GUE Instructor Development',
			subtitle: 'learn to transfer knowledge on how to teach',
			id: 'instructor'
		}
	];

	const gearCTAs = [
		{
			title: 'Premium Equipment',
			subtitle: 'we only sell you what we use',
			id: 'premium'
		},
		{
			title: 'Latest Technologies',
			subtitle: 'breakthroughs in dive experiences',
			id: 'tech'
		},
		{
			title: 'Underwater Visual Content',
			subtitle: 'your underwater photography gear',
			id: 'visual'
		}
	];

	// Mobile swipe handlers
	function handleMobileTouchStart(e: TouchEvent) {
		if (!isMobile || showQuestionnaire || showTrainingView) return;

		touchStartX = e.touches[0].clientX;
		touchStartY = e.touches[0].clientY;
		isSwiping = true;
		swipeHintShown = true;
	}

	function handleMobileTouchMove(e: TouchEvent) {
		if (!isMobile || !isSwiping || showQuestionnaire || showTrainingView) return;

		touchCurrentX = e.touches[0].clientX;
		const touchCurrentY = e.touches[0].clientY;

		// Check if it's a horizontal swipe (not vertical scroll)
		const deltaX = Math.abs(touchCurrentX - touchStartX);
		const deltaY = Math.abs(touchCurrentY - touchStartY);

		if (deltaX > deltaY && deltaX > 10) {
			e.preventDefault(); // Prevent scrolling
		}
	}

	function handleMobileTouchEnd() {
		if (!isMobile || !isSwiping || showQuestionnaire || showTrainingView) return;

		const deltaX = touchCurrentX - touchStartX;
		const threshold = 50; // Minimum swipe distance

		if (Math.abs(deltaX) > threshold) {
			if (deltaX > 0 && currentMobileSection === 1) {
				// Swipe right - go to training
				currentMobileSection = 0;
			} else if (deltaX < 0 && currentMobileSection === 0) {
				// Swipe left - go to gear
				currentMobileSection = 1;
			}
		}

		isSwiping = false;
		touchStartX = 0;
		touchCurrentX = 0;
	}

	function switchMobileSection(section: number) {
		if (!isMobile) return;
		currentMobileSection = section;
	}

	onMount(() => {
		// Initialize current date
		currentDate = formatDate();

		// Check if mobile
		const checkMobile = () => {
			isMobile = window.innerWidth <= 768;
		};
		checkMobile();
		window.addEventListener('resize', checkMobile);

		// Initialize clip paths (horizontal orientation) - only for desktop
		if (!isMobile) {
			if (leftSection) {
				leftSection.style.clipPath = `inset(0 ${100 - sliderPosition}% 0 0)`;
			}
			if (rightSection) {
				rightSection.style.clipPath = `inset(0 0 0 ${sliderPosition}%)`;
			}
			// Initialize logo clip paths (matching HTML version exactly)
			if (logoLeft && logoRight) {
				logoLeft.style.clipPath = `inset(0 ${100 - sliderPosition}% 0 0)`;
				logoRight.style.clipPath = `inset(0 0 0 ${sliderPosition}%)`;
			}
		}

		return () => {
			window.removeEventListener('resize', checkMobile);
		};
	});

	function handleSliderMouseDown(e: MouseEvent) {
		e.preventDefault();
		isDragging = true;
		updateSliderPosition(e);
	}

	function handleMouseMove(e: MouseEvent) {
		if (isDragging) {
			e.preventDefault();
			updateSliderPosition(e);
		}
	}

	function handleMouseUp() {
		isDragging = false;
	}

	function handleTouchStart(e: TouchEvent) {
		isDragging = true;
		const touch = e.touches[0];
		updateSliderPosition({ clientX: touch.clientX } as MouseEvent);
	}

	function handleTouchMove(e: TouchEvent) {
		if (isDragging) {
			e.preventDefault();
			const touch = e.touches[0];
			updateSliderPosition({ clientX: touch.clientX } as MouseEvent);
		}
	}

	function handleTouchEnd() {
		isDragging = false;
	}

	function updateSliderPosition(e: MouseEvent) {
		const container = document.querySelector('.split-container');
		if (container) {
			const rect = container.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const percentage = (x / rect.width) * 100;
			sliderPosition = Math.max(10, Math.min(90, percentage));

			// Direct updates for instant response (horizontal orientation)
			if (sliderBar) {
				sliderBar.style.left = sliderPosition + '%';
			}
			if (leftSection) {
				leftSection.style.clipPath = `inset(0 ${100 - sliderPosition}% 0 0)`;
			}
			if (rightSection) {
				rightSection.style.clipPath = `inset(0 0 0 ${sliderPosition}%)`;
			}

			// Update logo clip paths - only split when slider is near center (45-55%)
			// Matching HTML version exactly
			if (logoLeft && logoRight) {
				if (sliderPosition < 45) {
					// Slider is far left, show full white logo for dark background
					logoLeft.style.clipPath = `inset(0 100% 0 0)`;
					logoRight.style.clipPath = `inset(0 0 0 0%)`;
				} else if (sliderPosition > 55) {
					// Slider is far right, show full dark logo for light background
					logoLeft.style.clipPath = `inset(0 0% 0 0)`;
					logoRight.style.clipPath = `inset(0 0 0 100%)`;
				} else {
					// Slider is near center, split the logo
					logoLeft.style.clipPath = `inset(0 ${100 - sliderPosition}% 0 0)`;
					logoRight.style.clipPath = `inset(0 0 0 ${sliderPosition}%)`;
				}
			}

			// Update arrow sizes based on slider position
			if (arrowLeft && arrowRight) {
				if (sliderPosition < 45) {
					arrowLeft.classList.add('active');
					arrowRight.classList.remove('active');
				} else if (sliderPosition > 55) {
					arrowLeft.classList.remove('active');
					arrowRight.classList.add('active');
				} else {
					arrowLeft.classList.remove('active');
					arrowRight.classList.remove('active');
				}
			}
		}
	}

	function selectSection(section: Section) {
		activeSection = section;
	}

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	async function typeMessage(text: string, delay = 30): Promise<void> {
		return new Promise((resolve) => {
			let index = 0;
			const interval = setInterval(() => {
				if (index < text.length) {
					index++;
				} else {
					clearInterval(interval);
					resolve();
				}
			}, delay);
		});
	}

	async function handleCTAClick(ctaId: string, section: Section) {
		console.log('CTA clicked:', ctaId, section);

		// Set current flow
		currentFlow = ctaId;

		// On mobile, ensure we stay on the section where CTA was clicked
		if (isMobile) {
			if (section === 'training') {
				currentMobileSection = 0;
			} else if (section === 'gear') {
				currentMobileSection = 1;
			}
		}

		// Wait for animation
		await new Promise(resolve => setTimeout(resolve, 100));

		// Show questionnaire
		showQuestionnaire = true;
		console.log('Questionnaire shown');

		// Start questionnaire based on CTA
		if (ctaId === 'better-diver') {
			console.log('Starting better diver flow');
			await startBetterDiverFlow();
		} else if (ctaId === 'ccr') {
			await startCCRFlow();
		} else if (ctaId === 'instructor') {
			await startInstructorFlow();
		}
	}

	async function startBetterDiverFlow() {
		// Show message with fade in animation (handled by CSS)
		const questionText = 'Are you an existing diver with any other agency?';
		messages = [{ type: 'question', text: questionText, typing: false }];

		// Small delay before showing options
		await new Promise(resolve => setTimeout(resolve, 400));
		currentQuestion = 'existing-diver';
		questionOptions = ['Yes', 'No', 'I am already a GUE certified diver'];
	}

	async function handleAnswer(answer: string) {
		// Add user's answer to messages
		messages = [...messages, { type: 'answer', text: answer }];

		// Clear current question
		currentQuestion = null;
		questionOptions = [];

		// Wait a bit
		await new Promise(resolve => setTimeout(resolve, 500));

		// Handle the answer based on response
		if (answer === 'Yes') {
			// Show products for existing divers with other agencies
			showProducts = true;
			currentProductIndex = 0;
			products = [
				'GUE Performance Diver',
				'GUE Basic Fundamentals',
				'GUE Technical Fundamentals',
				'GUE Doubles Primer',
				'GUE Drysuit Primer'
			];
		} else if (answer === 'No') {
			// Show beginner products
			showProducts = true;
			currentProductIndex = 0;
			products = [
				'GUE Discover Diving',
				'GUE Scuba Diver',
				'GUE Open Water Diver'
			];
		} else if (answer === 'I am already a GUE certified diver') {
			// Show advanced products for GUE certified divers
			showProducts = true;
			currentProductIndex = 0;
			products = [
				'GUE DPV 1',
				'GUE Navigation Primer',
				'GUE Deep Primer',
				'GUE Doubles Primer',
				'GUE Drysuit Primer'
			];
		}
	}

	async function closeQuestionnaire() {
		// First hide the questionnaire
		showQuestionnaire = false;
		showProducts = false;
		showCallToAction = false;
		messages = [];
		currentQuestion = null;
		questionOptions = [];
		currentProductIndex = 0;
		currentFlow = '';

		// Wait a moment for questionnaire to fade out, then animate CTA back
		await new Promise(resolve => setTimeout(resolve, 300));
	}

	async function startCCRFlow() {
		// Show message with fade in animation (handled by CSS)
		const titleText = 'A modern tool with a purpose, cross into the CCR world as an effective approach for a multitude of diving goals, such as but not limited to, deeper dives, extended ranges, underwater content creation';
		messages = [{ type: 'question', text: titleText, typing: false }];

		// Wait a moment then show products
		await new Promise(resolve => setTimeout(resolve, 500));

		// Show CCR products
		showProducts = true;
		currentProductIndex = 0;
		products = [
			'GUE Symbios CCR Fundamentals',
			'GUE JJ CCR Fundamentals',
			'JJ CCR - MOD 1'
		];
	}

	async function startInstructorFlow() {
		// Show message with fade in animation (handled by CSS)
		const questionText = 'If you see yourself as a GUE Instructor, that\'s your starting point here';
		messages = [{ type: 'question', text: questionText, typing: false }];

		// Small delay before showing CTA
		await new Promise(resolve => setTimeout(resolve, 400));
		showCallToAction = true;
	}

	function scrollProducts(direction: 'prev' | 'next', grid: HTMLDivElement | null) {
		if (!grid) return;

		// Update index
		if (direction === 'next') {
			currentProductIndex = Math.min(currentProductIndex + 2, products.length - 1);
		} else {
			currentProductIndex = Math.max(currentProductIndex - 2, 0);
		}

		const scrollAmount = grid.clientWidth / 2;
		const newScrollPosition = grid.scrollLeft + (direction === 'next' ? scrollAmount : -scrollAmount);
		grid.scrollTo({
			left: newScrollPosition,
			behavior: 'smooth'
		});
	}
</script>

<svelte:window
	on:mousemove={handleMouseMove}
	on:mouseup={handleMouseUp}
	on:touchmove={handleTouchMove}
	on:touchend={handleTouchEnd}
/>

<div
	class="split-container"
	class:training-active={showTrainingView}
	class:mobile-view={isMobile}
	class:mobile-section-0={isMobile && currentMobileSection === 0}
	class:mobile-section-1={isMobile && currentMobileSection === 1}
	on:touchstart={handleMobileTouchStart}
	on:touchmove={handleMobileTouchMove}
	on:touchend={handleMobileTouchEnd}
	role="region"
	aria-label="Main content"
>
	<!-- Left Section - Dive Training -->
	<button
		bind:this={leftSection}
		class="split-section left"
		class:active={sliderPosition < 50}
		class:expanded={showTrainingView}
		on:click={() => selectSection('training')}
	>
		<div class="section-content">
			{#if !showTrainingView}
				<div class="logo">OCEAN FRONTIER</div>
				<div class="logo-subtitle">CONSULTING</div>
				<nav class="nav">
					<a href="/" on:click|preventDefault|stopPropagation={(e) => handleNavClick(e, 'home')}>HOMEPAGE</a>
					<a href="/training" class:nav-active={showTrainingView} on:click|preventDefault|stopPropagation={(e) => handleNavClick(e, 'training')}>TRAINING</a>
					<a href="/gear">GEAR</a>
					<a href="/community">COMMUNITY</a>
				</nav>
			{/if}

			{#if showTrainingView}
				<!-- Training View Header - Centered -->
				<div class="training-header">
					<div class="logo centered">OCEAN FRONTIER</div>
					<div class="logo-subtitle centered">CONSULTING</div>
					<nav class="nav centered">
						<a href="/" on:click|preventDefault|stopPropagation={(e) => handleNavClick(e, 'home')}>HOMEPAGE</a>
						<a href="/training" class:nav-active={showTrainingView} on:click|preventDefault|stopPropagation={(e) => handleNavClick(e, 'training')}>TRAINING</a>
						<a href="/gear">GEAR</a>
						<a href="/community">COMMUNITY</a>
					</nav>
				</div>

				<!-- Close X Button -->
				<button class="close-x-button" on:click={() => closeTrainingView()} aria-label="Close training view">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>

				<!-- Training View: Filter Bar -->
				<div class="training-content">
					<nav class="filter-bar">
						<a href="#all" class="filter-link" class:active={activeFilter === 'all'} on:click|preventDefault|stopPropagation={() => filterCourses('all')}>ALL COURSES</a>
						<span class="filter-separator">/</span>
						<a href="#non-diver" class="filter-link" class:active={activeFilter === 'none-diver'} on:click|preventDefault|stopPropagation={() => filterCourses('none-diver')}>NON DIVER</a>
						<span class="filter-separator">/</span>
						<a href="#existing" class="filter-link" class:active={activeFilter === 'existing-diver'} on:click|preventDefault|stopPropagation={() => filterCourses('existing-diver')}>EXISTING DIVER</a>
						<span class="filter-separator">/</span>
						<a href="#gue" class="filter-link" class:active={activeFilter === 'gue-diver'} on:click|preventDefault|stopPropagation={() => filterCourses('gue-diver')}>GUE DIVER</a>
						<span class="filter-separator">/</span>
						<a href="#rebreathers" class="filter-link" class:active={activeFilter === 'rebreathers'} on:click|preventDefault|stopPropagation={() => filterCourses('rebreathers')}>REBREATHERS</a>
						<span class="filter-separator">/</span>
						<a href="#instructor" class="filter-link" class:active={activeFilter === 'instructor'} on:click|preventDefault|stopPropagation={() => filterCourses('instructor')}>INSTRUCTOR</a>
					</nav>
				</div>

				<!-- Main Training Layout: Hero Left + Courses Right -->
				<div class="training-main-layout">
					<!-- Hero Section - Left Side -->
					<div class="training-hero">
						<h1 class="training-hero-title">Discover Your Perfect Dive Course</h1>
						<p class="training-hero-description">Our training programs are designed for divers who demand excellence, precision, and mastery in every environment. Whether your objective is technical diving, cave exploration, or the development of world-class foundational skills, GUE sets the global benchmark for uncompromising training standards.</p>
						<p class="training-hero-tagline">Train for Mastery, learn to explore</p>

						<!-- Mobile: Collapsible content with read more -->
						<div class="hero-expandable" class:expanded={heroExpanded}>
							<div class="hero-expandable-content">
								<p class="training-hero-intro">These curricula are built for divers who:</p>
								<ul class="training-hero-list">
									<li>Value discipline, structure, and consistency</li>
									<li>Commit to long-term progression rather than shortcuts</li>
									<li>Seek to explore demanding environments with confidence and control</li>
									<li>Understand that true excellence is achieved through repetition, precision, and intent</li>
								</ul>
								<div class="training-hero-cta-wrapper">
									<p class="training-hero-cta-title">Don't know what's best for you?</p>
									<button class="training-hero-cta" on:click={() => handleCTAClick('better-diver', 'training')}>
										Let us Guide you
									</button>
								</div>
							</div>
							<div class="hero-fade-overlay" class:hidden={heroExpanded}></div>
						</div>

						<!-- Read More/Less Button (mobile only) -->
						<button class="read-more-button" class:expanded={heroExpanded} on:click={() => heroExpanded = !heroExpanded}>
							<span>{heroExpanded ? 'Read less' : 'Read more'}</span>
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<polyline points="6 9 12 15 18 9"></polyline>
							</svg>
						</button>
					</div>

					<!-- Courses Grid - Right Side -->
					<div class="courses-container">
						<div class="courses-grid">
							{#each visibleCourses as course, i (course.id)}
								<div class="course-card" style="--card-index: {i}">
									<div class="course-image-wrapper">
										<div class="course-image" style="background-image: url('{course.image}')">
											<div class="image-overlay"></div>
										</div>
									</div>
									<div class="course-content">
										<h3 class="course-title">{course.title}</h3>
										<p class="course-description">{course.description}</p>
										<button class="course-cta" on:click|stopPropagation>Learn More</button>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{:else}
			<div class="cta-container" class:minimized={showQuestionnaire} class:hidden={showTrainingView}>
				{#each trainingCTAs as cta, i}
					<div
						class="cta-item"
						style="--item-index: {i}"
						on:click|stopPropagation={() => handleCTAClick(cta.id, 'training')}
						on:keydown|stopPropagation={(e) => e.key === 'Enter' && handleCTAClick(cta.id, 'training')}
						role="button"
						tabindex="0"
					>
						<h2 class="cta-title">{cta.title}</h2>
						<p class="cta-subtitle">{cta.subtitle}</p>
					</div>
				{/each}
			</div>
			{/if}

			{#if !showTrainingView}
			<div class="section-label">
				<span class="label-text">DIVE TRAINING</span>
			</div>
		{/if}

		<!-- Questionnaire Panel for Left Section -->
			{#if showQuestionnaire}
				<div class="questionnaire-panel" class:active={showQuestionnaire}>
					<div class="questionnaire-content-wrapper">
						<button class="close-button" on:click={closeQuestionnaire} aria-label="Close">
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<line x1="18" y1="6" x2="6" y2="18"></line>
								<line x1="6" y1="6" x2="18" y2="18"></line>
							</svg>
						</button>

						<div class="questionnaire-content">
							<h2 class="questionnaire-title">
								{#if currentFlow === 'ccr'}
									Cross into the Closed Circuit Rebreather World
								{:else if currentFlow === 'instructor'}
									Instructor Development
								{:else}
									Find Your Path
								{/if}
							</h2>

							<!-- Messages -->
							<div class="messages-container">
								{#each messages as message, i}
									<div class="message message-{message.type}" style="--message-index: {i}">
										{#if message.type === 'question'}
											<div class="message-bubble bot-message" class:instructor-message={currentFlow === 'instructor' || currentFlow === 'ccr'}>
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
										<button
											class="option-button"
											on:click={() => handleAnswer(option)}
										>
											{option}
										</button>
									{/each}
								</div>
							{/if}

							<!-- Call to Action Button -->
							{#if showCallToAction}
								<div class="cta-button-container">
									<button class="primary-cta-button">
										Let us discuss your path
									</button>
								</div>
							{/if}

							<!-- Products Display -->
							{#if showProducts}
								<div class="products-container">
									<h3 class="products-title">Recommended Courses</h3>
									<div class="products-carousel-wrapper">
										<button
											class="carousel-button prev"
											on:click={() => scrollProducts('prev', productsGridLeft)}
											aria-label="Previous products"
										>
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
												<polyline points="15 18 9 12 15 6"></polyline>
											</svg>
										</button>
										<div class="products-grid" bind:this={productsGridLeft}>
											{#each products as product, i}
												<div class="product-card" style="--product-index: {i}">
													<div class="product-icon">
														<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
															<path d="M12 2L2 7l10 5 10-5-10-5z"></path>
															<path d="M2 17l10 5 10-5"></path>
															<path d="M2 12l10 5 10-5"></path>
														</svg>
													</div>
													<h4 class="product-name">{product}</h4>
													<button class="product-button">Learn More</button>
												</div>
											{/each}
										</div>
										<button
											class="carousel-button next"
											on:click={() => scrollProducts('next', productsGridLeft)}
											aria-label="Next products"
										>
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
												<polyline points="9 18 15 12 9 6"></polyline>
											</svg>
										</button>
									</div>
									<div class="product-counter">
										{Math.min(currentProductIndex + 1, products.length)}/{products.length}
									</div>
								</div>
							{/if}
						</div>
					</div>
				</div>
			{/if}

		</div>
	</button>

	<!-- Right Section - Dive Gear -->
	<button
		bind:this={rightSection}
		class="split-section right"
		class:active={sliderPosition > 50}
		class:hidden={showTrainingView}
		on:click={() => selectSection('gear')}
	>
		<div class="section-content">
			<div class="logo">OCEAN FRONTIER</div>
			<div class="logo-subtitle">CONSULTING</div>
			<nav class="nav">
				<a href="/" on:click|preventDefault|stopPropagation={(e) => handleNavClick(e, 'home')}>HOMEPAGE</a>
				<a href="/gear">GEAR</a>
				<a href="/training" on:click|preventDefault|stopPropagation={(e) => handleNavClick(e, 'training')}>TRAINING</a>
				<a href="/community">COMMUNITY</a>
			</nav>

			<div class="cta-container" class:minimized={showQuestionnaire} class:hidden={showTrainingView}>
				{#each gearCTAs as cta, i}
					<div
						class="cta-item"
						style="--item-index: {i}"
						on:click|stopPropagation={() => handleCTAClick(cta.id, 'gear')}
						on:keydown|stopPropagation={(e) => e.key === 'Enter' && handleCTAClick(cta.id, 'gear')}
						role="button"
						tabindex="0"
					>
						<h2 class="cta-title">{cta.title}</h2>
						<p class="cta-subtitle">{cta.subtitle}</p>
					</div>
				{/each}
			</div>

			<div class="section-label">
				<span class="label-text">DIVE GEAR</span>
			</div>

		<!-- Questionnaire Panel for Right Section -->
			{#if showQuestionnaire}
				<div class="questionnaire-panel" class:active={showQuestionnaire}>
					<div class="questionnaire-content-wrapper">
						<button class="close-button" on:click={closeQuestionnaire} aria-label="Close">
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<line x1="18" y1="6" x2="6" y2="18"></line>
								<line x1="6" y1="6" x2="18" y2="18"></line>
							</svg>
						</button>

						<div class="questionnaire-content">
							<h2 class="questionnaire-title">
								{#if currentFlow === 'ccr'}
									Cross into the Closed Circuit Rebreather World
								{:else if currentFlow === 'instructor'}
									Instructor Development
								{:else}
									Find Your Gear
								{/if}
							</h2>

							<!-- Messages -->
							<div class="messages-container">
								{#each messages as message, i}
									<div class="message message-{message.type}" style="--message-index: {i}">
										{#if message.type === 'question'}
											<div class="message-bubble bot-message" class:instructor-message={currentFlow === 'instructor' || currentFlow === 'ccr'}>
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
										<button
											class="option-button"
											on:click={() => handleAnswer(option)}
										>
											{option}
										</button>
									{/each}
								</div>
							{/if}

							<!-- Call to Action Button -->
							{#if showCallToAction}
								<div class="cta-button-container">
									<button class="primary-cta-button">
										Let us discuss your path
									</button>
								</div>
							{/if}

							<!-- Products Display -->
							{#if showProducts}
								<div class="products-container">
									<h3 class="products-title">Recommended Equipment</h3>
									<div class="products-carousel-wrapper">
										<button
											class="carousel-button prev"
											on:click={() => scrollProducts('prev', productsGridRight)}
											aria-label="Previous products"
										>
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
												<polyline points="15 18 9 12 15 6"></polyline>
											</svg>
										</button>
										<div class="products-grid" bind:this={productsGridRight}>
											{#each products as product, i}
												<div class="product-card" style="--product-index: {i}">
													<div class="product-icon">
														<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
															<path d="M12 2L2 7l10 5 10-5-10-5z"></path>
															<path d="M2 17l10 5 10-5"></path>
															<path d="M2 12l10 5 10-5"></path>
														</svg>
													</div>
													<h4 class="product-name">{product}</h4>
													<button class="product-button">Learn More</button>
												</div>
											{/each}
										</div>
										<button
											class="carousel-button next"
											on:click={() => scrollProducts('next', productsGridRight)}
											aria-label="Next products"
										>
											<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
												<polyline points="9 18 15 12 9 6"></polyline>
											</svg>
										</button>
									</div>
									<div class="product-counter">
										{Math.min(currentProductIndex + 1, products.length)}/{products.length}
									</div>
								</div>
							{/if}
						</div>
					</div>
				</div>
			{/if}

		</div>
	</button>

	<!-- Slider Bar -->
	<div bind:this={sliderBar} class="slider-bar" class:hidden={showTrainingView} style="left: {sliderPosition}%">
		<button
			class="slider-handle"
			on:mousedown={handleSliderMouseDown}
			on:touchstart={handleTouchStart}
		>
			<div class="slider-toggle-thumb">
				<div class="slider-arrows">
					<svg bind:this={arrowLeft} class="slider-chevron" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
						<polyline points="15 18 9 12 15 6"></polyline>
					</svg>
					<svg bind:this={arrowRight} class="slider-chevron" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
						<polyline points="9 18 15 12 9 6"></polyline>
					</svg>
				</div>
			</div>
		</button>
	</div>

	<!-- Social Links -->
	<div class="social-links left-social" class:hidden={showTrainingView}>
		<div class="social-text">
			<a href="https://facebook.com" target="_blank" rel="noopener">FB</a>
			<span> . </span>
			<a href="https://linkedin.com" target="_blank" rel="noopener">IN</a>
			<span> . </span>
			<a href="mailto:info@oceanfrontier.com" class="mail-icon">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<rect x="2" y="4" width="20" height="16" rx="2"/>
					<path d="m2 7 10 7 10-7"/>
				</svg>
			</a>
		</div>
	</div>

	<!-- Date Display -->
	<div class="date-display" class:hidden={showTrainingView}>
		<span class="date-text">{currentDate} . concept and design by Imad Farhat - copyright 2026, all rights reserved</span>
	</div>

	<!-- Center Logo - Split for background reactivity -->
	<div bind:this={logoLeft} class="center-logo-left" class:hidden={showQuestionnaire || showTrainingView}>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 283.46 283.46">
			<path style="fill: #2a2a2a !important;" d="M179.77,104.39c-.87.44-1.34,1.69-2.36,1.75-1.25.07.05-1.34.18-1.61.65-1.33-.2-2.58.07-3.32.22-.59,1.08-.7,1.39-1.35.27-.57-.2-1.25.11-1.82l-.38-.15c-.28,1.22.5,1.42-.61,2.39-.68.59-1.45.24-2.19-.2-.48-.28-1.51-1.97-1.4-2.5l1.1.17-1.09-.53.07-.44c-.82,1.35-2.47-1.07-2.54-1.95-.13-2,3.09-1.18,4.2-1.08l.18-.57-3.49.05c-.6.24-1.08,1.2-1.65,1.3-.66.11-1.57-.64-2.9-.23-.5.16-1.36.99-1.79.42-.47-.61,1.97-2.59,2.45-2.36l.85.68-.14-.71-.99-.47,1.09-1.52c1.34.47,2.5.47,2.99-1.08,0,0,.28.39.55.26.28-.13-.05-.77-.05-.77-.8-.17-1.7,3.07-3.56.9-.22-.26.37-.75.04-.97-.48.44-.18,1.09-.4,1.57-.21.45-.92,1.38-1.27,1.79-.92,1.07-2.16,1.98-3.08,3.07-.15-1.58-.91-3.98-.47-5.51.72-2.46,4.27-4.32,5.82-6.39,2.79-2.15,4.43.86,7.2,1.11,0,0,.74-.16-.28-.81-1.02-.66-2.39-1.4-3.62-2.05-.92-.48-1.92-.4-2.48-1.39-.51-.91-1.68-4.62-1.54-5.62.35-2.57,2.73-2.05,3.25-3.8.51-1.76-.8-.96-.8-.96-1.03,1.52-2.51,1.4-3.18,3.31-.86,2.48,1.59,7.74,1.08,8.84-.44.95-1.81,1.64-2.61,2.36-2.05,1.85-4.16,3.35-4.61,6.27-.21,1.37.46,3.67-.07,4.88-.55,1.24-2.09,2.2-2.82.6-.26-.57-1.39-5.2-1.39-5.78,0-.68.27-1.3.23-2.05-.09-1.99-2.41-6.1-.88-7.85.47-.54,2.61-1.22,3.55-2.02.81-.7,1.41-1.4,1.83-2.39l-2.43,2.19c-.55.36-1.11.6-1.77.4.16-2.23.39-2.78.01-4.93-.05-.32-.19-1.14-.64-2.24-.45-1.09-1.84-1.07-2.46-1.02.14.41.73.4,1.05.68,1.21,1.03,1.64,4.89,1.26,6.38-.21.82-1.33,3.26-2.29,2.68-.61-.37-2.89-3.27-3.44-4.03-1.06-1.47-2.45-3.12-1.32-4.94.96-1.57,2.05-1.58,2.18-4.08.08-1.53-.08-2.7-1.33-4.46-1.25-1.77-.99-.17-.99-.17.63.76.77,1.72.7,2.35-.33,2.61,1.68,2.52-.05,4.21-.29.28-2.69,2.02-3.08,2.22-1.66.89-2.12-.54-3.08-1.29-1.35-1.06-2.08-1.71-3.4-2.49-2.07-1.2.06-3.69-.79-3.48-.84.22-1.18,2.84-1.18,2.84-1.25-1.49-2.37-3.10-3.42-4.73-.62-.97-1.11-2.15-1.71-3.02-.11-.17-.37-.59-.55-.27.42,1.72,1.16,2.59,1.79,4.03.32.72.53,1.81,1.41,2.24-.12-.03-.75-.15-2.09.76-1.49,1.02,1.23-1.16,3.26.85,1.25.66,3.19,1.76,4.17,2.42.94.64,2.11,1.83,3.07,2.49.86.6,2.3.8,2.93,1.36.54.47,1.12,1.93,1.58,2.61,3.27,4.76,6.2,7.44,6.41,13.7.01.25.16.43-.11.66-.84-.99-2.03-1.34-2.97-2.16-.93-.81-1.76-2.15-2.6-3.01-1.55-1.61-3.79-3.22-4.74-5.38-.28-.63.19-1.32-.57-1.69l.22,1.04c-.12.28-1.82.85-2.16.72-.5-.19-.98-1.21-1.64-.89.6.33,1.23,1.06,1.85,1.28.44.15,1.15-.27,1.55-.19.9.17,1.43,1.66,2.01,2.32-.26.63-.74.36-1.28.42l.21.42-.68.59c.61.21,1.16-.7,1.59-.77.79-.13,3.12,2.38,3.58,3.15.17.27.39.22.09.51-.77.73-2.08-.71-2.75-1.06-1.3-.69-2.96.08-3.91-.29-.81-.33-1.5-1.8-2.8-2.23-.13-.05-1.99-.19-2.33-.21-.15-.01-.71-.22-.6.2.04.19,2.82.48,3.3.45.41.18,1.47,1.25,1.66,1.64.28.57-.75,2.8-1.65,2.88l.15.48c.36-.38.9-.56,1.22-.98.46-.61.21-1.36.84-1.72.28-.16,3.2-.11,3.59.03.73.27,1.8,1.11,1.81,1.88l-.88-.15c.44.28.69.34.5.86.23-.32,1.6-.53,1.93-.46.53.11.91.62,1.42.84.5.21,1.26.26,1.67.53.23.15,2.35,3.07,2.55,3.43.66,1.2,1.38,7.12,1.75,8.87.42,2.04,1.32,3.45,1.13,5.69-.1,1.18-.56,2.28-.74,3.41-.55,3.41,2.46,7.28.64,10.13-.97,1.52-.7-1.56-1.38-4.27-1.13-4.49-5.24-7.11-7.22-11.17-.32-.66-3.15-6.13-3.19-6.46-.06-.42.26-1.12.27-1.77.02-1.51-.49-3.24-.47-4.79l-.39.22c-.32-.71-.54-1.82-1.23-2.24l1.44,3.13-1.81-.57,1.73,1.37c.13.76-.07,1.53-.03,2.29.02.32.32.69.29.97-.11.86-2.84.77-3.54.15-.21-.18-1.31-1.63-1.49-1.91-.39-.59-.22-1.32-.52-1.92-.55-1.12-1.87-1.76-2.07-3.03l-.07.8.77,1.31-1.71-.34c-.05.53-.34.49-.74.66.5.43.79-.24,1.31-.26.44-.01,1.35.41,1.71.69.89.71.38,1.28.82,2.03.13.24,2.02,2.67,2.16,2.78.78.56,2.02-.09,3.22,1.2.4.44,1.87,4.16,1.65,4.45-1.78.23-3.05-.93-4.02-2.27.09,1.56,1.45,1.9,2.57,2.58-.4.64-1.08.4-1.63.56,1.77.76,2.06-1.11,3.86.58.7.66,3.11,4.77,3.38,5.75.1.36.16.74.2,1.11-.27.64-1.5-.44-1.8-.71-1.26-1.15-2.13-3.42-3.58-4.28-1.13-.67-3.09-.17-4.28-.86-1.11-1.29-2.38-4.3-3.63-5.29-.53-.42-1.26-.31-1.79-.58-.78-.4-2.89-1.7-3.46-2.28-.4-.41-.51-.98-.93-1.35-.16.38.53,1.16.17,1.47-.4.35-1.22-.6-1.5.04.63.3,1.36.22,2.02.52,1.29.58,2.37,1.41,3.53,2.15.51.32,1.37.36,1.78.65.67.48,2.98,3.89,2.38,4.72-.16.22-1.73,1.82-1.98,2-2.13,1.5-3.9,0-5.48-1.53l.85,1.21-.57.45c.86.49,1.79-.09,2.57.87l-2.19,2.37,2.65-1.78c2.09,0,3.44-2.11,4.99-2.71.42-.16,4.26.36,4.69.6.65.36,3.04,3.91,3.2,4.71.05.27.13.44-.11.66l-1.35-1.21-.06.44-1.14-.82,1.62,1.53-.44,1.29.37.15c.19-1.41.75-.77,1.45-.81,1.43-.08,2.81-.41,3.67,1.11,1.55,2.75,2.6,3.54.99,6.14-.31.48-1.24.77-1.91.54-1.15-.39-1.51-.16-1.77-1.37-.36-1.74,1.18-1.72,1.16-1.98l-.63.03c-.16-.12.24-1.28-.31-1.45.22.18-.38,2.31-.81,1.63-.29-1.48-3.7-3.74-4.53-4.97-.36-.54-.82-.69-1.18-1.10-.51-.58-.65-2.28-1.65-1.38,1.13.19,1.08,1.38,1.52,1.97,1.05,1.38,2.45,2.15,2.96,4.10.08.32.68,1.74.38,1.82-.7-.69-3.37-2.81-4.15-3.21-.8-.39-1.21.85-1.77.68-.41-.51-1.28-.45-1.66-.7-.61-.39-.98-1.56-1.7-1.92-.19.21.19.53.33.73.99,1.38,1.91,1.48.51,3.28l.57.69c.23-.24.02-.66.18-1.03.2-.48.64-1.08,1.23-.86,1.11.4.5.89,1.86-.21.48,0,3.29,1.57,3.57,2.08,2.28,4.08,3.8,2.43,3.69,5.66v.07c-1.06,11.83-4.89,15.95-14.1,15.95-11.2,0-14.43-6.11-14.43-24.78v-53.32c0-18.5,3.23-24.62,14.43-24.62,10.41,0,13.94,5.28,14.39,20.87h20.36c-.83-25.53-10.44-38.52-34.75-38.52s-34.8,14.26-34.8,42.27v53.32c0,28.18,9.34,42.44,34.8,42.44,22.53,0,32.44-11.15,34.43-33.24.03-.16.05-.34.06-.52.09-2.45,1.14-11.65,1.91-13.52.56-1.37,1.65-1.15,1.98-1.61.21-.29-.08-.71.02-1.01.26-.75,1.39-1.10,1.98-1.59.17-.15,1.81-1.72,1.08-1.69ZM162.78,108.46c.31-1.97.92-3.56,1.25-5.43.18-1.09-.32-2.07-.25-2.69.05-.56.53-.75.61-1.09.06-.24-.1-.77-.04-1.14.22-1.43.82-1.98,2.2-2.34.59-.15,1.18.38,1.59.11l.3-.38-.72-.02c.35-1.33,3.26-1.05,4-.58.49.32.29.89.69,1.24-.29.22-.68-.18-.89.37-.21.54-.19,2.38-.41,3.21-.59,2.24-1.14,2.08-2.18,3.64-.34.5-.59,4.57-.54,5.4.08,1.37.49,3.13,1.2,4.31.06.67-1.77-.31-2-.45-1.4-.88-2.15-2.01-3.36-3.04-.05,1.21,1.11,1.63,1.58,2.6.15.76-.84.65-.81.78,2.33.49,4.04.77,5.26,3.08,2.02,3.81-1.31,6.74-3.39,4.96-2.16-1.86-2.57-3.74-2.79-6.07-.22-2.21-1.64-4.24-1.3-6.47ZM176.1,104.7l.19-.6-.74.33c.76,1.43.45,1.5-.19,2.75-.11.21-.04.54-.15.73-.48.83-3.02,1.35-2.42,2.43l-1.93,2.16c-.86-.4-1.81-5.95-1.59-7.04.29-1.47,1.16-1.63,1.78-2.72.99-1.72.58-4.36,1.73-6.09.48.45,1.54.76,1.39,1.49l-.8-.42c.93.62,1.48,1.83,2.23,2.42.56.45,1.22.39,1.67,1.14.06.09.25,2.11.21,2.26-.14.61-.7,1.67-1.38,1.16Z"/>
		</svg>
	</div>
	<div bind:this={logoRight} class="center-logo-right" class:hidden={showQuestionnaire || showTrainingView}>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 283.46 283.46">
			<path style="fill: #ffffff !important;" d="M179.77,104.39c-.87.44-1.34,1.69-2.36,1.75-1.25.07.05-1.34.18-1.61.65-1.33-.2-2.58.07-3.32.22-.59,1.08-.7,1.39-1.35.27-.57-.2-1.25.11-1.82l-.38-.15c-.28,1.22.5,1.42-.61,2.39-.68.59-1.45.24-2.19-.2-.48-.28-1.51-1.97-1.4-2.5l1.1.17-1.09-.53.07-.44c-.82,1.35-2.47-1.07-2.54-1.95-.13-2,3.09-1.18,4.2-1.08l.18-.57-3.49.05c-.6.24-1.08,1.2-1.65,1.3-.66.11-1.57-.64-2.9-.23-.5.16-1.36.99-1.79.42-.47-.61,1.97-2.59,2.45-2.36l.85.68-.14-.71-.99-.47,1.09-1.52c1.34.47,2.5.47,2.99-1.08,0,0,.28.39.55.26.28-.13-.05-.77-.05-.77-.8-.17-1.7,3.07-3.56.9-.22-.26.37-.75.04-.97-.48.44-.18,1.09-.4,1.57-.21.45-.92,1.38-1.27,1.79-.92,1.07-2.16,1.98-3.08,3.07-.15-1.58-.91-3.98-.47-5.51.72-2.46,4.27-4.32,5.82-6.39,2.79-2.15,4.43.86,7.2,1.11,0,0,.74-.16-.28-.81-1.02-.66-2.39-1.4-3.62-2.05-.92-.48-1.92-.4-2.48-1.39-.51-.91-1.68-4.62-1.54-5.62.35-2.57,2.73-2.05,3.25-3.8.51-1.76-.8-.96-.8-.96-1.03,1.52-2.51,1.4-3.18,3.31-.86,2.48,1.59,7.74,1.08,8.84-.44.95-1.81,1.64-2.61,2.36-2.05,1.85-4.16,3.35-4.61,6.27-.21,1.37.46,3.67-.07,4.88-.55,1.24-2.09,2.2-2.82.6-.26-.57-1.39-5.2-1.39-5.78,0-.68.27-1.3.23-2.05-.09-1.99-2.41-6.1-.88-7.85.47-.54,2.61-1.22,3.55-2.02.81-.7,1.41-1.4,1.83-2.39l-2.43,2.19c-.55.36-1.11.6-1.77.4.16-2.23.39-2.78.01-4.93-.05-.32-.19-1.14-.64-2.24-.45-1.09-1.84-1.07-2.46-1.02.14.41.73.4,1.05.68,1.21,1.03,1.64,4.89,1.26,6.38-.21.82-1.33,3.26-2.29,2.68-.61-.37-2.89-3.27-3.44-4.03-1.06-1.47-2.45-3.12-1.32-4.94.96-1.57,2.05-1.58,2.18-4.08.08-1.53-.08-2.7-1.33-4.46-1.25-1.77-.99-.17-.99-.17.63.76.77,1.72.7,2.35-.33,2.61,1.68,2.52-.05,4.21-.29.28-2.69,2.02-3.08,2.22-1.66.89-2.12-.54-3.08-1.29-1.35-1.06-2.08-1.71-3.4-2.49-2.07-1.2.06-3.69-.79-3.48-.84.22-1.18,2.84-1.18,2.84-1.25-1.49-2.37-3.10-3.42-4.73-.62-.97-1.11-2.15-1.71-3.02-.11-.17-.37-.59-.55-.27.42,1.72,1.16,2.59,1.79,4.03.32.72.53,1.81,1.41,2.24-.12-.03-.75-.15-2.09.76-1.49,1.02,1.23-1.16,3.26.85,1.25.66,3.19,1.76,4.17,2.42.94.64,2.11,1.83,3.07,2.49.86.6,2.3.8,2.93,1.36.54.47,1.12,1.93,1.58,2.61,3.27,4.76,6.2,7.44,6.41,13.7.01.25.16.43-.11.66-.84-.99-2.03-1.34-2.97-2.16-.93-.81-1.76-2.15-2.6-3.01-1.55-1.61-3.79-3.22-4.74-5.38-.28-.63.19-1.32-.57-1.69l.22,1.04c-.12.28-1.82.85-2.16.72-.5-.19-.98-1.21-1.64-.89.6.33,1.23,1.06,1.85,1.28.44.15,1.15-.27,1.55-.19.9.17,1.43,1.66,2.01,2.32-.26.63-.74.36-1.28.42l.21.42-.68.59c.61.21,1.16-.7,1.59-.77.79-.13,3.12,2.38,3.58,3.15.17.27.39.22.09.51-.77.73-2.08-.71-2.75-1.06-1.3-.69-2.96.08-3.91-.29-.81-.33-1.5-1.8-2.8-2.23-.13-.05-1.99-.19-2.33-.21-.15-.01-.71-.22-.6.2.04.19,2.82.48,3.3.45.41.18,1.47,1.25,1.66,1.64.28.57-.75,2.8-1.65,2.88l.15.48c.36-.38.9-.56,1.22-.98.46-.61.21-1.36.84-1.72.28-.16,3.2-.11,3.59.03.73.27,1.8,1.11,1.81,1.88l-.88-.15c.44.28.69.34.5.86.23-.32,1.6-.53,1.93-.46.53.11.91.62,1.42.84.5.21,1.26.26,1.67.53.23.15,2.35,3.07,2.55,3.43.66,1.2,1.38,7.12,1.75,8.87.42,2.04,1.32,3.45,1.13,5.69-.1,1.18-.56,2.28-.74,3.41-.55,3.41,2.46,7.28.64,10.13-.97,1.52-.7-1.56-1.38-4.27-1.13-4.49-5.24-7.11-7.22-11.17-.32-.66-3.15-6.13-3.19-6.46-.06-.42.26-1.12.27-1.77.02-1.51-.49-3.24-.47-4.79l-.39.22c-.32-.71-.54-1.82-1.23-2.24l1.44,3.13-1.81-.57,1.73,1.37c.13.76-.07,1.53-.03,2.29.02.32.32.69.29.97-.11.86-2.84.77-3.54.15-.21-.18-1.31-1.63-1.49-1.91-.39-.59-.22-1.32-.52-1.92-.55-1.12-1.87-1.76-2.07-3.03l-.07.8.77,1.31-1.71-.34c-.05.53-.34.49-.74.66.5.43.79-.24,1.31-.26.44-.01,1.35.41,1.71.69.89.71.38,1.28.82,2.03.13.24,2.02,2.67,2.16,2.78.78.56,2.02-.09,3.22,1.2.4.44,1.87,4.16,1.65,4.45-1.78.23-3.05-.93-4.02-2.27.09,1.56,1.45,1.9,2.57,2.58-.4.64-1.08.4-1.63.56,1.77.76,2.06-1.11,3.86.58.7.66,3.11,4.77,3.38,5.75.1.36.16.74.2,1.11-.27.64-1.5-.44-1.8-.71-1.26-1.15-2.13-3.42-3.58-4.28-1.13-.67-3.09-.17-4.28-.86-1.11-1.29-2.38-4.3-3.63-5.29-.53-.42-1.26-.31-1.79-.58-.78-.4-2.89-1.7-3.46-2.28-.4-.41-.51-.98-.93-1.35-.16.38.53,1.16.17,1.47-.4.35-1.22-.6-1.5.04.63.3,1.36.22,2.02.52,1.29.58,2.37,1.41,3.53,2.15.51.32,1.37.36,1.78.65.67.48,2.98,3.89,2.38,4.72-.16.22-1.73,1.82-1.98,2-2.13,1.5-3.9,0-5.48-1.53l.85,1.21-.57.45c.86.49,1.79-.09,2.57.87l-2.19,2.37,2.65-1.78c2.09,0,3.44-2.11,4.99-2.71.42-.16,4.26.36,4.69.6.65.36,3.04,3.91,3.2,4.71.05.27.13.44-.11.66l-1.35-1.21-.06.44-1.14-.82,1.62,1.53-.44,1.29.37.15c.19-1.41.75-.77,1.45-.81,1.43-.08,2.81-.41,3.67,1.11,1.55,2.75,2.6,3.54.99,6.14-.31.48-1.24.77-1.91.54-1.15-.39-1.51-.16-1.77-1.37-.36-1.74,1.18-1.72,1.16-1.98l-.63.03c-.16-.12.24-1.28-.31-1.45.22.18-.38,2.31-.81,1.63-.29-1.48-3.7-3.74-4.53-4.97-.36-.54-.82-.69-1.18-1.10-.51-.58-.65-2.28-1.65-1.38,1.13.19,1.08,1.38,1.52,1.97,1.05,1.38,2.45,2.15,2.96,4.10.08.32.68,1.74.38,1.82-.7-.69-3.37-2.81-4.15-3.21-.8-.39-1.21.85-1.77.68-.41-.51-1.28-.45-1.66-.7-.61-.39-.98-1.56-1.7-1.92-.19.21.19.53.33.73.99,1.38,1.91,1.48.51,3.28l.57.69c.23-.24.02-.66.18-1.03.2-.48.64-1.08,1.23-.86,1.11.4.5.89,1.86-.21.48,0,3.29,1.57,3.57,2.08,2.28,4.08,3.8,2.43,3.69,5.66v.07c-1.06,11.83-4.89,15.95-14.1,15.95-11.2,0-14.43-6.11-14.43-24.78v-53.32c0-18.5,3.23-24.62,14.43-24.62,10.41,0,13.94,5.28,14.39,20.87h20.36c-.83-25.53-10.44-38.52-34.75-38.52s-34.8,14.26-34.8,42.27v53.32c0,28.18,9.34,42.44,34.8,42.44,22.53,0,32.44-11.15,34.43-33.24.03-.16.05-.34.06-.52.09-2.45,1.14-11.65,1.91-13.52.56-1.37,1.65-1.15,1.98-1.61.21-.29-.08-.71.02-1.01.26-.75,1.39-1.10,1.98-1.59.17-.15,1.81-1.72,1.08-1.69ZM162.78,108.46c.31-1.97.92-3.56,1.25-5.43.18-1.09-.32-2.07-.25-2.69.05-.56.53-.75.61-1.09.06-.24-.1-.77-.04-1.14.22-1.43.82-1.98,2.2-2.34.59-.15,1.18.38,1.59.11l.3-.38-.72-.02c.35-1.33,3.26-1.05,4-.58.49.32.29.89.69,1.24-.29.22-.68-.18-.89.37-.21.54-.19,2.38-.41,3.21-.59,2.24-1.14,2.08-2.18,3.64-.34.5-.59,4.57-.54,5.4.08,1.37.49,3.13,1.2,4.31.06.67-1.77-.31-2-.45-1.4-.88-2.15-2.01-3.36-3.04-.05,1.21,1.11,1.63,1.58,2.6.15.76-.84.65-.81.78,2.33.49,4.04.77,5.26,3.08,2.02,3.81-1.31,6.74-3.39,4.96-2.16-1.86-2.57-3.74-2.79-6.07-.22-2.21-1.64-4.24-1.3-6.47ZM176.1,104.7l.19-.6-.74.33c.76,1.43.45,1.5-.19,2.75-.11.21-.04.54-.15.73-.48.83-3.02,1.35-2.42,2.43l-1.93,2.16c-.86-.4-1.81-5.95-1.59-7.04.29-1.47,1.16-1.63,1.78-2.72.99-1.72.58-4.36,1.73-6.09.48.45,1.54.76,1.39,1.49l-.8-.42c.93.62,1.48,1.83,2.23,2.42.56.45,1.22.39,1.67,1.14.06.09.25,2.11.21,2.26-.14.61-.7,1.67-1.38,1.16Z"/>
		</svg>
	</div>

	<!-- Mobile Hamburger Button -->
	<button class="hamburger-button" class:hidden={showTrainingView} on:click={toggleMobileMenu} class:open={isMobileMenuOpen} aria-label="Toggle menu">
		<span></span>
		<span></span>
		<span></span>
	</button>

	<!-- Mobile Menu Overlay -->
	{#if isMobileMenuOpen}
		<div class="mobile-menu-overlay" on:click={toggleMobileMenu}>
			<div class="mobile-menu-content" on:click|stopPropagation>
				<nav class="mobile-nav">
					<a href="/" on:click|preventDefault={(e) => { handleNavClick(e, 'home'); toggleMobileMenu(); }}>HOMEPAGE</a>
					<a href="/training" on:click|preventDefault={(e) => { handleNavClick(e, 'training'); toggleMobileMenu(); }}>TRAINING</a>
					<a href="/gear" on:click={toggleMobileMenu}>GEAR</a>
					<a href="/community" on:click={toggleMobileMenu}>COMMUNITY</a>
				</nav>
				<div class="mobile-social">
					<a href="https://facebook.com" target="_blank" rel="noopener">FB</a>
					<span> . </span>
					<a href="https://linkedin.com" target="_blank" rel="noopener">IN</a>
					<span> . </span>
					<a href="mailto:info@oceanfrontier.com" class="mail-icon">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<rect x="2" y="4" width="20" height="16" rx="2"/>
							<path d="m2 7 10 7 10-7"/>
						</svg>
					</a>
				</div>
				<div class="mobile-contact-info">
					<span class="contact-location">Cyprus, Nicosia</span>
					<a href="tel:+35795119881" class="contact-phone">+357 95 119 881</a>
					<a href="https://www.oceanfrontier.com" target="_blank" rel="noopener" class="contact-website">www.oceanfrontier.com</a>
				</div>
			</div>
		</div>
	{/if}

	<!-- Mobile Pagination Dots -->
	{#if isMobile && !showTrainingView && !showQuestionnaire}
		<div class="mobile-pagination">
			<button
				class="pagination-dot"
				class:active={currentMobileSection === 0}
				on:click={() => switchMobileSection(0)}
				aria-label="Training section"
			></button>
			<button
				class="pagination-dot"
				class:active={currentMobileSection === 1}
				on:click={() => switchMobileSection(1)}
				aria-label="Gear section"
			></button>
		</div>

		<!-- Swipe Hint - iPhone toggle style -->
		<div class="swipe-hint" class:swipe-left={currentMobileSection === 1}>
			<span class="swipe-label">{currentMobileSection === 0 ? 'Slide for "Equipment"' : 'Slide for "Training"'}</span>
			<div class="swipe-track">
				<div class="swipe-slider">
					<svg class="swipe-arrow" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
						<polyline points="9 18 15 12 9 6"></polyline>
					</svg>
				</div>
			</div>
		</div>
	{/if}
</div>
