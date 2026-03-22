export interface Article {
	id: string;
	title: string;
	excerpt: string;
	category: 'Trips' | 'Gear' | 'Training' | 'News';
	author: string;
	date: string;
	image?: string;
	featured?: boolean;
}

export const articles: Article[] = [
	{
		id: 'cave-diving-cyprus-2026',
		title: 'Exploring the Hidden Caves of Cyprus — A GUE Expedition Report',
		excerpt: 'Last March, a team of GUE divers set out to explore a series of newly discovered underwater cave systems off the coast of Protaras. What followed was three days of meticulous planning, technical diving, and breathtaking moments beneath the sea.',
		category: 'Trips',
		author: 'Imad Farhat',
		date: 'March 10, 2026',
		image: '/images/community/cave-expedition.jpg',
		featured: true
	},
	{
		id: 'halcyon-symbios-review',
		title: 'Halcyon Symbios: Six Months of Real-World Use',
		excerpt: 'After logging over 80 dives on the Halcyon Symbios rebreather, here are our honest findings on performance, reliability, and what sets it apart.',
		category: 'Gear',
		author: 'Imad Farhat',
		date: 'February 22, 2026',
		image: '/images/community/halcyon-symbios.jpg'
	},
	{
		id: 'gue-fundamentals-what-to-expect',
		title: 'GUE Fundamentals: What to Expect as a First-Timer',
		excerpt: 'Thinking about taking your first GUE course? We break down what the course demands, how to prepare, and why it changes the way you dive forever.',
		category: 'Training',
		author: 'Imad Farhat',
		date: 'February 5, 2026',
		image: '/images/community/fundamentals.jpg'
	},
	{
		id: 'red-sea-expedition',
		title: 'Red Sea Expedition: Wrecks, Reefs and Deep Walls',
		excerpt: 'A seven-day liveaboard in the Red Sea with a mixed GUE team. From the SS Thistlegorm to the Blue Hole — a trip that reminded us why we dive.',
		category: 'Trips',
		author: 'Imad Farhat',
		date: 'January 18, 2026',
		image: '/images/community/red-sea.jpg'
	},
	{
		id: 'gue-cyprus-community-2026',
		title: 'GUE Cyprus 2026: Growing the Community',
		excerpt: 'This year we welcomed 12 new members to the GUE Cyprus chapter. A look at where we are, where we're going, and upcoming community dives.',
		category: 'News',
		author: 'Imad Farhat',
		date: 'January 2, 2026',
		image: '/images/community/community.jpg'
	},
	{
		id: 'drysuit-selection-guide',
		title: 'Choosing Your First Drysuit: A Practical Guide',
		excerpt: 'Material, fit, valves, seals — drysuit selection is overwhelming. We simplify the decision with a practical breakdown for Mediterranean and cold-water diving.',
		category: 'Gear',
		author: 'Imad Farhat',
		date: 'December 14, 2025',
		image: '/images/community/drysuit.jpg'
	}
];
