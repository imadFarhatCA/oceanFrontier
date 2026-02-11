/**
 * Gear product type definition
 * Represents a single gear product with category
 */
export type GearProduct = {
	name: string;
	image: string;
	category: 'basic' | 'technical';
};

/**
 * Gear item type definition
 * Represents a single gear category with products and metadata
 */
export type GearItem = {
	id: string;
	title: string;
	subtitle: string;
	description: string;
	icon: string;
	position: { x: number; y: number };
	labelPosition: 'left' | 'right';
	products: GearProduct[];
	brands: string[];
};

/**
 * Complete gear items data
 * All dive gear categories with their products, brands, and display configuration
 */
export const gearItems: GearItem[] = [
	{
		id: 'hood',
		title: 'HOOD',
		subtitle: 'THERMAL PROTECTION',
		description: 'A neoprene hood to protect the head from cold water exposure and maintain core body temperature during dives',
		icon: '/images/gear-icons/hood.svg',
		position: { x: 62, y: 3 },
		labelPosition: 'right',
		products: [
			{ name: 'YRVA Hood', image: '/images/gear-products/YRVA hoods.jpg', category: 'technical' }
		],
		brands: []
	},
	{
		id: 'mask',
		title: 'MASK',
		subtitle: 'LOW VOLUME',
		description: 'Any low volume mask with a single or dual lense profile permitting for minimal use of gas to clear it out',
		icon: '/images/gear-icons/mask.svg',
		position: { x: 35, y: 8 },
		labelPosition: 'left',
		products: [
			{ name: 'Halcyon Omnis Mask', image: '/images/gear-products/Halcyon Omnis Mask.jpg', category: 'technical' },
			{ name: 'Fourth Element Seeker Mask', image: '/images/gear-products/fourthElement Seeker Mask.jpg', category: 'basic' }
		],
		brands: ['halcyon.svg', 'fourth-element.svg']
	},
	{
		id: 'regulators',
		title: 'REGULATORS',
		subtitle: 'Backup & Primary',
		description: 'A secondary regulator on a bungee necklace to be reachable and used as backup. Primary connected via 1.5-2m hose.',
		icon: '/images/gear-icons/regulator.svg',
		position: { x: 68, y: 16 },
		labelPosition: 'right',
		products: [
			{ name: 'Halcyon H-50 Regulator', image: '/images/gear-products/Halcyon H50 Regulators 001.jpg', category: 'basic' },
			{ name: 'Halcyon H-75 Regulator', image: '/images/gear-products/Halcyon H75 Regulators.jpg', category: 'basic' },
			{ name: 'Halcyon Single Tank Regulator', image: '/images/gear-products/Halcyon Regulators singleTank.jpg', category: 'basic' },
			{ name: 'Halcyon Deco Regulator', image: '/images/gear-products/Halcyon decoReg.jpg', category: 'technical' }
		],
		brands: ['halcyon.svg']
	},
	{
		id: 'undergarments',
		title: 'UNDERGARMENTS',
		subtitle: 'Thermal Insulation',
		description: 'Thermal undergarments worn beneath drysuits to provide insulation and maintain body temperature during cold water dives',
		icon: '/images/gear-icons/undergarments gearIcon.svg',
		position: { x: 32, y: 16 },
		labelPosition: 'left',
		products: [
			{ name: 'Fourth Element Xerotherm', image: '/images/gear-products/Xerotherm fourthElement.jpg', category: 'basic' },
			{ name: 'Fourth Element Arctic', image: '/images/gear-products/Arctic fourthElement.jpg', category: 'basic' },
			{ name: 'Fourth Element J2', image: '/images/gear-products/J2 fourthElement.jpg', category: 'technical' }
		],
		brands: ['fourth-element.svg']
	},
	{
		id: 'suit',
		title: 'EXPOSURE SUIT',
		subtitle: 'Wet / Dry',
		description: 'Exposure Suits chosen for specific environmental parameters, whether you go for a drysuit or a wetsuit, the below products are rugged and recommended to handle the work we have put them through.<br><br>Get in touch with us for more details and information about the specifications that make these suits a selected choice in our opinion, and what are the leverage points of strength that made us adopt these products.',
		icon: '/images/gear-icons/drysuit.svg',
		position: { x: 71, y: 26 },
		labelPosition: 'right',
		products: [
			{ name: 'Ursuit Cordura Grey', image: '/images/gear-products/ursuit-cordura-grey.jpg', category: 'technical' },
			{ name: 'Fourth Element Argonaut 3.0', image: '/images/gear-products/fourth-element-argonaut.jpg', category: 'technical' },
			{ name: 'Fourth Element Proteus II', image: '/images/gear-products/fourth-element-proteus.jpg', category: 'basic' }
		],
		brands: ['ursuit.svg', 'fourth-element.svg']
	},
	{
		id: 'wing',
		title: 'WING<span class="desktop-only"> / </span><br class="mobile-br">BACKPLATE',
		subtitle: 'Buoyancy Compensator',
		description: 'Doughnut shaped wings are used for different configurations and lift capacities',
		icon: '/images/gear-icons/wing.svg',
		position: { x: 29, y: 31 },
		labelPosition: 'left',
		products: [
			{ name: 'Halcyon Single Tank Wings', image: '/images/gear-products/Halcyon singleWings.jpg', category: 'basic' },
			{ name: 'Halcyon Doubles Wing', image: '/images/gear-products/Halcyon DoublesWing.jpg', category: 'technical' },
			{ name: 'Halcyon CCR Wing', image: '/images/gear-products/Halcyon CCRWing.jpg', category: 'technical' }
		],
		brands: ['halcyon.svg']
	},
	{
		id: 'gauge',
		title: 'GAUGE',
		subtitle: 'Submersible Pressure Gauge',
		description: 'Submersible pressure gauges big in size, clear and can come in Imperial or Metric formats',
		icon: '/images/gear-icons/gauge.svg',
		position: { x: 63, y: 44 },
		labelPosition: 'right',
		products: [
			{ name: 'Halcyon Master SPG', image: '/images/gear-products/Halcyon SPG big.jpg', category: 'technical' }
		],
		brands: ['halcyon.svg', 'suunto.svg']
	},
	{
		id: 'lights',
		title: 'LIGHTS',
		subtitle: 'Primary & Backup',
		description: 'Dive lights for visibility, communication, and safety. Includes primary canister lights and backup lights for redundancy',
		icon: '/images/gear-icons/lights gearIcon.svg',
		position: { x: 37, y: 44 },
		labelPosition: 'left',
		products: [
			{ name: 'Halcyon Photon Backup Light', image: '/images/gear-products/Halcyon Photon backupLight.jpg', category: 'basic' },
			{ name: 'Halcyon Focus Light', image: '/images/gear-products/Halcyon Focus Light.jpg', category: 'technical' },
			{ name: 'Halcyon Expedition Light', image: '/images/gear-products/Halcyon Expedition Light.jpg', category: 'technical' }
		],
		brands: ['halcyon.svg']
	},
	{
		id: 'computer',
		title: 'DIVE<br class="mobile-br"> COMPUTER',
		subtitle: 'GAUGE or DIVE COMPUTER',
		description: 'Whether a depth gauge or dive computer, it is an essential tool to give the diver the ability to read the parameters of the dive',
		icon: '/images/gear-icons/dive-computer.svg',
		position: { x: 24, y: 48 },
		labelPosition: 'left',
		products: [
			{ name: 'Halcyon Dive Computer HUD', image: '/images/gear-products/halcyon diveComputer HUD.jpg', category: 'technical' },
			{ name: 'Halcyon Dive Computer Handset', image: '/images/gear-products/halcyon diveComputer Handset.jpg', category: 'technical' },
			{ name: 'Halcyon Dive Computer POD', image: '/images/gear-products/halcyon diveComputer POD.jpg', category: 'technical' }
		],
		brands: ['halcyon.svg']
	},
	{
		id: 'compass',
		title: 'COMPASS',
		subtitle: 'MAGNETIC OR DIGITAL',
		description: 'Any type of magnetic or digital compass, used for underwater navigation & bearing allocation. Some dive computers have a digital compass embedded.',
		icon: '/images/gear-icons/compass.svg',
		position: { x: 75, y: 48 },
		labelPosition: 'right',
		products: [
			{ name: 'Suunto SK-8', image: '/images/gear-products/Suunto Compass.jpg', category: 'basic' },
			{ name: 'DGX Compass', image: '/images/gear-products/DGX Compass.jpg', category: 'basic' }
		],
		brands: ['suunto.svg']
	},
	{
		id: 'pockets',
		title: 'POCKETS<br>ACCESSORIES',
		subtitle: 'Storage & Tools',
		description: 'Pockets and accessories for carrying essential tools, slates, reels, and other dive accessories',
		icon: '/images/gear-icons/accessories.svg',
		position: { x: 69, y: 63 },
		labelPosition: 'right',
		products: [
			{ name: 'Halcyon SMB', image: '/images/gear-products/Halcyon SMB.jpg', category: 'basic' },
			{ name: 'Halcyon Spools', image: '/images/gear-products/Halcyon Spools.jpg', category: 'basic' },
			{ name: 'Halcyon Wet Notes', image: '/images/gear-products/Halcyon wetNotes.jpg', category: 'basic' }
		],
		brands: ['halcyon.svg']
	},
	{
		id: 'diving-accessories',
		title: 'DIVING<br>ACCESSORIES',
		subtitle: 'DPV & Tools',
		description: 'Diver Propulsion Vehicles (DPV/Scooters) and essential diving accessories including cutting tools, reels, SMBs, slates, and safety equipment',
		icon: '/images/gear-icons/DPV gearIcon.svg',
		position: { x: 31, y: 63 },
		labelPosition: 'left',
		products: [
			{ name: 'Halcyon Pathfinder Reel', image: '/images/gear-products/Halcyon PathfinderReel.jpg', category: 'technical' },
			{ name: 'Gramper GPS', image: '/images/gear-products/gramperGPS.jpg', category: 'technical' },
			{ name: 'SUEX DPV', image: '/images/gear-products/SUEX DPV.jpg', category: 'technical' }
		],
		brands: ['halcyon.svg', 'suex.svg']
	},
	{
		id: 'fins',
		title: 'FINS',
		subtitle: 'RIGID RUBBER',
		description: 'Rigid rubber compound fins facilitating finning technics, while minimizing effort. Heel springs for ease of use, wide stiff blade for better backward frog kick control',
		icon: '/images/gear-icons/fins.svg',
		position: { x: 32, y: 92 },
		labelPosition: 'left',
		products: [
			{ name: 'Halcyon Vector Fins', image: '/images/gear-products/Halcyon vectorFins.jpg', category: 'technical' },
			{ name: 'ScubaPro Jet Fins', image: '/images/gear-products/scubaPro JetFins.jpg', category: 'basic' }
		],
		brands: ['halcyon.svg', 'scubaPro.svg']
	}
];
