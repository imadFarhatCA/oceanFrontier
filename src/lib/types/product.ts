/**
 * Product type definition
 * Represents a single product (training course or gear item)
 */
export type Product = {
	id?: number;
	name: string;
	price?: string;
	image: string;
	description?: string;
	category?: 'basic' | 'technical';
};

/**
 * Category type
 * Represents the selected category: training, gear, or null (home view)
 */
export type Category = 'training' | 'gear' | null;

/**
 * Category data configuration
 * Contains all information needed to render a category card
 */
export type CategoryData = {
	id: Exclude<Category, null>;
	icon: string;
	title: string;
	description: string;
	ctaText: string;
};
