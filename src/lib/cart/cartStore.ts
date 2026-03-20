import { writable, derived } from 'svelte/store';

export type CartItem = {
	type: 'course' | 'gear';
	id: string;
	name: string;
	image: string;
	price: number;
	quantity: number;
	meta?: Record<string, string>;
};

function createCartStore() {
	const stored = typeof window !== 'undefined' ? localStorage.getItem('of-cart') : null;
	const initial: CartItem[] = stored ? JSON.parse(stored) : [];

	const { subscribe, set, update } = writable<CartItem[]>(initial);

	// Persist to localStorage on every change
	subscribe((items) => {
		if (typeof window !== 'undefined') {
			localStorage.setItem('of-cart', JSON.stringify(items));
		}
	});

	return {
		subscribe,
		addItem: (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
			update((items) => {
				const existing = items.find((i) => i.id === item.id && i.type === item.type);
				if (existing) {
					return items.map((i) =>
						i.id === item.id && i.type === item.type
							? { ...i, quantity: i.quantity + quantity }
							: i
					);
				}
				return [...items, { ...item, quantity }];
			});
		},
		removeItem: (id: string, type: 'course' | 'gear') => {
			update((items) => items.filter((i) => !(i.id === id && i.type === type)));
		},
		updateQuantity: (id: string, type: 'course' | 'gear', quantity: number) => {
			if (quantity <= 0) {
				update((items) => items.filter((i) => !(i.id === id && i.type === type)));
			} else {
				update((items) =>
					items.map((i) =>
						i.id === id && i.type === type ? { ...i, quantity } : i
					)
				);
			}
		},
		clear: () => set([])
	};
}

export const cart = createCartStore();

export const cartCount = derived(cart, ($cart) =>
	$cart.reduce((sum, item) => sum + item.quantity, 0)
);

export const cartTotal = derived(cart, ($cart) =>
	$cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

export const isCartOpen = writable(false);
