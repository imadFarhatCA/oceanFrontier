<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { GUEClass } from '../api/gue-schedule/+server';

	let classes: GUEClass[] = [];
	let loading = true;
	let error = false;
	let activeMonth = '';
	let ready = false;

	$: grouped = groupByMonth(classes);
	$: if (grouped.length > 0 && !activeMonth) activeMonth = grouped[0][0];

	function navigate(e: MouseEvent, href: string) {
		e.preventDefault();
		ready = false;
		setTimeout(() => goto(href), 350);
	}

	function groupByMonth(items: GUEClass[]) {
		const map = new Map<string, GUEClass[]>();
		for (const item of items) {
			const key = formatMonthKey(item.date);
			if (!map.has(key)) map.set(key, []);
			map.get(key)!.push(item);
		}
		return Array.from(map.entries());
	}

	function formatMonthKey(dateStr: string): string {
		try {
			return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
		} catch {
			return dateStr;
		}
	}

	function formatDayFull(dateStr: string): { weekday: string; day: string; month: string } {
		try {
			const d = new Date(dateStr);
			return {
				weekday: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
				day: String(d.getDate()),
				month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
			};
		} catch {
			return { weekday: '', day: '', month: '' };
		}
	}

	onMount(async () => {
		// Trigger entrance animation
		requestAnimationFrame(() => { ready = true; });

		try {
			const res = await fetch('/api/gue-schedule');
			if (!res.ok) throw new Error();
			classes = await res.json();
		} catch {
			error = true;
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>Class Schedule | the Ocean Frontier — Cyprus</title>
	<meta name="description" content="Upcoming GUE dive training classes in Cyprus taught by Imad Farhat. Book your next course." />
	<meta property="og:title" content="Class Schedule | the Ocean Frontier — Cyprus" />
	<meta property="og:description" content="Upcoming GUE dive training classes in Cyprus taught by Imad Farhat. Book your next course." />
	<meta property="og:url" content="https://theoceanfrontier.com/schedule" />
	<meta property="og:image" content="https://theoceanfrontier.com/og-image.jpg" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Class Schedule | the Ocean Frontier — Cyprus" />
	<meta name="twitter:description" content="Upcoming GUE dive training classes in Cyprus. Book your next GUE course." />
	<meta name="twitter:image" content="https://theoceanfrontier.com/og-image.jpg" />
	<link rel="canonical" href="https://theoceanfrontier.com/schedule" />
</svelte:head>

<div class="page" class:ready>
	<!-- Header — matches homepage left section -->
	<div class="section-content">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="logo" on:click={(e) => navigate(e, '/')}>OCEAN FRONTIER</div>
		<div class="logo-subtitle">CONSULTING</div>
		<nav class="nav">
			<a href="/" on:click={(e) => navigate(e, '/')}>HOMEPAGE</a>
			<a href="/training" on:click={(e) => navigate(e, '/training')}>TRAINING</a>
			<a href="/schedule" class="nav-active">SCHEDULE</a>
			<a href="/gear" on:click={(e) => navigate(e, '/gear')}>GEAR</a>
			<a href="/community" on:click={(e) => navigate(e, '/community')}>COMMUNITY</a>
		</nav>
	</div>

	<!-- Content -->
	<div class="content">
		<div class="page-title-row">
			<h1 class="page-title">Upcoming Classes</h1>
			<p class="page-subtitle">Synced from <a href="https://www.gue.com/diver-training/gue-class-schedule?instructor_name=imad+farhat" target="_blank" rel="noopener">gue.com</a> · updated every 12 hours</p>
		</div>

		{#if loading}
			<div class="state-row">
				<div class="spinner"></div>
				<span>Loading schedule…</span>
			</div>
		{:else if error}
			<div class="state-row muted">Unable to load schedule. Check back later.</div>
		{:else if classes.length === 0}
			<div class="state-row muted">No upcoming classes scheduled.</div>
		{:else}
			<div class="layout">
				<!-- Month sidebar -->
				<aside class="month-nav">
					{#each grouped as [month]}
						<button
							class="month-btn"
							class:active={month === activeMonth}
							on:click={() => (activeMonth = month)}
						>
							{month}
						</button>
					{/each}
				</aside>

				<!-- Classes list -->
				<div class="classes-panel">
					{#each grouped as [month, items]}
						{#if month === activeMonth}
							<div class="classes-list">
								{#each items as cls, i}
									{@const d = formatDayFull(cls.date)}
									<a
										class="class-card"
										style="animation-delay: {i * 60}ms"
										href={cls.url || undefined}
										target={cls.url ? '_blank' : undefined}
										rel="noopener"
									>
										<div class="date-block">
											<span class="date-weekday">{d.weekday}</span>
											<span class="date-day">{d.day}</span>
											<span class="date-month">{d.month}</span>
										</div>
										<div class="class-info">
											<span class="class-title">{cls.title}</span>
											<span class="class-location">
												<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
													<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
													<circle cx="12" cy="10" r="3"></circle>
												</svg>
												{cls.location}
											</span>
										</div>
										{#if cls.url}
											<div class="class-cta">
												<span>View Details</span>
												<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
													<polyline points="9 18 15 12 9 6"></polyline>
												</svg>
											</div>
										{/if}
									</a>
								{/each}
							</div>
						{/if}
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	/* ─── Page shell — matches homepage left section ─── */
	.page {
		min-height: 100vh;
		background: linear-gradient(135deg, #e8e8e8 0%, #f5f5f5 100%);
		color: #2a2a2a;
		font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		opacity: 0;
		transition: opacity 0.4s ease;
	}

	.page.ready {
		opacity: 1;
	}

	/* ─── Header — identical to homepage .section-content ─── */
	.section-content {
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column;
		padding: 40px 60px;
	}

	.logo {
		font-size: 18px;
		font-weight: 700;
		letter-spacing: 2px;
		margin-bottom: 10px;
		color: #2a2a2a;
		cursor: pointer;
		transition: opacity 0.2s ease;
	}

	.logo:hover {
		opacity: 0.7;
	}

	.logo-subtitle {
		font-size: 11px;
		font-weight: 300;
		letter-spacing: 3px;
		opacity: 0.6;
		margin-bottom: 0;
		margin-top: -4px;
		color: #2a2a2a;
	}

	.nav {
		display: flex;
		gap: 30px;
		margin-top: 24px;
	}

	.nav a {
		color: rgba(42, 42, 42, 0.55);
		text-decoration: none;
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 1px;
		transition: color 0.2s ease;
		position: relative;
	}

	.nav a:hover,
	.nav a.nav-active {
		color: #2a2a2a;
	}

	.nav a.nav-active::after {
		content: '';
		position: absolute;
		bottom: -6px;
		left: 0;
		right: 0;
		height: 2px;
		background: #2a2a2a;
	}

	/* ─── Content ─── */
	.content {
		padding: 0 60px 80px;
		animation: slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
		animation-delay: 0.1s;
	}

	@keyframes slideUpFade {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.page-title-row {
		margin-bottom: 36px;
		padding-top: 8px;
		border-top: 1px solid rgba(42, 42, 42, 0.1);
	}

	.page-title {
		font-size: 28px;
		font-weight: 700;
		letter-spacing: -0.02em;
		color: #2a2a2a;
		margin: 16px 0 6px;
	}

	.page-subtitle {
		font-size: 12px;
		color: rgba(42, 42, 42, 0.45);
		margin: 0;
	}

	.page-subtitle a {
		color: inherit;
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	/* ─── States ─── */
	.state-row {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 13px;
		color: #2a2a2a;
		padding: 40px 0;
	}

	.state-row.muted {
		color: rgba(42, 42, 42, 0.35);
	}

	.spinner {
		width: 16px;
		height: 16px;
		border: 2px solid rgba(42, 42, 42, 0.15);
		border-top-color: #2a2a2a;
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
		flex-shrink: 0;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	/* ─── Layout ─── */
	.layout {
		display: flex;
		gap: 48px;
		align-items: flex-start;
	}

	/* Month sidebar */
	.month-nav {
		display: flex;
		flex-direction: column;
		gap: 2px;
		flex-shrink: 0;
		width: 160px;
		position: sticky;
		top: 24px;
	}

	.month-btn {
		text-align: left;
		background: none;
		border: none;
		padding: 8px 12px;
		border-radius: 8px;
		font-size: 13px;
		font-weight: 500;
		color: rgba(42, 42, 42, 0.45);
		cursor: pointer;
		transition: all 0.15s ease;
		font-family: inherit;
	}

	.month-btn:hover {
		color: #2a2a2a;
		background: rgba(42, 42, 42, 0.06);
	}

	.month-btn.active {
		color: #2a2a2a;
		background: rgba(42, 42, 42, 0.08);
		font-weight: 600;
	}

	/* Classes panel */
	.classes-panel {
		flex: 1;
		min-width: 0;
	}

	.classes-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	/* Class card */
	.class-card {
		display: flex;
		align-items: center;
		gap: 24px;
		padding: 20px 24px;
		background: rgba(255, 255, 255, 0.6);
		border: 1px solid rgba(42, 42, 42, 0.08);
		border-radius: 12px;
		text-decoration: none;
		color: inherit;
		backdrop-filter: blur(8px);
		animation: cardFadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
		transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
	}

	@keyframes cardFadeUp {
		from { opacity: 0; transform: translateY(16px); }
		to   { opacity: 1; transform: translateY(0); }
	}

	.class-card:hover {
		background: rgba(255, 255, 255, 0.85);
		border-color: rgba(42, 42, 42, 0.14);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.07);
		transform: translateY(-1px);
	}

	.date-block {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 48px;
		flex-shrink: 0;
	}

	.date-weekday {
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 1px;
		color: rgba(42, 42, 42, 0.4);
	}

	.date-day {
		font-size: 28px;
		font-weight: 700;
		line-height: 1;
		color: #2a2a2a;
		letter-spacing: -0.02em;
	}

	.date-month {
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 1px;
		color: rgba(42, 42, 42, 0.4);
	}

	.class-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 4px;
		min-width: 0;
		padding-left: 20px;
		border-left: 1px solid rgba(42, 42, 42, 0.08);
	}

	.class-title {
		font-size: 14px;
		font-weight: 600;
		color: #2a2a2a;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.class-location {
		display: flex;
		align-items: center;
		gap: 4px;
		font-size: 11px;
		color: rgba(42, 42, 42, 0.45);
	}

	.class-cta {
		display: flex;
		align-items: center;
		gap: 4px;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.3px;
		color: rgba(42, 42, 42, 0.3);
		flex-shrink: 0;
		transition: color 0.15s ease;
	}

	.class-card:hover .class-cta {
		color: #2a2a2a;
	}

	/* ─── Mobile ─── */
	@media (max-width: 768px) {
		.section-content {
			padding: 30px 24px;
		}

		.nav {
			gap: 20px;
			flex-wrap: wrap;
		}

		.content {
			padding: 0 24px 60px;
		}

		.layout {
			flex-direction: column;
			gap: 20px;
		}

		.month-nav {
			width: 100%;
			flex-direction: row;
			flex-wrap: wrap;
			position: static;
		}

		.month-btn {
			font-size: 12px;
		}

		.class-card {
			gap: 16px;
			padding: 16px 18px;
		}

		.class-cta span {
			display: none;
		}
	}
</style>
