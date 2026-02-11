/**
 * Brand configuration
 * Defines custom sizing and styling for brand logos
 */

export type BrandConfig = {
	name: string;
	height: number; // Height in pixels
	className: string; // CSS class name for this brand
};

/**
 * Brand logo configurations
 * Maps brand logo filenames to their display configurations
 */
export const brandConfigs: Record<string, BrandConfig> = {
	'suunto.svg': {
		name: 'Suunto',
		height: 84, // Double the default 42px
		className: 'suunto-logo'
	},
	'suex.svg': {
		name: 'SUEX',
		height: 28, // Smaller than default
		className: 'suex-logo'
	},
	'halcyon.svg': {
		name: 'Halcyon',
		height: 42, // Default size
		className: 'halcyon-logo'
	},
	'fourth-element.svg': {
		name: 'Fourth Element',
		height: 42, // Default size
		className: 'fourth-element-logo'
	},
	'ursuit.svg': {
		name: 'Ursuit',
		height: 42, // Default size
		className: 'ursuit-logo'
	},
	'scubaPro.svg': {
		name: 'ScubaPro',
		height: 42, // Default size
		className: 'scubapro-logo'
	}
};

/**
 * Default brand configuration for brands not in the config
 */
export const defaultBrandConfig: BrandConfig = {
	name: 'Brand',
	height: 42,
	className: ''
};

/**
 * Get brand configuration by filename
 */
export function getBrandConfig(brandFileName: string): BrandConfig {
	return brandConfigs[brandFileName] || defaultBrandConfig;
}

/**
 * Get CSS class name for a brand
 */
export function getBrandClassName(brandFileName: string): string {
	return brandConfigs[brandFileName]?.className || '';
}
