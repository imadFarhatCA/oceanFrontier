/**
 * Training course type definition
 * Represents a single training course with all metadata
 */
export type TrainingCourse = {
	id: number;
	title: string;
	category: CourseCategory;
	description: string;
	image: string;
};

/**
 * Course category type
 * Categorizes courses by diver experience level
 */
export type CourseCategory = 'none-diver' | 'existing-diver' | 'gue-diver' | 'rebreathers' | 'instructor';

/**
 * Course filter type
 * Used for filtering courses in the UI
 */
export type CourseFilter = 'all' | CourseCategory;

/**
 * Complete training courses data
 * All GUE training courses offered
 */
export const trainingCourses: TrainingCourse[] = [
	{
		id: 1,
		title: 'GUE Discover Diving',
		category: 'none-diver',
		description: 'Perfect introduction to diving for complete beginners.',
		image: '/images/courses/GUE discoverDiver.jpg'
	},
	{
		id: 2,
		title: 'GUE Scuba Diver',
		category: 'none-diver',
		description: 'Entry-level certification for those new to diving.',
		image: '/images/courses/GUE scubaDiver.jpg'
	},
	{
		id: 3,
		title: 'GUE Open Water Diver',
		category: 'none-diver',
		description: 'Comprehensive open water certification for beginners.',
		image: '/images/courses/GUE openWaterDiver.jpg'
	},
	{
		id: 4,
		title: 'GUE Performance Diver',
		category: 'existing-diver',
		description: 'Enhance your skills and learn GUE techniques.',
		image: '/images/courses/GUE performanceDiver.jpg'
	},
	{
		id: 5,
		title: 'GUE Basic Fundamentals',
		category: 'existing-diver',
		description: "Master fundamental diving skills with GUE's methodology.",
		image: '/images/courses/GUE BasicFundamentalsDiver.jpg'
	},
	{
		id: 6,
		title: 'GUE Technical Fundamentals',
		category: 'existing-diver',
		description: 'Advanced fundamental skills for technical diving.',
		image: '/images/courses/GUE techFundamentalsDiver.jpg'
	},
	{
		id: 7,
		title: 'GUE Doubles Primer',
		category: 'existing-diver',
		description: 'Introduction to diving with double cylinders.',
		image: '/images/courses/GUE doublesDiver.jpg'
	},
	{
		id: 8,
		title: 'GUE Drysuit Primer',
		category: 'existing-diver',
		description: 'Learn proper drysuit diving techniques.',
		image: '/images/courses/GUE drysuitDiver.jpg'
	},
	{
		id: 9,
		title: 'GUE DPV 1',
		category: 'gue-diver',
		description: 'Underwater scooter operations for GUE divers.',
		image: '/images/courses/GUE dpvDiver.jpg'
	},
	{
		id: 10,
		title: 'GUE Navigation Primer',
		category: 'gue-diver',
		description: 'Advanced underwater navigation techniques.',
		image: '/images/courses/GUE navigationDiver.jpg'
	},
	{
		id: 11,
		title: 'GUE Deep Primer',
		category: 'gue-diver',
		description: 'Introduction to deeper recreational diving.',
		image: '/images/courses/GUE deepDiver.jpg'
	},
	{
		id: 12,
		title: 'GUE Symbios CCR Fundamentals',
		category: 'rebreathers',
		description: 'Closed circuit rebreather training on the Symbios.',
		image: '/images/courses/GUE symbiosDiver.jpg'
	},
	{
		id: 13,
		title: 'GUE JJ CCR Fundamentals',
		category: 'rebreathers',
		description: 'JJ-CCR rebreather certification and skills.',
		image: '/images/courses/GUE JJDiver.jpg'
	},
	{
		id: 14,
		title: 'JJ CCR - MOD 1',
		category: 'rebreathers',
		description: 'Advanced JJ-CCR training module.',
		image: '/images/courses/GUE JJMOD1Diver.jpg'
	},
	{
		id: 15,
		title: 'GUE Instructor Development',
		category: 'instructor',
		description: 'Become a GUE instructor. Learn to teach effectively.',
		image: '/images/courses/GUE instructorDevelopment.jpg'
	}
];
