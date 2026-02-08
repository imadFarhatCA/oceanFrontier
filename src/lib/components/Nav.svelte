<script lang="ts">
	export let variant: 'light' | 'dark' | 'mobile' = 'light';
	export let centered: boolean = false;
	export let activeLink: string | null = null;
	export let onNavClick: (e: Event, target: string) => void;
	export let onMobileClose: (() => void) | null = null;

	const navLinks = [
		{ href: '/', target: 'home', label: 'HOMEPAGE' },
		{ href: '/training', target: 'training', label: 'TRAINING' },
		{ href: '/gear', target: 'gear', label: 'GEAR' },
		{ href: '/community', target: 'community', label: 'COMMUNITY' }
	];

	function handleClick(e: Event, target: string) {
		onNavClick(e, target);
		if (onMobileClose && variant === 'mobile') {
			onMobileClose();
		}
	}
</script>

<nav class="nav" class:centered class:mobile-nav={variant === 'mobile'}>
	{#each navLinks as link}
		<a
			href={link.href}
			class:nav-active={activeLink === link.target}
			on:click|preventDefault|stopPropagation={(e) => handleClick(e, link.target)}
		>
			{link.label}
		</a>
	{/each}
</nav>
