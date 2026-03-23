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
			{ href: '/schedule', target: 'schedule', label: 'SCHEDULE' },
			{ href: '/community', target: 'community', label: 'COMMUNITY' }
		]
		: [
			{ href: '/', target: 'home', label: 'HOMEPAGE' },
			{ href: '/training', target: 'training', label: 'TRAINING' },
			{ href: '/schedule', target: 'schedule', label: 'SCHEDULE' },
			{ href: '/gear', target: 'gear', label: 'GEAR' },
			{ href: '/community', target: 'community', label: 'COMMUNITY' }
		];

	function handleClick(e: Event, target: string) {
		onNavClick(e, target);
	}
</script>

<nav class="nav" class:centered class:mobile-nav={variant === 'mobile'}>
	{#each navLinks as link}
		<a
			href={link.href}
			class:nav-active={activeLink === link.target}
			on:click={(e) => handleClick(e, link.target)}
		>
			{link.label}
		</a>
	{/each}
</nav>
