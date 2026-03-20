<script lang="ts">
	import { onMount } from 'svelte';
	import { trainingCourses, type CourseFilter } from '$lib/data/trainingCourses';
	import CourseCard from '$lib/components/CourseCard.svelte';
	import CourseFilterBar from '$lib/components/CourseFilterBar.svelte';

	let activeFilter: CourseFilter = 'all';
	let visibleCourses: typeof trainingCourses = [];

	const courses = trainingCourses;

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
	<title>GUE Dive Training Courses | the Ocean Frontier — Cyprus</title>
	<meta name="description" content="Explore GUE dive training courses in Cyprus — from beginner Discover Diving to advanced technical, CCR and Cave courses. Taught by GUE-certified instructor Imad Farhat." />
	<meta property="og:title" content="GUE Dive Training Courses | the Ocean Frontier" />
	<meta property="og:description" content="GUE dive training from entry-level to technical, CCR and Cave courses in Cyprus. Authorized Halcyon dealer." />
	<meta property="og:url" content="https://theoceanfrontier.com/training" />
	<meta property="og:image" content="https://theoceanfrontier.com/og-image.jpg" />
	<link rel="canonical" href="https://theoceanfrontier.com/training" />
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
	</div>

	<!-- Filter Bar -->
	<CourseFilterBar activeFilter={activeFilter} onFilter={filterCourses} buttonStyle={true} />

	<!-- Courses Grid -->
	<div class="courses-container">
		<div class="courses-grid">
			{#each visibleCourses as course, i (course.id)}
				<CourseCard {course} index={i} />
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

		.courses-container {
			padding: 40px 24px;
		}

		.courses-grid {
			grid-template-columns: 1fr;
			gap: 24px;
		}
	}
</style>
