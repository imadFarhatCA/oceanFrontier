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
		showCommunityView as showCommunityViewStore,
		isMobile as isMobileStore,
		currentMobileSection as currentMobileSectionStore,
		isMobileMenuOpen as isMobileMenuOpenStore,
		selectedCourse as selectedCourseStore
	} from '$lib/stores/pageState';
	import GUESchedule from '$lib/components/GUESchedule.svelte';
	import { articles, type Article } from '$lib/data/articles';

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
	let showCommunityView = false;
	let isMobile = false;
	let currentMobileSection = 0;
	let selectedCourse: TrainingCourse | null = null;

	sliderPositionStore.subscribe((v) => (sliderPosition = v));
	showQuestionnaireStore.subscribe((v) => (showQuestionnaire = v));
	showTrainingViewStore.subscribe((v) => (showTrainingView = v));
	showGearViewStore.subscribe((v) => (showGearView = v));
	showScheduleViewStore.subscribe((v) => (showScheduleView = v));
	showCommunityViewStore.subscribe((v) => (showCommunityView = v));
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

	// Community view state
	type CategoryFilter = 'all' | 'Trips' | 'Gear' | 'Training' | 'News';
	let activeCommunityFilter: CategoryFilter = 'all';
	let visibleArticles = articles;
	let copiedArticleId: string | null = null;

	const categoryColors: Record<string, string> = {
		Trips: '#0a84ff',
		Gear: '#30d158',
		Training: '#ff9f0a',
		News: '#ff453a'
	};

	$: featuredArticle = visibleArticles.find(a => a.featured) ?? visibleArticles[0];
	$: gridArticles = visibleArticles.filter(a => a.id !== featuredArticle?.id);

	function filterArticles(filter: CategoryFilter) {
		activeCommunityFilter = filter;
		visibleArticles = filter === 'all' ? articles : articles.filter(a => a.category === filter);
	}

	let shareMenuId: string | null = null;

	function toggleShareMenu(e: Event, articleId: string) {
		e.stopPropagation();
		shareMenuId = shareMenuId === articleId ? null : articleId;
	}

	function closeShareMenu() {
		shareMenuId = null;
	}

	async function shareArticle(e: Event, articleId: string, method: 'copy' | 'whatsapp' | 'email' | 'facebook' | 'x' | 'linkedin') {
		e.stopPropagation();
		const article = articles.find(a => a.id === articleId);
		if (!article) return;
		const url = `https://theoceanfrontier.com/community/${articleId}`;
		const text = encodeURIComponent(article.title);
		const encodedUrl = encodeURIComponent(url);

		if (method === 'copy') {
			await navigator.clipboard.writeText(url);
			copiedArticleId = articleId;
			setTimeout(() => { copiedArticleId = null; }, 2000);
		} else if (method === 'whatsapp') {
			window.open(`https://wa.me/?text=${text}%20—%20${encodedUrl}`, '_blank');
		} else if (method === 'email') {
			window.location.href = `mailto:?subject=${text}&body=${text}%0A%0A${encodedUrl}`;
		} else if (method === 'facebook') {
			window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
		} else if (method === 'x') {
			window.open(`https://x.com/intent/tweet?text=${text}&url=${encodedUrl}`, '_blank');
		} else if (method === 'linkedin') {
			window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank');
		}
		shareMenuId = null;
	}

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

	function openCommunityView() {
		showCommunityViewStore.set(true);
		activeCommunityFilter = 'all';
		visibleArticles = articles;
		document.body.style.overflow = 'auto';
		document.body.style.height = 'auto';
		if (isMobile) {
			currentMobileSectionStore.set(0);
			isMobileMenuOpenStore.set(false);
		}
		if (leftSection) leftSection.style.clipPath = 'inset(0 0 0 0)';
	}

	function closeCommunityView() {
		showCommunityViewStore.set(false);
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
				if (showCommunityView) closeCommunityView();
				if (showQuestionnaire) closeQuestionnaire();
				openTrainingView();
			}
		} else if (target === 'gear') {
			if (!showGearView) {
				if (showTrainingView) closeTrainingView();
				if (showScheduleView) closeScheduleView();
				if (showCommunityView) closeCommunityView();
				if (showQuestionnaire) closeQuestionnaire();
				openGearView('basic');
			}
		} else if (target === 'schedule') {
			if (!showScheduleView) {
				if (showTrainingView) closeTrainingView();
				if (showGearView) closeGearView();
				if (showCommunityView) closeCommunityView();
				if (showQuestionnaire) closeQuestionnaire();
				openScheduleView();
			}
		} else if (target === 'community') {
			if (!showCommunityView) {
				if (showTrainingView) closeTrainingView();
				if (showGearView) closeGearView();
				if (showScheduleView) closeScheduleView();
				if (showQuestionnaire) closeQuestionnaire();
				openCommunityView();
			}
		} else if (target === 'home') {
			if (showTrainingView) {
				closeTrainingView();
			} else if (showGearView) {
				closeGearView();
			} else if (showScheduleView) {
				closeScheduleView();
			} else if (showCommunityView) {
				closeCommunityView();
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
		if (!isMobile || showQuestionnaire || showTrainingView || showGearView || showCommunityView) return;
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

		const handleClickOutside = () => { shareMenuId = null; };
		window.addEventListener('click', handleClickOutside);

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
			window.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<svelte:head>
	<title>the Ocean Frontier — GUE Dive Training & Gear in Cyprus</title>
	<meta name="description" content="the Ocean Frontier is Cyprus's GUE dive training center. Technical diving courses, Halcyon & Xdeep gear, and a passionate diving community led by instructor Imad Farhat." />
	<meta property="og:title" content="the Ocean Frontier — GUE Dive Training & Gear in Cyprus" />
	<meta property="og:description" content="Cyprus's GUE dive training center. Technical diving courses, Halcyon & Xdeep gear, and a passionate community." />
	<meta property="og:url" content="https://theoceanfrontier.com/" />
	<meta property="og:image" content="https://theoceanfrontier.com/og-image.jpg" />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="the Ocean Frontier — GUE Dive Training & Gear in Cyprus" />
	<meta name="twitter:description" content="Cyprus's GUE dive training center. Technical diving courses, Halcyon & Xdeep gear, and a passionate community." />
	<meta name="twitter:image" content="https://theoceanfrontier.com/og-image.jpg" />
	<link rel="canonical" href="https://theoceanfrontier.com/" />
</svelte:head>

<svelte:window
	on:mousemove={handleMouseMove}
	on:mouseup={handleMouseUp}
	on:touchmove={handleTouchMove}
	on:touchend={handleTouchEnd}
/>

<div
	class="split-container"
	class:training-active={showTrainingView || showScheduleView || showCommunityView}
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
		class:expanded={showTrainingView || showScheduleView || showCommunityView}
		class:hidden={showGearView}
	>
		<div class="section-content">
			{#if !showTrainingView && !showScheduleView && !showCommunityView}
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

			{#if showCommunityView}
				<div class="training-header">
					<div class="logo centered">OCEAN FRONTIER</div>
					<div class="logo-subtitle centered">CONSULTING</div>
					<Nav variant="light" centered={true} activeLink="community" onNavClick={handleNavClick} onMobileClose={null} />
				</div>
				<button class="close-x-button" on:click={() => closeCommunityView()} aria-label="Close community view">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</button>
				<div class="gear-content">
					<nav class="filter-bar">
						<a href="#all" class="filter-link" class:active={activeCommunityFilter === 'all'} on:click|preventDefault|stopPropagation={() => filterArticles('all')}>ALL</a>
						<span class="filter-separator">/</span>
						<a href="#trips" class="filter-link" class:active={activeCommunityFilter === 'Trips'} on:click|preventDefault|stopPropagation={() => filterArticles('Trips')}>TRIPS</a>
						<span class="filter-separator">/</span>
						<a href="#gear" class="filter-link" class:active={activeCommunityFilter === 'Gear'} on:click|preventDefault|stopPropagation={() => filterArticles('Gear')}>GEAR</a>
						<span class="filter-separator">/</span>
						<a href="#training" class="filter-link" class:active={activeCommunityFilter === 'Training'} on:click|preventDefault|stopPropagation={() => filterArticles('Training')}>TRAINING</a>
						<span class="filter-separator">/</span>
						<a href="#news" class="filter-link" class:active={activeCommunityFilter === 'News'} on:click|preventDefault|stopPropagation={() => filterArticles('News')}>NEWS</a>
					</nav>
				</div>
				<div class="community-articles-section">

					{#if featuredArticle}
						<div class="community-hero-card">
							<div class="community-hero-image">
								{#if featuredArticle.image}
									<img src={featuredArticle.image} alt={featuredArticle.title} />
								{:else}
									<div class="community-image-placeholder"></div>
								{/if}
								<span class="community-badge" style="background:{categoryColors[featuredArticle.category]}">{featuredArticle.category}</span>
							</div>
							<div class="community-hero-body">
								<span class="community-meta">{featuredArticle.date} · {featuredArticle.author}</span>
								<h2>{featuredArticle.title}</h2>
								<p>{featuredArticle.excerpt}</p>
								<div class="community-hero-tags">
									{#each featuredArticle.tags as tag}
										<span class="community-inline-tag">{tag}</span>
									{/each}
								</div>
								<div class="community-card-footer">
									<span class="community-read-more">Read article →</span>
									<div class="share-buttons">
										<button class="share-btn" title="Copy link" on:click={(e) => shareArticle(e, featuredArticle.id, 'copy')}>
											{#if copiedArticleId === featuredArticle.id}
												<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#30d158" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
											{:else}
												<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
											{/if}
										</button>
										<div class="share-menu-wrap">
											<button class="share-btn" title="Share" on:click={(e) => toggleShareMenu(e, featuredArticle.id)}>
												<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
											</button>
											{#if shareMenuId === featuredArticle.id}
												<!-- svelte-ignore a11y-click-events-have-key-events -->
												<!-- svelte-ignore a11y-no-static-element-interactions -->
												<div class="share-dropdown" on:click|stopPropagation>
													<button class="share-dropdown-item" title="Instagram" on:click={(e) => shareArticle(e, featuredArticle.id, 'copy')}>
														<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
													</button>
													<button class="share-dropdown-item" title="Facebook" on:click={(e) => shareArticle(e, featuredArticle.id, 'facebook')}>
														<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
													</button>
													<button class="share-dropdown-item" title="X" on:click={(e) => shareArticle(e, featuredArticle.id, 'x')}>
														<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
													</button>
													<button class="share-dropdown-item" title="LinkedIn" on:click={(e) => shareArticle(e, featuredArticle.id, 'linkedin')}>
														<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
													</button>
													<button class="share-dropdown-item" title="Email" on:click={(e) => shareArticle(e, featuredArticle.id, 'email')}>
														<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>
													</button>
												</div>
											{/if}
										</div>
									</div>
								</div>
							</div>
						</div>
					{/if}

					{#if gridArticles.length > 0}
						<div class="community-articles-grid">
							{#each gridArticles as article, i}
								<div class="community-article-card" style="--card-index: {i}">
									<div class="community-card-image">
										{#if article.image}
											<img src={article.image} alt={article.title} loading="lazy" />
										{:else}
											<div class="community-image-placeholder"></div>
										{/if}
										<span class="community-badge" style="background:{categoryColors[article.category]}">{article.category}</span>
									</div>
									<div class="community-card-body">
										<span class="community-meta">{article.date}</span>
										<h3>{article.title}</h3>
										<p>{article.excerpt}</p>
										<div class="community-inline-tags">
											{#each article.tags as tag}
												<span class="community-inline-tag">{tag}</span>
											{/each}
										</div>
										<div class="community-card-footer">
											<span class="community-read-more">Read article →</span>
											<div class="share-buttons">
												<button class="share-btn" title="Copy link" on:click={(e) => shareArticle(e, article.id, 'copy')}>
													{#if copiedArticleId === article.id}
														<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#30d158" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
													{:else}
														<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
													{/if}
												</button>
												<div class="share-menu-wrap">
													<button class="share-btn" title="Share" on:click={(e) => toggleShareMenu(e, article.id)}>
														<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
													</button>
													{#if shareMenuId === article.id}
														<!-- svelte-ignore a11y-click-events-have-key-events -->
														<!-- svelte-ignore a11y-no-static-element-interactions -->
														<div class="share-dropdown" on:click|stopPropagation>
															<button class="share-dropdown-item" title="Instagram" on:click={(e) => shareArticle(e, article.id, 'copy')}>
																<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
															</button>
															<button class="share-dropdown-item" title="Facebook" on:click={(e) => shareArticle(e, article.id, 'facebook')}>
																<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
															</button>
															<button class="share-dropdown-item" title="X" on:click={(e) => shareArticle(e, article.id, 'x')}>
																<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
															</button>
															<button class="share-dropdown-item" title="LinkedIn" on:click={(e) => shareArticle(e, article.id, 'linkedin')}>
																<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
															</button>
															<button class="share-dropdown-item" title="Email" on:click={(e) => shareArticle(e, article.id, 'email')}>
																<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>
															</button>
														</div>
													{/if}
												</div>
											</div>
										</div>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
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
				<div class="cta-container" class:minimized={showQuestionnaire} class:hidden={showTrainingView || showScheduleView || showCommunityView}>
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

			{#if !showTrainingView && !showScheduleView && !showCommunityView}
				<div class="section-label">
					<span class="label-text">DIVE TRAINING</span>
				</div>
			{/if}

			{#if showQuestionnaire && !showTrainingView && !showScheduleView && !showCommunityView}
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
		class:hidden={showTrainingView || showScheduleView || showCommunityView}
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
				<div class="cta-container" class:minimized={showQuestionnaire} class:hidden={showTrainingView || showCommunityView}>
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
	<div bind:this={sliderBar} class="slider-bar" class:hidden={showTrainingView || showGearView || showScheduleView || showCommunityView}>
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
	<div class="social-links left-social" class:hidden={showTrainingView || showGearView || showCommunityView}>
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
	<div class="date-display" class:hidden={showTrainingView || showGearView || showCommunityView}>
		<span class="date-text">{currentDate} . concept and design by Imad Farhat - copyright 2026, all rights reserved</span>
	</div>

	<!-- Center Logo - Split for background reactivity -->
	<CenterLogo variant="light" bind:element={logoLeft} hidden={showQuestionnaire || showTrainingView || showGearView || showScheduleView || showCommunityView} />
	<CenterLogo variant="dark" bind:element={logoRight} hidden={showQuestionnaire || showTrainingView || showGearView || showScheduleView || showCommunityView} />

	<!-- Mobile Menu -->
	<MobileMenu
		onNavClick={handleNavClick}
		hidden={showTrainingView || showGearView || showCommunityView}
	/>

	<!-- Mobile Pagination -->
	<MobilePagination />
</div>

{#if selectedCourse}
	<CourseDetailPanel course={selectedCourse} on:close={() => selectedCourseStore.set(null)} />
{/if}
