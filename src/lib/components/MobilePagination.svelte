<script lang="ts">
	import {
		isMobile,
		currentMobileSection,
		showTrainingView,
		showGearView,
		showQuestionnaire
	} from '$lib/stores/pageState';

	function switchSection(section: number) {
		currentMobileSection.set(section);
	}
</script>

{#if $isMobile && !$showTrainingView && !$showGearView && !$showQuestionnaire}
	<div class="mobile-pagination">
		<button
			class="pagination-dot"
			class:active={$currentMobileSection === 0}
			on:click={() => switchSection(0)}
			aria-label="Training section"
		></button>
		<button
			class="pagination-dot"
			class:active={$currentMobileSection === 1}
			on:click={() => switchSection(1)}
			aria-label="Gear section"
		></button>
	</div>

	<!-- Swipe Hint - iPhone toggle style -->
	<div class="swipe-hint" class:swipe-left={$currentMobileSection === 1}>
		<span class="swipe-label"
			>{$currentMobileSection === 0 ? 'Slide for "Equipment"' : 'Slide for "Training"'}</span
		>
		<div class="swipe-track">
			<div class="swipe-slider">
				<svg
					class="swipe-arrow"
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="3"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<polyline points="9 18 15 12 9 6"></polyline>
				</svg>
			</div>
		</div>
	</div>
{/if}
