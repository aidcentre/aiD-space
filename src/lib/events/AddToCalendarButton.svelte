<script lang="ts">
	import { tick } from 'svelte';
	import CalendarPlus from 'phosphor-svelte/lib/CalendarPlus';
	import GoogleLogo from 'phosphor-svelte/lib/GoogleLogo';
	import MicrosoftOutlookLogo from 'phosphor-svelte/lib/MicrosoftOutlookLogo';
	import AppleLogo from 'phosphor-svelte/lib/AppleLogo';
	import type { AidEvent } from '$lib/sanity/types';
	import {
		downloadIcsFile,
		isMobileDevice,
		openGoogleCalendar,
		openOutlookCalendar
	} from '$lib/events/addToCalendar';

	type CalendarEvent = Pick<
		AidEvent,
		'title' | 'excerpt' | 'startDate' | 'endDate' | 'isOnline' | 'location' | 'registrationUrl'
	>;

	let { event }: { event: CalendarEvent } = $props();

	const EDGE_PADDING = 16;

	let open = $state(false);
	let container: HTMLDivElement | undefined = $state();
	let menu: HTMLDivElement | undefined = $state();
	let menuOffset = $state(0);

	function positionMenu() {
		if (!container || !menu) return;

		const containerRect = container.getBoundingClientRect();
		const menuWidth = menu.getBoundingClientRect().width;
		const centerLeft = containerRect.left + containerRect.width / 2 - menuWidth / 2;
		const centerRight = centerLeft + menuWidth;

		let offset = 0;
		if (centerLeft < EDGE_PADDING) {
			offset = EDGE_PADDING - centerLeft;
		} else if (centerRight > window.innerWidth - EDGE_PADDING) {
			offset = window.innerWidth - EDGE_PADDING - centerRight;
		}
		menuOffset = offset;
	}

	function toggle() {
		if (isMobileDevice()) {
			downloadIcsFile(event);
			return;
		}
		open = !open;
		if (open) tick().then(positionMenu);
	}

	function choose(action: (event: CalendarEvent) => void) {
		action(event);
		open = false;
	}

	function handleClickOutside(node: HTMLElement) {
		if (!open) return;
		if (container && !container.contains(node)) open = false;
	}
</script>

<svelte:window
	onclick={(e) => handleClickOutside(e.target as HTMLElement)}
	onkeydown={(e) => e.key === 'Escape' && (open = false)}
	onresize={() => open && positionMenu()}
/>

<div class="relative" bind:this={container}>
	<button
		type="button"
		onclick={(e) => {
			e.stopPropagation();
			toggle();
		}}
		class="group inline-flex items-center gap-2 rounded-xl border border-off-black/20 px-4 py-3 md:px-5 md:py-4 font-bold text-off-black hover:bg-off-black hover:text-white transition-colors duration-800 ease-out-expo"
	>
		Add to Calendar
		<CalendarPlus class="w-4.5 h-4.5 md:w-5 md:h-5" />
	</button>

	{#if open}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			bind:this={menu}
			class="absolute bottom-full left-1/2 mb-3 flex items-end gap-2 z-20"
			style="transform: translateX(calc(-50% + {menuOffset}px))"
			onclick={(e) => e.stopPropagation()}
		>
			<button
				type="button"
				role="menuitem"
				onclick={() => choose(openGoogleCalendar)}
				class="flex flex-col items-center gap-1.5 rounded-xl bg-white px-3 py-2.5 shadow-lg font-family-mono text-[10px] text-off-black whitespace-nowrap hover:bg-off-black hover:text-white transition-colors duration-300"
			>
				<GoogleLogo class="w-5 h-5" />
				Google Calendar
			</button>
			<button
				type="button"
				role="menuitem"
				onclick={() => choose(openOutlookCalendar)}
				class="flex flex-col items-center gap-1.5 rounded-xl bg-white px-3 py-2.5 shadow-lg font-family-mono text-[10px] text-off-black whitespace-nowrap hover:bg-off-black hover:text-white transition-colors duration-300"
			>
				<MicrosoftOutlookLogo class="w-5 h-5" />
				Outlook
			</button>
			<button
				type="button"
				role="menuitem"
				onclick={() => choose(downloadIcsFile)}
				class="flex flex-col items-center gap-1.5 rounded-xl bg-white px-3 py-2.5 shadow-lg font-family-mono text-[10px] text-off-black whitespace-nowrap hover:bg-off-black hover:text-white transition-colors duration-300"
			>
				<AppleLogo class="w-5 h-5" />
				Mac Calendar (.ics)
			</button>
		</div>
	{/if}
</div>
