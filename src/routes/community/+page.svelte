<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { articles } from '$lib/data/articles';

	type CategoryFilter = 'all' | 'Trips' | 'Gear' | 'Training' | 'News';

	let ready = false;
	let activeFilter: CategoryFilter = 'all';
	let visibleArticles = articles;

	const categoryColors: Record<string, string> = {
		Trips:    '#0a84ff',
		Gear:     '#30d158',
		Training: '#ff9f0a',
		News:     '#ff453a'
	};

	function filterArticles(filter: CategoryFilter) {
		activeFilter = filter;
		visibleArticles = filter === 'all' ? articles : articles.filter(a => a.category === filter);
	}

	function navigate(e: MouseEvent, href: string) {
		e.preventDefault();
		ready = false;
		setTimeout(() => goto(href), 350);
	}

	onMount(() => {
		document.body.classList.add('community-body');
		requestAnimationFrame(() => { ready = true; });
		return () => document.body.classList.remove('community-body');
	});
</script>

<svelte:head>
	<title>Community | the Ocean Frontier</title>
	<meta name="description" content="Dive stories, gear reviews, training insights and news from the Ocean Frontier GUE community." />
	<link rel="canonical" href="https://theoceanfrontier.com/community" />
</svelte:head>

<div class="community-page" class:ready>

	<!-- Header -->
	<div class="section-content">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="logo" on:click={(e) => navigate(e, '/')}>OCEAN FRONTIER</div>
		<div class="logo-subtitle">CONSULTING</div>
		<nav class="nav">
			<a href="/" on:click={(e) => navigate(e, '/')}>HOMEPAGE</a>
			<a href="/training" on:click={(e) => navigate(e, '/training')}>TRAINING</a>
			<a href="/schedule" on:click={(e) => navigate(e, '/schedule')}>SCHEDULE</a>
			<a href="/gear" on:click={(e) => navigate(e, '/gear')}>GEAR</a>
			<a href="/community" class="active">COMMUNITY</a>
		</nav>
	</div>

	<!-- Filter Bar -->
	<div class="filter-bar">
		<button class="filter-button" class:active={activeFilter === 'all'} on:click={() => filterArticles('all')}>All</button>
		<button class="filter-button" class:active={activeFilter === 'Trips'} on:click={() => filterArticles('Trips')}>Trips</button>
		<button class="filter-button" class:active={activeFilter === 'Gear'} on:click={() => filterArticles('Gear')}>Gear</button>
		<button class="filter-button" class:active={activeFilter === 'Training'} on:click={() => filterArticles('Training')}>Training</button>
		<button class="filter-button" class:active={activeFilter === 'News'} on:click={() => filterArticles('News')}>News</button>
	</div>

	<!-- Main layout: left text + right cards -->
	<div class="main-layout">

		<!-- Left intro panel -->
		<div class="intro-panel">
			<h1>Explore the<br>Community</h1>
			<p>Stories from the water, honest gear reviews, training insights, and news from the GUE Cyprus chapter.</p>
			<p><em>We are Explorers who Teach.</em></p>
			<div class="intro-divider"></div>
			<p class="intro-sub">From cave expeditions to first dives — real experiences shared by real divers.</p>
		</div>

		<!-- Right: article cards grid -->
		<div class="articles-container">
			<div class="articles-grid">
				{#each visibleArticles as article}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div class="article-card" on:click={(e) => navigate(e, `/community/${article.id}`)}>
						<div class="card-image">
							{#if article.image}
								<img src={article.image} alt={article.title} loading="lazy" />
							{:else}
								<div class="image-placeholder"></div>
							{/if}
							<span class="category-badge" style="background:{categoryColors[article.category]}">{article.category}</span>
						</div>
						<div class="card-body">
							<span class="meta">{article.date}</span>
							<h3>{article.title}</h3>
							<p>{article.excerpt}</p>
							<span class="read-more">Read article →</span>
						</div>
					</div>
				{/each}
			</div>
		</div>

	</div>
</div>

<style>
	:global(body.community-body) {
		overflow: auto !important;
		height: auto !important;
	}

	:global(body.community-body .split-container) {
		display: none !important;
	}

	.community-page {
		min-height: 100vh;
		background: white;
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif;
		opacity: 0;
		transition: opacity 0.35s ease;
	}

	.community-page.ready { opacity: 1; }

	/* Header */
	.section-content {
		width: 100%;
		padding: 40px 60px 60px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.logo {
		font-size: 18px;
		font-weight: 700;
		letter-spacing: 2px;
		color: #2a2a2a;
		cursor: pointer;
		transition: opacity 0.2s ease;
	}

	.logo:hover { opacity: 0.7; }

	.logo-subtitle {
		font-size: 11px;
		font-weight: 300;
		letter-spacing: 3px;
		color: rgba(42, 42, 42, 0.7);
		margin: 4px 0 0;
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
		transition: color 0.3s ease;
		position: relative;
	}

	.nav a:hover, .nav a.active { color: #2a2a2a; }

	.nav a.active::after {
		content: '';
		position: absolute;
		bottom: -8px;
		left: 0; right: 0;
		height: 2px;
		background: #2a2a2a;
	}

	/* Filter bar */
	.filter-bar {
		padding: 0 60px 32px;
		display: flex;
		gap: 16px;
		justify-content: flex-start;
		flex-wrap: wrap;
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

	/* Main layout */
	.main-layout {
		display: grid;
		grid-template-columns: 320px 1fr;
		gap: 0;
		padding: 0 60px 80px;
		align-items: start;
	}

	/* Left intro */
	.intro-panel {
		padding-right: 48px;
		position: sticky;
		top: 40px;
	}

	.intro-panel h1 {
		font-size: 36px;
		font-weight: 700;
		letter-spacing: -0.5px;
		color: #2a2a2a;
		line-height: 1.2;
		margin: 0 0 20px;
	}

	.intro-panel p {
		font-size: 14px;
		color: rgba(42, 42, 42, 0.6);
		line-height: 1.7;
		margin: 0 0 12px;
	}

	.intro-panel em {
		font-style: italic;
		color: rgba(42, 42, 42, 0.45);
	}

	.intro-divider {
		width: 40px;
		height: 2px;
		background: #2a2a2a;
		margin: 20px 0;
	}

	.intro-sub {
		font-size: 12px !important;
		color: rgba(42, 42, 42, 0.4) !important;
	}

	/* Articles grid */
	.articles-container {
		min-width: 0;
	}

	.articles-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 28px;
	}

	.article-card {
		border: 1px solid rgba(0, 0, 0, 0.08);
		border-radius: 16px;
		overflow: hidden;
		cursor: pointer;
		transition: box-shadow 0.25s ease, transform 0.25s ease;
		display: flex;
		flex-direction: column;
		background: white;
	}

	.article-card:hover {
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
		transform: translateY(-3px);
	}

	.card-image {
		position: relative;
		height: 180px;
		background: #e8e8e8;
		overflow: hidden;
	}

	.card-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.4s ease;
	}

	.article-card:hover .card-image img {
		transform: scale(1.04);
	}

	.category-badge {
		position: absolute;
		top: 12px;
		left: 12px;
		padding: 3px 9px;
		border-radius: 20px;
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.8px;
		text-transform: uppercase;
		color: white;
	}

	.image-placeholder {
		width: 100%;
		height: 100%;
		background: linear-gradient(135deg, #e0e0e0, #c8c8c8);
	}

	.card-body {
		padding: 18px 20px 20px;
		display: flex;
		flex-direction: column;
		gap: 7px;
		flex: 1;
	}

	.meta {
		font-size: 10px;
		font-weight: 500;
		letter-spacing: 0.5px;
		color: rgba(42, 42, 42, 0.4);
		text-transform: uppercase;
	}

	.card-body h3 {
		font-size: 14px;
		font-weight: 700;
		color: #2a2a2a;
		line-height: 1.4;
		margin: 0;
	}

	.card-body p {
		font-size: 12.5px;
		color: rgba(42, 42, 42, 0.6);
		line-height: 1.6;
		margin: 0;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.read-more {
		font-size: 11px;
		font-weight: 600;
		color: #2a2a2a;
		margin-top: 4px;
	}

	@media (max-width: 768px) {
		.section-content { padding: 30px 24px 40px; }
		.nav { gap: 24px; }
		.filter-bar { padding: 0 24px 24px; gap: 10px; }
		.filter-button { padding: 10px 16px; font-size: 12px; }
		.main-layout {
			grid-template-columns: 1fr;
			padding: 0 24px 60px;
		}
		.intro-panel {
			position: static;
			padding-right: 0;
			margin-bottom: 32px;
		}
		.articles-grid { grid-template-columns: 1fr; gap: 20px; }
	}
</style>
