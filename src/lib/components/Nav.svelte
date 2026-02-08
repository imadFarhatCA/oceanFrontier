<script lang="ts">
	export let variant: 'light' | 'dark' | 'mobile' = 'light';
	export let centered: boolean = false;
	export let activeLink: string | null = null;
	export let onNavClick: (e: Event, target: string) => void;
	export let onMobileClose: (() => void) | null = null;

	// Dark variant (right section) uses different link order
	const navLinks = variant === 'dark'
		? [
			{ href: '/', target: 'home', label: 'HOMEPAGE' },
			{ href: '/gear', target: 'gear', label: 'GEAR' },
			{ href: '/training', target: 'training', label: 'TRAINING' },
			{ href: '/community', target: 'community', label: 'COMMUNITY', external: true }
		]
		: [
			{ href: '/', target: 'home', label: 'HOMEPAGE' },
			{ href: '/training', target: 'training', label: 'TRAINING' },
			{ href: '/gear', target: 'gear', label: 'GEAR' },
			{ href: '/community', target: 'community', label: 'COMMUNITY', external: true }
		];

	function handleClick(e: Event, target: string, isExternal: boolean | undefined = false) {
		// Community link is external - let it navigate normally
		if (isExternal) {
			// For mobile, still close the menu
			if (onMobileClose && variant === 'mobile') {
				onMobileClose();
			}
		} else {
			// Internal link - let handleNavClick handle preventDefault
			onNavClick(e, target);
			// Close mobile menu after navigation
			if (onMobileClose && variant === 'mobile') {
				onMobileClose();
			}
		}
	}
</script>

<nav class="nav" class:centered class:mobile-nav={variant === 'mobile'}>
	{#each navLinks as link}
		<a
			href={link.href}
			class:nav-active={activeLink === link.target}
			on:click={(e) => handleClick(e, link.target, link.external)}
		>
			{link.label}
		</a>
	{/each}
</nav>
