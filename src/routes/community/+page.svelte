<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { articles } from '$lib/data/articles';

	let ready = false;

	const featured = articles.find(a => a.featured);
	const grid = articles.filter(a => !a.featured);

	const categoryColors: Record<string, string> = {
		Trips:    '#0a84ff',
		Gear:     '#30d158',
		Training: '#ff9f0a',
		News:     '#ff453a'
	};

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

	<div class="content-wrap">

		<!-- Page title -->
		<div class="page-header">
			<h1>Community</h1>
			<p>Stories, gear, training and news from the deep.</p>
		</div>

		<!-- Featured / Hero article -->
		{#if featured}
			<a href="/community/{featured.id}" class="hero-card" on:click={(e) => navigate(e, `/community/${featured.id}`)}>
				<div class="hero-image">
					{#if featured.image}
						<img src={featured.image} alt={featured.title} />
					{:else}
						<div class="image-placeholder"></div>
					{/if}
					<span class="hero-badge" style="background:{categoryColors[featured.category]}">{featured.category}</span>
				</div>
				<div class="hero-body">
					<span class="meta">{featured.date} · {featured.author}</span>
					<h2>{featured.title}</h2>
					<p>{featured.excerpt}</p>
					<span class="read-more">Read article →</span>
				</div>
			</a>
		{/if}

		<!-- 3-column grid -->
		<div class="articles-grid">
			{#each grid as article}
				<a href="/community/{article.id}" class="article-card" on:click={(e) => navigate(e, `/community/${article.id}`)}>
					<div class="card-image">
						{#if article.image}
							<img src={article.image} alt={article.title} />
						{:else}
							<div class="image-placeholder"></div>
						{/if}
						<span class="category-badge" style="background:{categoryColors[article.category]}">{article.category}</span>
					</div>
					<div class="card-body">
						<span class="meta">{article.date}</span>
						<h3>{article.title}</h3>
						<p>{article.excerpt}</p>
					</div>
				</a>
			{/each}
		</div>

	</div>
</div>

<style>
	:global(body.community-body) {
		overflow: auto !important;
		height: auto !important;
	}

	:global(body.community-body) :global(.app),
	:global(body.community-body) :global(.split-container),
	:global(body.community-body) :global(.left-panel),
	:global(body.community-body) :global(.right-panel) {
		display: none !important;
	}

	.community-page {
		min-height: 100vh;
		background: white;
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif;
		opacity: 0;
		transition: opacity 0.35s ease;
	}

	.community-page.ready {
		opacity: 1;
	}

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

	.nav a:hover,
	.nav a.active { color: #2a2a2a; }

	.nav a.active::after {
		content: '';
		position: absolute;
		bottom: -8px;
		left: 0;
		right: 0;
		height: 2px;
		background: #2a2a2a;
	}

	/* Content */
	.content-wrap {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 60px 80px;
	}

	.page-header {
		margin-bottom: 40px;
	}

	.page-header h1 {
		font-size: 36px;
		font-weight: 700;
		letter-spacing: -0.5px;
		color: #2a2a2a;
		margin: 0 0 8px;
	}

	.page-header p {
		font-size: 15px;
		color: rgba(42, 42, 42, 0.5);
		margin: 0;
	}

	/* Hero card */
	.hero-card {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0;
		border: 1px solid rgba(0,0,0,0.08);
		border-radius: 12px;
		overflow: hidden;
		text-decoration: none;
		margin-bottom: 48px;
		transition: box-shadow 0.2s ease, transform 0.2s ease;
	}

	.hero-card:hover {
		box-shadow: 0 8px 32px rgba(0,0,0,0.1);
		transform: translateY(-2px);
	}

	.hero-image {
		position: relative;
		min-height: 380px;
		background: #e8e8e8;
		overflow: hidden;
	}

	.hero-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.hero-badge {
		position: absolute;
		top: 16px;
		left: 16px;
		padding: 4px 10px;
		border-radius: 20px;
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.8px;
		text-transform: uppercase;
		color: white;
	}

	.hero-body {
		padding: 40px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 14px;
	}

	.hero-body h2 {
		font-size: 26px;
		font-weight: 700;
		color: #2a2a2a;
		line-height: 1.3;
		margin: 0;
		letter-spacing: -0.3px;
	}

	.hero-body p {
		font-size: 15px;
		color: rgba(42,42,42,0.65);
		line-height: 1.7;
		margin: 0;
	}

	.read-more {
		font-size: 12px;
		font-weight: 600;
		color: #2a2a2a;
		letter-spacing: 0.5px;
		margin-top: 8px;
	}

	/* Article grid */
	.articles-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 32px;
	}

	.article-card {
		border: 1px solid rgba(0,0,0,0.08);
		border-radius: 10px;
		overflow: hidden;
		text-decoration: none;
		transition: box-shadow 0.2s ease, transform 0.2s ease;
		display: flex;
		flex-direction: column;
	}

	.article-card:hover {
		box-shadow: 0 6px 24px rgba(0,0,0,0.09);
		transform: translateY(-2px);
	}

	.card-image {
		position: relative;
		height: 200px;
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
		padding: 3px 8px;
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
		background: linear-gradient(135deg, #e0e0e0 0%, #c8c8c8 100%);
	}

	.card-body {
		padding: 20px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		flex: 1;
	}

	.card-body h3 {
		font-size: 15px;
		font-weight: 700;
		color: #2a2a2a;
		line-height: 1.4;
		margin: 0;
	}

	.card-body p {
		font-size: 13px;
		color: rgba(42,42,42,0.6);
		line-height: 1.6;
		margin: 0;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.meta {
		font-size: 10px;
		font-weight: 500;
		letter-spacing: 0.5px;
		color: rgba(42,42,42,0.4);
		text-transform: uppercase;
	}

	@media (max-width: 768px) {
		.section-content { padding: 30px 24px 40px; }
		.nav { gap: 24px; }
		.content-wrap { padding: 0 24px 60px; }

		.hero-card { grid-template-columns: 1fr; }
		.hero-image { min-height: 220px; }
		.hero-body { padding: 24px; }
		.hero-body h2 { font-size: 20px; }

		.articles-grid {
			grid-template-columns: 1fr;
			gap: 20px;
		}
	}
</style>
