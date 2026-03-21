<!-- Cloudflare Pages deployment test -->
<script lang="ts">
	import '../styles/main.css';
	import '../styles/_mobile.css';
	import { onMount } from 'svelte';
	import BrandLogos from '$lib/components/BrandLogos.svelte';
	import GearDiagram from '$lib/components/GearDiagram.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import CourseCard from '$lib/components/CourseCard.svelte';
	import CourseFilterBar from '$lib/components/CourseFilterBar.svelte';
	import CourseDetailPanel from '$lib/components/CourseDetailPanel.svelte';
	import QuestionnairePanel from '$lib/components/QuestionnairePanel.svelte';
	import MobileMenu from '$lib/components/MobileMenu.svelte';
	import MobilePagination from '$lib/components/MobilePagination.svelte';
	import CenterLogo from '$lib/components/CenterLogo.svelte';
	import { trainingCourses, type CourseFilter, type TrainingCourse } from '$lib/data/trainingCourses';
	import { isCartOpen } from '$lib/cart/cartStore';
	import trainingCTAs from '$lib/data/trainingCTAs.json';
	import gearCTAs from '$lib/data/gearCTAs.json';
	import {
		sliderPosition as sliderPositionStore,
		showQuestionnaire as showQuestionnaireStore,
		showTrainingView as showTrainingViewStore,
		showGearView as showGearViewStore,
		showScheduleView as showScheduleViewStore,
		isMobile as isMobileStore,
		currentMobileSection as currentMobileSectionStore,
		isMobileMenuOpen as isMobileMenuOpenStore,
		selectedCourse as selectedCourseStore
	} from '$lib/stores/pageState';
	import GUESchedule from '$lib/components/GUESchedule.svelte';

	// DOM refs
	let leftSection: HTMLDivElement;
	let rightSection: HTMLDivElement;
	let sliderBar: HTMLDivElement;
	let splitContainer: HTMLElement;
	let arrowLeft: SVGSVGElement;
	let arrowRight: SVGSVGElement;
	let logoLeft: HTMLDivElement;
	let logoRight: HTMLDivElement;

	// Local reactive copies of stores for template use
	let sliderPosition = 50;
	let showQuestionnaire = false;
	let showTrainingView = false;
	let showGearView = false;
	let showScheduleView = false;
	let isMobile = false;
	let currentMobileSection = 0;
	let selectedCourse: TrainingCourse | null = null;

	sliderPositionStore.subscribe((v) => (sliderPosition = v));
	showQuestionnaireStore.subscribe((v) => (showQuestionnaire = v));
	showTrainingViewStore.subscribe((v) => (showTrainingView = v));
	showGearViewStore.subscribe((v) => (showGearView = v));
	showScheduleViewStore.subscribe((v) => (showScheduleView = v));
	isMobileStore.subscribe((v) => (isMobile = v));
	currentMobileSectionStore.subscribe((v) => (currentMobileSection = v));
	selectedCourseStore.subscribe((v) => (selectedCourse = v));

	// Active flow for questionnaire
	let currentFlow = '';

	// Training view state
	let heroExpanded = false;
	let activeFilter: CourseFilter = 'all';
	let visibleCourses = trainingCourses;

	// Gear view state
	type GearFilter = 'all' | 'basic' | 'technical' | 'content-creation';
	let activeGearFilter: GearFilter = 'all';
	let activeGearType: 'basic' | 'technical' = 'basic';

	// Dynamic date
	let currentDate = '';

	function formatDate() {
		const now = new Date();
		const day = String(now.getDate()).padStart(2, '0');
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const year = String(now.getFullYear()).slice(-2);
		return `${day}/${month}/${year}`;
	}

	function filterCourses(filter: CourseFilter) {
		activeFilter = filter;
		visibleCourses =
			filter === 'all' ? trainingCourses : trainingCourses.filter((c) => c.category === filter);
	}

	// Mobile swipe state
	let touchStartX = 0;
	let touchStartY = 0;
	let touchCurrentX = 0;
	let isSwiping = false;

	function openTrainingView() {
		showTrainingViewStore.set(true);
		activeFilter = 'all';
		visibleCourses = trainingCourses;
		document.body.style.overflow = 'auto';
		document.body.style.height = 'auto';
		if (isMobile) {
			currentMobileSectionStore.set(0);
			isMobileMenuOpenStore.set(false);
		}
		if (leftSection) leftSection.style.clipPath = 'inset(0 0 0 0)';
	}

	function closeTrainingView() {
		showTrainingViewStore.set(false);
		document.body.style.overflow = 'hidden';
		document.body.style.height = '100vh';
		if (isMobile) {
			currentMobileSectionStore.set(0);
		}
		if (!isMobile) {
			if (leftSection) leftSection.style.clipPath = `inset(0 ${100 - sliderPosition}% 0 0)`;
			if (rightSection) rightSection.style.clipPath = `inset(0 0 0 ${sliderPosition}%)`;
		}
	}

	function openGearView(type: 'basic' | 'technical', filter?: GearFilter) {
		showGearViewStore.set(true);
		activeGearType = type;
		activeGearFilter = filter || 'all';
		document.body.style.overflow = 'auto';
		document.body.style.height = 'auto';
		if (isMobile) {
			currentMobileSectionStore.set(1);
			isMobileMenuOpenStore.set(false);
		}
		if (rightSection) rightSection.style.clipPath = 'inset(0 0 0 0)';
	}

	function closeGearView() {
		showGearViewStore.set(false);
		document.body.style.overflow = 'hidden';
		document.body.style.height = '100vh';
		if (isMobile) {
			currentMobileSectionStore.set(1);
		}
		if (!isMobile) {
			if (leftSection) leftSection.style.clipPath = `inset(0 ${100 - sliderPosition}% 0 0)`;
			if (rightSection) rightSection.style.clipPath = `inset(0 0 0 ${sliderPosition}%)`;
		}
	}

	function openScheduleView() {
		showScheduleViewStore.set(true);
		document.body.style.overflow = 'auto';
		document.body.style.height = 'auto';
		if (isMobile) {
			currentMobileSectionStore.set(0);
			isMobileMenuOpenStore.set(false);
		}
		if (leftSection) leftSection.style.clipPath = 'inset(0 0 0 0)';
	}

	function closeScheduleView() {
		showScheduleViewStore.set(false);
		document.body.style.overflow = 'hidden';
		document.body.style.height = '100vh';
		if (!isMobile) {
			if (leftSection) leftSection.style.clipPath = `inset(0 ${100 - sliderPosition}% 0 0)`;
			if (rightSection) rightSection.style.clipPath = `inset(0 0 0 ${sliderPosition}%)`;
		}
	}

	function closeQuestionnaire() {
		showQuestionnaireStore.set(false);
		currentFlow = '';
	}

	function handleNavClick(e: Event, target: string) {
		e.preventDefault();
		e.stopPropagation();
		if (target === 'training') {
			if (!showTrainingView) {
				if (showGearView) closeGearView();
				if (showScheduleView) closeScheduleView();
				if (showQuestionnaire) closeQuestionnaire();
				openTrainingView();
			}
		} else if (target === 'gear') {
			if (!showGearView) {
				if (showTrainingView) closeTrainingView();
				if (showScheduleView) closeScheduleView();
				if (showQuestionnaire) closeQuestionnaire();
				openGearView('basic');
			}
		} else if (target === 'schedule') {
			if (!showScheduleView) {
				if (showTrainingView) closeTrainingView();
				if (showGearView) closeGearView();
				if (showQuestionnaire) closeQuestionnaire();
				openScheduleView();
			}
		} else if (target === 'home') {
			if (showTrainingView) {
				closeTrainingView();
			} else if (showGearView) {
				closeGearView();
			} else if (showScheduleView) {
				closeScheduleView();
			} else if (isMobile) {
				currentMobileSectionStore.set(0);
				isMobileMenuOpenStore.set(false);
			}
		}
	}

	async function handleCTAClick(ctaId: string, section: 'training' | 'gear') {
		currentFlow = ctaId;
		if (isMobile) {
			currentMobileSectionStore.set(section === 'training' ? 0 : 1);
		}
		await new Promise((resolve) => setTimeout(resolve, 100));
		showQuestionnaireStore.set(true);
	}

	function handleQuestionnaireClose() {
		closeQuestionnaire();
	}

	function handleOpenGearView(e: CustomEvent<{ type: 'basic' | 'technical'; filter: GearFilter }>) {
		closeQuestionnaire();
		openGearView(e.detail.type, e.detail.filter);
	}

	// Mobile swipe handlers
	function handleMobileTouchStart(e: TouchEvent) {
		if (!isMobile || showQuestionnaire || showTrainingView || showGearView) return;
		touchStartX = e.touches[0].clientX;
		touchCurrentX = e.touches[0].clientX;
		touchStartY = e.touches[0].clientY;
		isSwiping = true;
	}

	function handleMobileTouchMove(e: TouchEvent) {
		if (!isMobile || !isSwiping || showQuestionnaire || showTrainingView || showGearView) return;
		touchCurrentX = e.touches[0].clientX;
		const touchCurrentY = e.touches[0].clientY;
		const deltaX = Math.abs(touchCurrentX - touchStartX);
		const deltaY = Math.abs(touchCurrentY - touchStartY);
		if (deltaX > deltaY && deltaX > 10) {
			e.preventDefault();
		}
	}

	function handleMobileTouchEnd() {
		if (!isMobile || !isSwiping || showQuestionnaire || showTrainingView || showGearView) return;
		const deltaX = touchCurrentX - touchStartX;
		const threshold = 50;
		if (Math.abs(deltaX) > threshold) {
			if (deltaX > 0 && currentMobileSection === 1) {
				currentMobileSectionStore.set(0);
			} else if (deltaX < 0 && currentMobileSection === 0) {
				currentMobileSectionStore.set(1);
			}
		}
		isSwiping = false;
		touchStartX = 0;
		touchCurrentX = 0;
	}

	// Slider handlers
	function handleSliderMouseDown(e: MouseEvent) {
		e.preventDefault();
		if (showQuestionnaire) closeQuestionnaire();
		setDragTransition(false);
		updateSliderPosition(e);
		_isDragging = true;
	}

	let _isDragging = false;
	let _rafPending = false;
	let _pendingEvent: MouseEvent | null = null;
	let _sliderPos = 50; // plain var, not reactive — used to track position during drag

	function setDragTransition(enabled: boolean) {
		const val = enabled ? '' : 'none';
		if (leftSection)  leftSection.style.transition  = val;
		if (rightSection) rightSection.style.transition = val;
		if (sliderBar)    sliderBar.style.transition    = val;
	}

	function handleMouseMove(e: MouseEvent) {
		if (!_isDragging) return;
		e.preventDefault();
		_pendingEvent = e;
		if (!_rafPending) {
			_rafPending = true;
			requestAnimationFrame(() => {
				if (_pendingEvent) updateSliderPosition(_pendingEvent);
				_rafPending = false;
				_pendingEvent = null;
			});
		}
	}

	function handleMouseUp() {
		if (_isDragging) {
			_isDragging = false;
			setDragTransition(true);
			sliderPositionStore.set(_sliderPos);
		}
	}

	function handleTouchStart(e: TouchEvent) {
		if (showQuestionnaire) closeQuestionnaire();
		setDragTransition(false);
		_isDragging = true;
		const touch = e.touches[0];
		updateSliderPosition({ clientX: touch.clientX } as MouseEvent);
	}

	function handleTouchMove(e: TouchEvent) {
		if (!_isDragging) return;
		e.preventDefault();
		const touch = e.touches[0];
		_pendingEvent = { clientX: touch.clientX } as MouseEvent;
		if (!_rafPending) {
			_rafPending = true;
			requestAnimationFrame(() => {
				if (_pendingEvent) updateSliderPosition(_pendingEvent);
				_rafPending = false;
				_pendingEvent = null;
			});
		}
	}

	function handleTouchEnd() {
		if (_isDragging) {
			_isDragging = false;
			setDragTransition(true);
			sliderPositionStore.set(_sliderPos);
		}
	}

	function updateSliderPosition(e: MouseEvent) {
		if (splitContainer) {
			const rect = splitContainer.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const percentage = (x / rect.width) * 100;
			const clamped = Math.max(10, Math.min(90, percentage));

			// Update DOM directly — no store update here to avoid Svelte re-renders
			if (sliderBar) sliderBar.style.left = clamped + '%';
			if (leftSection) {
				leftSection.style.clipPath = `inset(0 ${100 - clamped}% 0 0)`;
				leftSection.classList.toggle('active', clamped < 50);
			}
			if (rightSection) {
				rightSection.style.clipPath = `inset(0 0 0 ${clamped}%)`;
				rightSection.classList.toggle('active', clamped > 50);
			}

			// Track position in plain var — NOT reactive, no Svelte re-render
			_sliderPos = clamped;

			if (logoLeft && logoRight) {
				if (clamped < 45) {
					logoLeft.style.clipPath = `inset(0 100% 0 0)`;
					logoRight.style.clipPath = `inset(0 0 0 0%)`;
				} else if (clamped > 55) {
					logoLeft.style.clipPath = `inset(0 0% 0 0)`;
					logoRight.style.clipPath = `inset(0 0 0 100%)`;
				} else {
					logoLeft.style.clipPath = `inset(0 ${100 - clamped}% 0 0)`;
					logoRight.style.clipPath = `inset(0 0 0 ${clamped}%)`;
				}
			}

			if (arrowLeft && arrowRight) {
				if (clamped < 45) {
					arrowLeft.classList.add('active');
					arrowRight.classList.remove('active');
				} else if (clamped > 55) {
					arrowLeft.classList.remove('active');
					arrowRight.classList.add('active');
				} else {
					arrowLeft.classList.remove('active');
					arrowRight.classList.remove('active');
				}
			}
		}
	}

	onMount(() => {
		splitContainer = document.querySelector('.split-container') as HTMLElement;
		currentDate = formatDate();

		const checkMobile = () => {
			isMobileStore.set(window.innerWidth <= 768);
		};
		checkMobile();
		window.addEventListener('resize', checkMobile);

		if (!isMobile) {
			_sliderPos = sliderPosition;
			if (sliderBar) sliderBar.style.left = sliderPosition + '%';
			if (leftSection) {
				leftSection.style.clipPath = `inset(0 ${100 - sliderPosition}% 0 0)`;
				leftSection.classList.toggle('active', sliderPosition < 50);
			}
			if (rightSection) {
				rightSection.style.clipPath = `inset(0 0 0 ${sliderPosition}%)`;
				rightSection.classList.toggle('active', sliderPosition > 50);
			}
			if (logoLeft && logoRight) {
				logoLeft.style.clipPath = `inset(0 ${100 - sliderPosition}% 0 0)`;
				logoRight.style.clipPath = `inset(0 0 0 ${sliderPosition}%)`;
			}
		}

		return () => {
			window.removeEventListener('resize', checkMobile);
		};
	});
</script>

<svelte:window
	on:mousemove={handleMouseMove}
	on:mouseup={handleMouseUp}
	on:touchmove={handleTouchMove}
	on:touchend={handleTouchEnd}
/>

<div
	class="split-container"
	class:training-active={showTrainingView || showScheduleView}
	class:gear-active={showGearView}
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
	<div
		bind:this={leftSection}
		class="split-section left"
		class:expanded={showTrainingView || showScheduleView}
		class:hidden={showGearView}
	>
		<div class="section-content">
			{#if !showTrainingView && !showScheduleView}
				<div class="logo">OCEAN FRONTIER</div>
				<div class="logo-subtitle">CONSULTING</div>
				<Nav variant="light" onNavClick={handleNavClick} activeLink={null} centered={false} onMobileClose={null} />
			{/if}

			{#if showScheduleView}
				<div class="training-header">
					<div class="logo centered">OCEAN FRONTIER</div>
					<div class="logo-subtitle centered">CONSULTING</div>
					<Nav variant="light" centered={true} activeLink="schedule" onNavClick={handleNavClick} onMobileClose={null} />
				</div>
				<button class="close-x-button" on:click={() => closeScheduleView()} aria-label="Close schedule view">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
				<GUESchedule />
			{/if}

			{#if showTrainingView}
				<div class="training-header">
					<div class="logo centered">OCEAN FRONTIER</div>
					<div class="logo-subtitle centered">CONSULTING</div>
					<Nav variant="light" centered={true} activeLink="training" onNavClick={handleNavClick} onMobileClose={null} />
				</div>
				<button class="close-x-button" on:click={() => closeTrainingView()} aria-label="Close training view">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
				<div class="training-content">
					<CourseFilterBar activeFilter={activeFilter} onFilter={filterCourses} />
				</div>
				<div class="training-main-layout">
					<div class="training-hero">
						<h1 class="training-hero-title">Discover Your Perfect Dive Course</h1>
						<p class="training-hero-description">Our training programs are designed for divers who demand excellence, precision, and mastery in every environment. Whether your objective is technical diving, cave exploration, or the development of world-class foundational skills, GUE sets the global benchmark for uncompromising training standards.</p>
						<p class="training-hero-tagline">Train for Mastery, learn to explore</p>
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
						<button class="read-more-button" class:expanded={heroExpanded} on:click={() => (heroExpanded = !heroExpanded)}>
							<span>{heroExpanded ? 'Read less' : 'Read more'}</span>
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<polyline points="6 9 12 15 18 9"></polyline>
							</svg>
						</button>
					</div>
					<div class="courses-container">
						<div class="courses-grid">
							{#each visibleCourses as course, i (course.id)}
								<CourseCard {course} index={i} on:learnmore={(e) => selectedCourseStore.set(e.detail)} />
							{/each}
						</div>
					</div>
				</div>
			{:else}
				<div class="cta-container" class:minimized={showQuestionnaire} class:hidden={showTrainingView || showScheduleView}>
					{#each trainingCTAs as cta, i}
						<div
							class="cta-item"
							class:cta-disabled={cta.disabled}
							style="--item-index: {i}"
							on:click|stopPropagation={() => !cta.disabled && handleCTAClick(cta.id, 'training')}
							on:keydown|stopPropagation={(e) => e.key === 'Enter' && !cta.disabled && handleCTAClick(cta.id, 'training')}
							role="button"
							tabindex={cta.disabled ? -1 : 0}
						>
							<h2 class="cta-title">{cta.title}</h2>
							<p class="cta-subtitle">{cta.subtitle}</p>
						</div>
					{/each}
				</div>
			{/if}

			{#if !showTrainingView && !showScheduleView}
				<div class="section-label">
					<span class="label-text">DIVE TRAINING</span>
				</div>
			{/if}

			{#if showQuestionnaire && !showTrainingView && !showScheduleView}
				<QuestionnairePanel
					flow={currentFlow}
					section="training"
					on:close={handleQuestionnaireClose}
					on:openGearView={handleOpenGearView}
				/>
			{/if}
		</div>
	</div>

	<!-- Right Section - Dive Gear -->
	<div
		bind:this={rightSection}
		class="split-section right"
		class:hidden={showTrainingView || showScheduleView}
		class:expanded={showGearView}
	>
		<div class="section-content">
			{#if !showGearView}
				<div class="logo">OCEAN FRONTIER</div>
				<div class="logo-subtitle">CONSULTING</div>
				<Nav variant="dark" centered={false} activeLink={null} onNavClick={handleNavClick} onMobileClose={null} />
			{/if}

			{#if showGearView}
				<div class="gear-header">
					<div class="logo centered">OCEAN FRONTIER</div>
					<div class="logo-subtitle centered">CONSULTING</div>
					<Nav variant="light" centered={true} activeLink="gear" onNavClick={handleNavClick} onMobileClose={null} />
				</div>
				<button class="close-x-button" on:click={() => closeGearView()} aria-label="Close gear view">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
				<div class="gear-content">
					<nav class="filter-bar">
						<a href="#all" class="filter-link" class:active={activeGearFilter === 'all'} on:click|preventDefault|stopPropagation={() => (activeGearFilter = 'all')}>ALL GEAR</a>
						<span class="filter-separator">/</span>
						<a href="#basic" class="filter-link" class:active={activeGearFilter === 'basic'} on:click|preventDefault|stopPropagation={() => (activeGearFilter = 'basic')}>BASIC</a>
						<span class="filter-separator">/</span>
						<a href="#technical" class="filter-link" class:active={activeGearFilter === 'technical'} on:click|preventDefault|stopPropagation={() => (activeGearFilter = 'technical')}>TECHNICAL</a>
						<span class="filter-separator">/</span>
						<a href="#content" class="filter-link" class:active={activeGearFilter === 'content-creation'} on:click|preventDefault|stopPropagation={() => (activeGearFilter = 'content-creation')}>UNDERWATER CONTENT CREATION</a>
					</nav>
					<div class="gear-brands-section">
						<BrandLogos />
					</div>
					<div class="gear-description-section">
						<h2 class="gear-description-title">We Only Sell You, What We Personally Use</h2>
						<p class="gear-description-text">Our approach to Gear purchasing is a modular system that allows growth and adaptation to further and future developments. It is the most honest path into owning expensive and reliable diving gear to prevent unnecessary loss of funds, resources, and energy.<br><br>Whether you want Basic, Technical or Underwater Content Creation equipment, I believe that we can help you make Sustainable Choices</p>
					</div>
					<GearDiagram />
				</div>
			{:else}
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

				{#if showQuestionnaire}
					<QuestionnairePanel
						flow={currentFlow}
						section="gear"
						on:close={handleQuestionnaireClose}
						on:openGearView={handleOpenGearView}
					/>
				{/if}
			{/if}
		</div>
	</div>

	<!-- Slider Bar -->
	<div bind:this={sliderBar} class="slider-bar" class:hidden={showTrainingView || showGearView || showScheduleView}>
		<button class="slider-handle" on:mousedown={handleSliderMouseDown} on:touchstart={handleTouchStart}>
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
	<div class="social-links left-social" class:hidden={showTrainingView || showGearView}>
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
	<div class="date-display" class:hidden={showTrainingView || showGearView}>
		<span class="date-text">{currentDate} . concept and design by Imad Farhat - copyright 2026, all rights reserved</span>
	</div>

	<!-- Center Logo - Split for background reactivity -->
	<CenterLogo variant="light" bind:element={logoLeft} hidden={showQuestionnaire || showTrainingView || showGearView || showScheduleView} />
	<CenterLogo variant="dark" bind:element={logoRight} hidden={showQuestionnaire || showTrainingView || showGearView || showScheduleView} />

	<!-- Mobile Menu -->
	<MobileMenu
		onNavClick={handleNavClick}
		hidden={showTrainingView || showGearView}
	/>

	<!-- Mobile Pagination -->
	<MobilePagination />
</div>

{#if selectedCourse}
	<CourseDetailPanel course={selectedCourse} on:close={() => selectedCourseStore.set(null)} />
{/if}
