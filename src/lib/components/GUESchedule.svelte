<script lang="ts">
	import { onMount } from 'svelte';
	import type { GUEClass } from '../../routes/api/gue-schedule/+server';

	let classes: GUEClass[] = [];
	let loading = true;
	let error = false;
	let activeMonth = 'all';

	$: grouped = groupByMonth(classes);
	$: months = grouped.map(([m]) => m);
	$: visibleClasses = activeMonth === 'all'
		? classes
		: (grouped.find(([m]) => m === activeMonth)?.[1] ?? []);

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
		} catch { return dateStr; }
	}

	function formatDayFull(dateStr: string): { weekday: string; day: string; month: string } {
		try {
			const d = new Date(dateStr);
			return {
				weekday: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
				day: String(d.getDate()),
				month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
			};
		} catch { return { weekday: '', day: '', month: '' }; }
	}

	onMount(async () => {
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

<!-- Filter bar — same structure as training CourseFilterBar -->
<div class="training-content">
	<nav class="filter-bar">
		<a href="#all" class="filter-link" class:active={activeMonth === 'all'}
			on:click|preventDefault|stopPropagation={() => (activeMonth = 'all')}>ALL</a>
		{#each months as month}
			<span class="filter-separator">/</span>
			<a href="#{month}" class="filter-link" class:active={activeMonth === month}
				on:click|preventDefault|stopPropagation={() => (activeMonth = month)}>{month.toUpperCase()}</a>
		{/each}
	</nav>
</div>

<!-- Main layout — 25/75 split matching training -->
<div class="sch-layout">
	<!-- Left hero -->
	<div class="sch-hero">
		<h1 class="sch-title">Upcoming Classes</h1>
		<p class="sch-description">
			These are the courses currently running and scheduled. Click on any class to view full details, available spots, and pricing directly on GUE.com.
		</p>
		<p class="sch-tagline">Not seeing what you need?</p>
		<div class="sch-cta-block">
			<p class="schedule-cta-note">If a course isn't listed or you'd like to arrange a private session, reach out directly — we'll find a date that works for you.</p>
			<a href="mailto:info@theoceanfrontier.com" class="schedule-cta">
				Contact Us to Book
			</a>
		</div>
	</div>

	<!-- Right: class cards -->
	<div class="sch-cards">
		{#if loading}
			<div class="schedule-state">
				<div class="spinner"></div>
				<span>Loading schedule…</span>
			</div>
		{:else if error}
			<div class="schedule-state muted">Unable to load schedule. Check back later.</div>
		{:else if visibleClasses.length === 0}
			<div class="schedule-state muted">No upcoming classes scheduled.</div>
		{:else}
			<div class="schedule-grid">
				{#each visibleClasses as cls, i}
					{@const d = formatDayFull(cls.date)}
					<a
						class="schedule-card"
						style="--card-index: {i}"
						href={cls.url || undefined}
						target={cls.url ? '_blank' : undefined}
						rel="noopener"
					>
						<div class="card-date">
							<span class="date-weekday">{d.weekday}</span>
							<span class="date-day">{d.day}</span>
							<span class="date-month">{d.month}</span>
						</div>
						<div class="card-divider"></div>
						<div class="card-info">
							<span class="card-title">{cls.title}</span>
							<span class="card-location">
								<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
									<circle cx="12" cy="10" r="3"></circle>
								</svg>
								{cls.location}
							</span>
						</div>
						{#if cls.url}
							<svg class="card-arrow" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
								<polyline points="9 18 15 12 9 6"></polyline>
							</svg>
						{/if}
					</a>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	/* States */
	.schedule-state {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 13px;
		color: #2a2a2a;
		padding: 24px 0;
	}
	.schedule-state.muted { color: rgba(42, 42, 42, 0.4); }

	.spinner {
		width: 15px;
		height: 15px;
		border: 2px solid rgba(42, 42, 42, 0.15);
		border-top-color: #2a2a2a;
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
		flex-shrink: 0;
	}
	@keyframes spin { to { transform: rotate(360deg); } }

	/* Layout */
	.sch-layout {
		display: flex;
		align-items: flex-start;
		gap: 60px;
		padding: 0 0 60px 0;
	}

	/* Hero — left 25% */
	.sch-hero {
		flex: 0 0 25%;
		text-align: left;
		padding: 40px 0;
		animation: chunkFadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.3s backwards;
	}

	.sch-title {
		font-size: 48px;
		font-weight: 700;
		color: #2a2a2a;
		margin: 0 0 24px 0;
		line-height: 1.05;
		letter-spacing: -0.02em;
	}

	.sch-description {
		font-size: 16px;
		line-height: 1.7;
		color: #6b6b6b;
		margin: 0 0 24px 0;
	}

	.sch-tagline {
		font-size: 18px;
		line-height: 1.5;
		color: #2a2a2a;
		margin: 0 0 16px 0;
		font-style: italic;
	}

	.sch-cta-block {
		margin-top: 8px;
	}

	/* Cards — right 75% */
	.sch-cards {
		flex: 1;
		min-width: 0;
		width: 100%;
		padding: 0 0 60px 0;
		animation: chunkFadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.4s backwards;
	}

	.schedule-cta-note {
		font-size: 12px;
		line-height: 1.6;
		color: rgba(42, 42, 42, 0.5);
		margin: 0;
	}

	/* CTA override — teal style from training but fits schedule context */
	.schedule-cta {
		display: inline-block;
		margin-top: 16px;
		padding: 16px 32px;
		background: linear-gradient(135deg, #00bcd4 0%, #00acc1 50%, #0097a7 100%);
		border: none;
		border-radius: 50px;
		color: white;
		font-size: 14px;
		font-weight: 700;
		letter-spacing: 0.5px;
		cursor: pointer;
		text-decoration: none;
		transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, background 0.3s ease;
		position: relative;
		overflow: hidden;
	}

	.schedule-cta:hover {
		transform: translateY(-4px) scale(1.04);
		background: linear-gradient(135deg, #00acc1 0%, #0097a7 50%, #00838f 100%);
		box-shadow: 0 12px 40px rgba(0, 188, 212, 0.4), 0 4px 16px rgba(0, 0, 0, 0.1);
	}

	/* Grid */
	.schedule-grid {
		display: flex;
		flex-direction: column;
		gap: 10px;
		width: 100%;
	}

	@keyframes chunkFadeUp {
		from { opacity: 0; transform: translateY(30px); }
		to   { opacity: 1; transform: translateY(0); }
	}

	/* Schedule card */
	.schedule-card {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 8px 14px;
		width: 100%;
		box-sizing: border-box;
		background: rgba(255, 255, 255, 0.55);
		border: 1px solid rgba(42, 42, 42, 0.08);
		border-radius: 10px;
		text-decoration: none;
		color: inherit;
		backdrop-filter: blur(6px);
		animation: cardSlideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
		animation-delay: calc(var(--card-index) * 50ms);
		transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease, box-shadow 0.15s ease;
	}

	@keyframes cardSlideUp {
		from { opacity: 0; transform: translateY(16px); }
		to   { opacity: 1; transform: translateY(0); }
	}

	.schedule-card:hover {
		background: rgba(255, 255, 255, 0.9);
		border-color: rgba(42, 42, 42, 0.14);
		transform: translateY(-1px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
	}

	/* Date block */
	.card-date {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 36px;
		flex-shrink: 0;
	}

	.date-weekday {
		font-size: 7px;
		font-weight: 700;
		letter-spacing: 0.6px;
		color: rgba(42, 42, 42, 0.4);
	}

	.date-day {
		font-size: 18px;
		font-weight: 700;
		line-height: 1;
		color: #2a2a2a;
		letter-spacing: -0.02em;
	}

	.date-month {
		font-size: 7px;
		font-weight: 700;
		letter-spacing: 0.6px;
		color: rgba(42, 42, 42, 0.4);
	}

	.card-divider {
		width: 1px;
		height: 24px;
		background: rgba(42, 42, 42, 0.08);
		flex-shrink: 0;
	}

	/* Info — left-aligned */
	.card-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 3px;
		min-width: 0;
		text-align: left;
	}

	.card-title {
		font-size: 12px;
		font-weight: 600;
		color: #2a2a2a;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: left;
	}

	.card-location {
		display: flex;
		align-items: center;
		gap: 3px;
		font-size: 10px;
		color: rgba(42, 42, 42, 0.45);
		text-align: left;
	}

	.card-arrow {
		color: rgba(42, 42, 42, 0.2);
		flex-shrink: 0;
		transition: color 0.15s ease, transform 0.15s ease;
	}

	.schedule-card:hover .card-arrow {
		color: rgba(42, 42, 42, 0.6);
		transform: translateX(2px);
	}

	@media (min-width: 769px) {
		.schedule-grid {
			max-width: 480px;
		}

		.schedule-card {
			padding: 12px 18px;
			gap: 18px;
		}

		.date-day {
			font-size: 24px;
		}

		.date-weekday,
		.date-month {
			font-size: 9px;
		}

		.card-divider {
			height: 32px;
		}

		.card-title {
			font-size: 14px;
		}

		.card-location {
			font-size: 11px;
		}
	}

	@media (max-width: 768px) {
		.sch-layout {
			flex-direction: column;
			gap: 24px;
			align-items: stretch;
			padding: 0 0 40px 0;
		}

		.sch-hero {
			padding: 24px 0 0 0;
			flex: none;
		}

		.sch-title {
			font-size: 32px;
		}

		.sch-description,
		.sch-tagline {
			font-size: 14px;
		}

		.sch-cards {
			width: 100%;
			padding: 0 0 40px 0;
		}

		.schedule-grid {
			width: 100%;
			max-width: 100%;
		}

		.schedule-card {
			width: 100%;
			max-width: 100%;
		}
	}

</style>
