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
	price?: number;
	disabled?: boolean;
	details?: CourseDetails;
};

export type CourseDetails = {
	longDescription: string;
	duration: string;
	prerequisites?: string;
	highlights: string[];
	includes?: string[];
	tags?: string[];
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
		image: '/images/courses/GUE discoverDiver.jpg',
		details: {
			longDescription: 'A half-day experience designed for anyone curious about scuba diving. Under close supervision, you will learn basic breathing techniques, underwater communication, and enjoy your first guided dive in shallow, controlled conditions.',
			duration: 'Half day',
			highlights: [
				'No prior experience required',
				'Supervised shallow water dive',
				'Basic underwater skills introduction',
				'All equipment provided'
			],
			tags: ['Beginner', 'Try Dive', 'No Experience', 'Introduction']
		}
	},
	{
		id: 2,
		title: 'GUE Scuba Diver',
		category: 'none-diver',
		description: 'Entry-level certification for those new to diving.',
		image: '/images/courses/GUE scubaDiver.jpg',
		details: {
			longDescription: 'The GUE Scuba Diver course provides a structured entry into recreational diving. You will develop core skills including buoyancy control, propulsion techniques, and team awareness — all built on the GUE methodology from day one.',
			duration: '3 days',
			highlights: [
				'GUE-standard skill development from the start',
				'Buoyancy and trim fundamentals',
				'Basic team diving protocols',
				'Open water certification'
			],
			tags: ['Certification', 'Beginner', 'Recreational', 'GUE Standard']
		}
	},
	{
		id: 3,
		title: 'GUE Open Water Diver',
		category: 'none-diver',
		description: 'Comprehensive open water certification for beginners.',
		image: '/images/courses/GUE openWaterDiver.jpg',
		details: {
			longDescription: 'A comprehensive certification that takes non-divers through the full GUE open water curriculum. This course emphasizes precision, awareness, and strong fundamentals — preparing you for a lifetime of safe, skilled diving.',
			duration: '5 days',
			highlights: [
				'Complete beginner to certified diver',
				'GUE-standard buoyancy and trim',
				'Gas management and planning',
				'Team diving and communication',
				'Multiple open water dives'
			],
			tags: ['Certification', 'Open Water', 'Full Course', 'Beginner to Diver']
		}
	},
	{
		id: 4,
		title: 'GUE Performance Diver',
		category: 'existing-diver',
		description: 'Enhance your skills and learn GUE techniques.',
		image: '/images/courses/GUE performanceDiver.jpg',
		price: 400,
		details: {
			longDescription: 'Bridge the gap between conventional diving and GUE-level performance. This course refines your existing skills and introduces GUE\'s approach to buoyancy, trim, propulsion, and team awareness. Ideal for certified divers looking to elevate their technique.',
			duration: '2 days',
			prerequisites: 'Open Water certification from any agency',
			highlights: [
				'Precision buoyancy and horizontal trim',
				'GUE propulsion techniques (frog kick, back kick)',
				'Team positioning and communication',
				'Equipment configuration review',
				'Pathway to GUE Fundamentals'
			],
			tags: ['Skill Enhancement', 'Buoyancy', 'Trim', 'Crossover']
		}
	},
	{
		id: 5,
		title: 'GUE Basic Fundamentals',
		category: 'existing-diver',
		description: "Master fundamental diving skills with GUE's methodology.",
		image: '/images/courses/GUE BasicFundamentalsDiver.jpg',
		price: 600,
		details: {
			longDescription: 'The cornerstone of the GUE training system. Fundamentals develops mastery of core diving skills — buoyancy, trim, propulsion, and awareness — to a level that serves as the foundation for all further GUE training. This course is demanding, rewarding, and transformational.',
			duration: '4 days',
			prerequisites: 'GUE Performance Diver or equivalent experience',
			highlights: [
				'Mastery of buoyancy and trim control',
				'Advanced propulsion techniques',
				'S-drill and valve management',
				'Gas sharing and team rescue protocols',
				'Situational awareness training',
				'Foundation for all advanced GUE courses'
			],
			includes: [
				'4 days of intensive training',
				'Academic sessions and dive briefings',
				'Video review and analysis',
				'GUE certification upon completion'
			],
			tags: ['Fundamentals', 'Core Skills', 'Buoyancy Mastery', 'Team Diving']
		}
	},
	{
		id: 6,
		title: 'GUE Technical Fundamentals',
		category: 'existing-diver',
		description: 'Advanced fundamental skills for technical diving.',
		image: '/images/courses/GUE techFundamentalsDiver.jpg',
		price: 750,
		details: {
			longDescription: 'An advanced version of the Fundamentals course designed for experienced divers seeking technical diving readiness. Covers doubles configuration, advanced gas management, decompression theory, and the skills needed to progress into GUE technical courses.',
			duration: '5 days',
			prerequisites: 'GUE Basic Fundamentals pass or equivalent',
			highlights: [
				'Doubles configuration and management',
				'Advanced buoyancy and team skills',
				'Decompression theory and planning',
				'Stage bottle handling introduction',
				'Emergency management scenarios',
				'Gateway to Tech 1 and cave courses'
			],
			includes: [
				'5 days of intensive training',
				'Academic and in-water sessions',
				'Video review and debrief',
				'GUE Tech Fundamentals certification'
			],
			tags: ['Technical Diving', 'Doubles', 'Decompression', 'Advanced']
		}
	},
	{
		id: 7,
		title: 'GUE Doubles Primer',
		category: 'existing-diver',
		description: 'Introduction to diving with double cylinders.',
		image: '/images/courses/GUE doublesDiver.jpg',
		price: 300,
		details: {
			longDescription: 'A focused course introducing the skills and configuration needed to dive with back-mounted doubles. Learn proper manifold management, valve drills, and how doubles expand your gas supply and redundancy for longer, deeper dives.',
			duration: '2 days',
			prerequisites: 'GUE Performance Diver or Fundamentals',
			highlights: [
				'Doubles configuration and setup',
				'Valve management and isolation drills',
				'Buoyancy adjustment for doubles',
				'Gas planning with increased supply',
				'Preparation for Fundamentals in doubles'
			],
			tags: ['Doubles', 'Twinset', 'Manifold', 'Redundancy']
		}
	},
	{
		id: 8,
		title: 'GUE Drysuit Primer',
		category: 'existing-diver',
		description: 'Learn proper drysuit diving techniques.',
		image: '/images/courses/GUE drysuitDiver.jpg',
		price: 300,
		details: {
			longDescription: 'Master the techniques required for safe and comfortable drysuit diving. This course covers suit selection, buoyancy management with a drysuit, thermal protection strategy, and emergency procedures specific to drysuit use.',
			duration: '2 days',
			prerequisites: 'Open Water certification',
			highlights: [
				'Drysuit buoyancy management',
				'Proper undergarment selection',
				'Emergency procedures (inverted, flooded suit)',
				'Squeeze management and venting',
				'Cold water diving considerations'
			],
			tags: ['Drysuit', 'Cold Water', 'Thermal Protection', 'Buoyancy']
		}
	},
	{
		id: 9,
		title: 'GUE DPV 1',
		category: 'gue-diver',
		description: 'Underwater scooter operations for GUE divers.',
		image: '/images/courses/GUE dpvDiver.jpg',
		price: 450,
		details: {
			longDescription: 'Learn to operate Diver Propulsion Vehicles (DPVs/scooters) safely and efficiently. This course covers towing techniques, team formations, emergency procedures, and the planning considerations unique to scooter-assisted diving.',
			duration: '3 days',
			prerequisites: 'GUE Fundamentals (Tech or Rec pass)',
			highlights: [
				'DPV operation and handling',
				'Team formations and communication',
				'Tow procedures and management',
				'Emergency protocols (runaway, failure)',
				'Navigation with DPV',
				'Mission planning for scooter dives'
			],
			tags: ['DPV', 'Scooter', 'Propulsion', 'Exploration']
		}
	},
	{
		id: 10,
		title: 'GUE Navigation Primer',
		category: 'gue-diver',
		description: 'Advanced underwater navigation techniques.',
		image: '/images/courses/GUE navigationDiver.jpg',
		price: 300,
		details: {
			longDescription: 'Develop precise underwater navigation skills using compass, natural references, and distance estimation. This course builds confidence in low-visibility conditions and complex dive site layouts.',
			duration: '2 days',
			prerequisites: 'GUE Fundamentals (any level)',
			highlights: [
				'Compass navigation patterns',
				'Natural navigation techniques',
				'Distance estimation methods',
				'Multi-leg navigation planning',
				'Low visibility navigation skills'
			],
			tags: ['Navigation', 'Compass', 'Underwater Skills', 'Low Visibility']
		}
	},
	{
		id: 11,
		title: 'GUE Deep Primer',
		category: 'gue-diver',
		description: 'Introduction to deeper recreational diving.',
		image: '/images/courses/GUE deepDiver.jpg',
		price: 300,
		details: {
			longDescription: 'Extend your depth range safely within recreational limits. This course covers the physiological effects of depth, gas planning for deeper profiles, narcosis management, and the skills needed to operate confidently at greater depths.',
			duration: '2 days',
			prerequisites: 'GUE Fundamentals (Rec pass or higher)',
			highlights: [
				'Depth physiology and narcosis awareness',
				'Gas planning for deeper profiles',
				'Ascent management and safety stops',
				'Team protocols at depth',
				'Emergency procedures for deep dives'
			],
			tags: ['Deep Diving', 'Narcosis', 'Gas Planning', 'Recreational']
		}
	},
	{
		id: 12,
		title: 'GUE Symbios CCR Fundamentals',
		category: 'rebreathers',
		description: 'Closed circuit rebreather training on the Symbios.',
		image: '/images/courses/GUE symbiosDiver.jpg',
		disabled: true
	},
	{
		id: 13,
		title: 'GUE JJ CCR Fundamentals',
		category: 'rebreathers',
		description: 'JJ-CCR rebreather certification and skills.',
		image: '/images/courses/GUE JJDiver.jpg',
		disabled: true
	},
	{
		id: 14,
		title: 'JJ CCR - MOD 1',
		category: 'rebreathers',
		description: 'Advanced JJ-CCR training module.',
		image: '/images/courses/GUE JJMOD1Diver.jpg',
		disabled: true
	},
	{
		id: 15,
		title: 'GUE Instructor Development',
		category: 'instructor',
		description: 'Become a GUE instructor. Learn to teach effectively.',
		image: '/images/courses/GUE instructorDevelopment.jpg',
		disabled: true
	}
];
