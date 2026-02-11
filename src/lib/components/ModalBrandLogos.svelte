<script lang="ts">
	import { getBrandClassName } from '$lib/data/brandConfig';

	export let brands: string[] = [];
</script>

{#if brands.length > 0}
	<div class="modal-brands">
		{#each brands as brand}
			<img
				src="/images/brands/{brand}"
				alt={brand.replace('.svg', '')}
				class="modal-brand-logo {getBrandClassName(brand)}"
			/>
		{/each}
	</div>
{/if}

<style>
	.modal-brands {
		display: flex;
		gap: 24px;
		align-items: center;
		justify-content: center;
		margin-bottom: 20px;
		flex-wrap: wrap;
	}

	.modal-brand-logo {
		height: 42px;
		width: auto;
		object-fit: contain;
		filter: invert(1) brightness(1.1);
		opacity: 0.28;
	}

	.modal-brand-logo.suunto-logo {
		height: 84px;
	}

	.modal-brand-logo.suex-logo {
		height: 28px;
	}
</style>
