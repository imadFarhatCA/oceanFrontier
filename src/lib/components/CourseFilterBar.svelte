<script lang="ts">
	import type { CourseFilter } from '$lib/data/trainingCourses';

	export let activeFilter: CourseFilter = 'all';
	export let onFilter: (filter: CourseFilter) => void = () => {};

	/** Set to true to use button-style pills (training page standalone style) */
	export let buttonStyle: boolean = false;
</script>

{#if buttonStyle}
	<div class="filter-bar">
		<button
			class="filter-button"
			class:active={activeFilter === 'all'}
			on:click={() => onFilter('all')}
		>
			All Courses
		</button>
		<button
			class="filter-button"
			class:active={activeFilter === 'none-diver'}
			on:click={() => onFilter('none-diver')}
		>
			Non Diver
		</button>
		<button
			class="filter-button"
			class:active={activeFilter === 'existing-diver'}
			on:click={() => onFilter('existing-diver')}
		>
			Existing Diver
		</button>
		<button
			class="filter-button"
			class:active={activeFilter === 'gue-diver'}
			on:click={() => onFilter('gue-diver')}
		>
			GUE Diver
		</button>
		<button
			class="filter-button"
			class:active={activeFilter === 'rebreathers'}
			on:click={() => onFilter('rebreathers')}
		>
			Rebreathers
		</button>
		<button
			class="filter-button"
			class:active={activeFilter === 'instructor'}
			on:click={() => onFilter('instructor')}
		>
			Instructor Development
		</button>
	</div>
{:else}
	<nav class="filter-bar">
		<a href="#all" class="filter-link" class:active={activeFilter === 'all'} on:click|preventDefault|stopPropagation={() => onFilter('all')}>ALL COURSES</a>
		<span class="filter-separator">/</span>
		<a href="#non-diver" class="filter-link" class:active={activeFilter === 'none-diver'} on:click|preventDefault|stopPropagation={() => onFilter('none-diver')}>NON DIVER</a>
		<span class="filter-separator">/</span>
		<a href="#existing" class="filter-link" class:active={activeFilter === 'existing-diver'} on:click|preventDefault|stopPropagation={() => onFilter('existing-diver')}>EXISTING DIVER</a>
		<span class="filter-separator">/</span>
		<a href="#gue" class="filter-link" class:active={activeFilter === 'gue-diver'} on:click|preventDefault|stopPropagation={() => onFilter('gue-diver')}>GUE DIVER</a>
		<span class="filter-separator">/</span>
		<a href="#rebreathers" class="filter-link" class:active={activeFilter === 'rebreathers'} on:click|preventDefault|stopPropagation={() => onFilter('rebreathers')}>REBREATHERS</a>
		<span class="filter-separator">/</span>
		<a href="#instructor" class="filter-link" class:active={activeFilter === 'instructor'} on:click|preventDefault|stopPropagation={() => onFilter('instructor')}>INSTRUCTOR</a>
	</nav>
{/if}

<style>
	/* Link-style filter bar (default nav style) */
	nav.filter-bar {
		display: flex;
		gap: 12px;
		align-items: center;
		flex-wrap: wrap;
		padding: 0;
	}

	/* Button-style filter bar (used on standalone training page) */
	div.filter-bar {
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

	@media (max-width: 768px) {
		div.filter-bar {
			padding: 20px 24px;
			gap: 12px;
		}

		.filter-button {
			padding: 10px 18px;
			font-size: 12px;
		}
	}
</style>
