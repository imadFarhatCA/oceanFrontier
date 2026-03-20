<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { TrainingCourse } from '$lib/data/trainingCourses';
	import { cart } from '$lib/cart/cartStore';

	export let course: TrainingCourse;
	export let index: number = 0;

	const dispatch = createEventDispatcher();

	function addToCart() {
		cart.addItem({
			type: 'course',
			id: String(course.id),
			name: course.title,
			image: course.image,
			price: course.price ?? 0
		});
	}

	function openDetails() {
		dispatch('learnmore', course);
	}
</script>

<div
	class="course-card"
	class:course-card-disabled={course.disabled}
	style="--card-index: {index}"
>
	<div class="course-image-wrapper">
		<div class="course-image" style="background-image: url('{course.image}')">
			<div class="image-overlay"></div>
		</div>
	</div>
	<div class="course-content">
		<h3 class="course-title">{course.title}</h3>
		<p class="course-description">{course.description}</p>
		{#if course.disabled}
			<button class="course-cta course-cta-disabled" disabled>Coming Soon</button>
		{:else}
			<button class="course-cta" on:click|stopPropagation={openDetails}>Learn More</button>
			{#if course.price}
				<button class="course-add-cart" on:click|stopPropagation={addToCart}>
					<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<circle cx="9" cy="21" r="1"></circle>
						<circle cx="20" cy="21" r="1"></circle>
						<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
					</svg>
					Add to Cart — {course.price} EUR
				</button>
			{/if}
		{/if}
	</div>
</div>
