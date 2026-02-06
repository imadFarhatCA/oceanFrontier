<script lang="ts">
	import { onMount } from 'svelte';

	type CourseFilter = 'all' | 'none-diver' | 'existing-diver' | 'gue-diver' | 'rebreathers' | 'instructor';

	let activeFilter: CourseFilter = 'all';
	let visibleCourses: typeof courses = [];

	const courses = [
		{
			id: 1,
			title: 'GUE Discover Diving',
			category: 'none-diver',
			description: 'Perfect introduction to diving for complete beginners. Learn the fundamentals in a safe, controlled environment.',
			image: '/images/courses/discover-diving.jpg'
		},
		{
			id: 2,
			title: 'GUE Scuba Diver',
			category: 'none-diver',
			description: 'Entry-level certification for those new to diving. Build solid foundational skills.',
			image: '/images/courses/scuba-diver.jpg'
		},
		{
			id: 3,
			title: 'GUE Open Water Diver',
			category: 'none-diver',
			description: 'Comprehensive open water certification for beginners seeking quality training.',
			image: '/images/courses/open-water.jpg'
		},
		{
			id: 4,
			title: 'GUE Performance Diver',
			category: 'existing-diver',
			description: 'Enhance your skills and learn GUE techniques. Perfect for certified divers.',
			image: '/images/courses/performance-diver.jpg'
		},
		{
			id: 5,
			title: 'GUE Basic Fundamentals',
			category: 'existing-diver',
			description: 'Master fundamental diving skills with GUE\'s proven methodology.',
			image: '/images/courses/basic-fundamentals.jpg'
		},
		{
			id: 6,
			title: 'GUE Technical Fundamentals',
			category: 'existing-diver',
			description: 'Advanced fundamental skills for technical diving preparation.',
			image: '/images/courses/tech-fundamentals.jpg'
		},
		{
			id: 7,
			title: 'GUE Doubles Primer',
			category: 'existing-diver',
			description: 'Introduction to diving with double cylinders. Essential technical diving skills.',
			image: '/images/courses/doubles-primer.jpg'
		},
		{
			id: 8,
			title: 'GUE Drysuit Primer',
			category: 'existing-diver',
			description: 'Learn proper drysuit diving techniques and procedures.',
			image: '/images/courses/drysuit-primer.jpg'
		},
		{
			id: 9,
			title: 'GUE DPV 1',
			category: 'gue-diver',
			description: 'Underwater scooter operations for GUE certified divers.',
			image: '/images/courses/dpv.jpg'
		},
		{
			id: 10,
			title: 'GUE Navigation Primer',
			category: 'gue-diver',
			description: 'Advanced underwater navigation techniques and skills.',
			image: '/images/courses/navigation.jpg'
		},
		{
			id: 11,
			title: 'GUE Deep Primer',
			category: 'gue-diver',
			description: 'Introduction to deeper recreational diving with GUE standards.',
			image: '/images/courses/deep-primer.jpg'
		},
		{
			id: 12,
			title: 'GUE Symbios CCR Fundamentals',
			category: 'rebreathers',
			description: 'Closed circuit rebreather training on the Symbios system.',
			image: '/images/courses/symbios-ccr.jpg'
		},
		{
			id: 13,
			title: 'GUE JJ CCR Fundamentals',
			category: 'rebreathers',
			description: 'JJ-CCR rebreather certification and fundamental skills.',
			image: '/images/courses/jj-ccr.jpg'
		},
		{
			id: 14,
			title: 'JJ CCR - MOD 1',
			category: 'rebreathers',
			description: 'Advanced JJ-CCR training module for technical diving.',
			image: '/images/courses/jj-mod1.jpg'
		},
		{
			id: 15,
			title: 'GUE Instructor Development',
			category: 'instructor',
			description: 'Become a GUE instructor. Learn to transfer knowledge and teach effectively.',
			image: '/images/courses/instructor-dev.jpg'
		}
	];

	function filterCourses(filter: CourseFilter) {
		activeFilter = filter;
		if (filter === 'all') {
			visibleCourses = courses;
		} else {
			visibleCourses = courses.filter(course => course.category === filter);
		}
	}

	onMount(() => {
		visibleCourses = courses;
	});
</script>

<svelte:head>
	<title>Training - Ocean Frontier Consulting</title>
</svelte:head>

<div class="training-page">
	<!-- Header with Homepage Frame -->
	<div class="section-content">
		<div class="logo">OCEAN FRONTIER</div>
		<div class="logo-subtitle">CONSULTING</div>
		<nav class="nav">
			<a href="/">HOMEPAGE</a>
			<a href="/training" class="active">TRAINING</a>
			<a href="/gear">GEAR</a>
			<a href="/community">COMMUNITY</a>
		</nav>

		<!-- Center Logo -->
		<div class="center-logo-left">
			<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
				<circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" stroke-width="2" opacity="0.3"/>
				<circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.2"/>
				<circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" stroke-width="1" opacity="0.15"/>
				<path d="M100 40 L100 160 M40 100 L160 100" stroke="currentColor" stroke-width="1" opacity="0.2"/>
				<circle cx="100" cy="100" r="8" fill="currentColor" opacity="0.4"/>
			</svg>
		</div>
	</div>

	<!-- Filter Bar -->
	<div class="filter-bar">
		<button
			class="filter-button"
			class:active={activeFilter === 'all'}
			on:click={() => filterCourses('all')}
		>
			All Courses
		</button>
		<button
			class="filter-button"
			class:active={activeFilter === 'none-diver'}
			on:click={() => filterCourses('none-diver')}
		>
			Non Diver
		</button>
		<button
			class="filter-button"
			class:active={activeFilter === 'existing-diver'}
			on:click={() => filterCourses('existing-diver')}
		>
			Existing Diver
		</button>
		<button
			class="filter-button"
			class:active={activeFilter === 'gue-diver'}
			on:click={() => filterCourses('gue-diver')}
		>
			GUE Diver
		</button>
		<button
			class="filter-button"
			class:active={activeFilter === 'rebreathers'}
			on:click={() => filterCourses('rebreathers')}
		>
			Rebreathers
		</button>
		<button
			class="filter-button"
			class:active={activeFilter === 'instructor'}
			on:click={() => filterCourses('instructor')}
		>
			Instructor Development
		</button>
	</div>

	<!-- Courses Grid -->
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
						<button class="course-cta">Learn More</button>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.training-page {
		min-height: 100vh;
		background: white;
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif;
		position: relative;
	}

	/* Header - Using Homepage Frame Styles */
	.section-content {
		position: relative;
		width: 100%;
		height: auto;
		padding: 40px 60px 60px;
		display: flex;
		flex-direction: column;
		align-items: center;
		z-index: 1;
	}

	.logo {
		font-size: 18px;
		font-weight: 700;
		letter-spacing: 2px;
		color: var(--color-dark, #2a2a2a);
		margin: 0;
		text-align: center;
	}

	.logo-subtitle {
		font-size: 11px;
		font-weight: 300;
		letter-spacing: 3px;
		color: rgba(42, 42, 42, 0.7);
		margin: 4px 0 0 0;
		text-align: center;
	}

	.nav {
		display: flex;
		gap: 40px;
		margin-top: 30px;
	}

	.nav a {
		color: rgba(42, 42, 42, 0.6);
		text-decoration: none;
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 1px;
		transition: all 0.3s ease;
		position: relative;
	}

	.nav a:hover,
	.nav a.active {
		color: var(--color-dark, #2a2a2a);
	}

	.nav a.active::after {
		content: '';
		position: absolute;
		bottom: -8px;
		left: 0;
		right: 0;
		height: 2px;
		background: var(--color-dark, #2a2a2a);
	}

	/* Center Logo */
	.center-logo-left {
		position: absolute;
		top: 12%;
		left: 50%;
		transform: translateX(-50%);
		width: 280px;
		height: 280px;
		z-index: 10;
		opacity: 1;
		pointer-events: none;
		color: var(--color-dark, #2a2a2a);
	}

	.center-logo-left svg {
		width: 100%;
		height: 100%;
	}

	/* Filter Bar */
	.filter-bar {
		background: transparent;
		padding: 40px 60px 24px;
		display: flex;
		gap: 16px;
		justify-content: center;
		flex-wrap: wrap;
		position: relative;
		z-index: 2;
	}

	.filter-button {
		padding: 12px 24px;
		background: transparent;
		border: 1px solid rgba(0, 0, 0, 0.12);
		color: #6b6b6b;
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.5px;
		border-radius: 24px;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.filter-button:hover {
		background: rgba(0, 0, 0, 0.04);
		border-color: rgba(0, 0, 0, 0.2);
		transform: translateY(-2px);
	}

	.filter-button.active {
		background: linear-gradient(135deg, #2a2a2a 0%, #3d3d3d 100%);
		border-color: transparent;
		color: white;
	}

	/* Courses Grid */
	.courses-container {
		padding: 20px 60px 60px;
		max-width: 1400px;
		margin: 0 auto;
		position: relative;
		z-index: 2;
	}

	.courses-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
		gap: 32px;
	}

	.course-card {
		background: white;
		border-radius: 20px;
		overflow: hidden;
		box-shadow:
			0 4px 16px rgba(0, 0, 0, 0.06),
			0 2px 8px rgba(0, 0, 0, 0.04);
		transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
		animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1);
		animation-delay: calc(var(--card-index) * 0.08s);
		animation-fill-mode: backwards;
	}

	@keyframes slideUpFade {
		0% {
			opacity: 0;
			transform: translateY(30px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.course-card:hover {
		transform: translateY(-8px);
		box-shadow:
			0 12px 40px rgba(0, 0, 0, 0.12),
			0 6px 16px rgba(0, 0, 0, 0.08);
	}

	.course-image-wrapper {
		position: relative;
		width: 100%;
		padding-top: 60%;
		overflow: hidden;
	}

	.course-image {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-size: cover;
		background-position: center;
		background-color: #d4d4d4;
		transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.course-card:hover .course-image {
		transform: scale(1.05);
	}

	.image-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to bottom,
			transparent 0%,
			rgba(0, 0, 0, 0.4) 100%
		);
	}

	.course-content {
		padding: 28px;
	}

	.course-title {
		font-size: 20px;
		font-weight: 700;
		color: #2a2a2a;
		margin: 0 0 12px 0;
		letter-spacing: -0.02em;
		line-height: 1.3;
	}

	.course-description {
		font-size: 14px;
		line-height: 1.6;
		color: #6b6b6b;
		margin: 0 0 20px 0;
	}

	.course-cta {
		width: 100%;
		padding: 14px 24px;
		background: linear-gradient(135deg, #2a2a2a 0%, #3d3d3d 100%);
		border: none;
		color: white;
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.5px;
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
		text-transform: uppercase;
	}

	.course-cta:hover {
		transform: translateY(-2px);
		box-shadow:
			0 8px 20px rgba(0, 0, 0, 0.2),
			0 4px 10px rgba(0, 0, 0, 0.15);
	}

	.course-cta:active {
		transform: translateY(0);
	}

	/* Responsive */
	@media (max-width: 768px) {
		.section-content {
			padding: 30px 24px 40px;
		}

		.nav {
			gap: 24px;
		}

		.center-logo-left {
			width: 200px;
			height: 200px;
			top: 15%;
		}

		.filter-bar {
			padding: 20px 24px;
			gap: 12px;
		}

		.filter-button {
			padding: 10px 18px;
			font-size: 12px;
		}

		.courses-container {
			padding: 40px 24px;
		}

		.courses-grid {
			grid-template-columns: 1fr;
			gap: 24px;
		}
	}
</style>
