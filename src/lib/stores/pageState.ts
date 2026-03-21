import { writable } from 'svelte/store';
import type { TrainingCourse } from '$lib/data/trainingCourses';

export const sliderPosition = writable(50);
export const isDragging = writable(false);
export const showQuestionnaire = writable(false);
export const showTrainingView = writable(false);
export const showGearView = writable(false);
export const showScheduleView = writable(false);
export const isMobile = writable(false);
export const currentMobileSection = writable(0); // 0=training, 1=gear
export const isMobileMenuOpen = writable(false);
export const selectedCourse = writable<TrainingCourse | null>(null);
