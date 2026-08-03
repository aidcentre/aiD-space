<script lang="ts">
	import type { AidEvent } from '$lib/sanity/types';
	import { formatEventDatesShort } from './eventUtils';

	let { events = [] }: { events?: AidEvent[] } = $props();

	const MONTH_LABELS = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];
	type DayCell = {
		day: number;
		events: AidEvent[];
	};

	type MonthGrid = {
		year: number;
		month: number;
		label: string;
		cells: (DayCell | null)[];
	};

	/** All calendar days (inclusive) an event spans, keyed by "YYYY-M-D". */
	function eventDayKeys(event: AidEvent): string[] {
		if (!event.startDate) return [];
		const start = new Date(event.startDate);
		const end = event.endDate ? new Date(event.endDate) : start;
		const keys: string[] = [];
		const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
		const last = new Date(end.getFullYear(), end.getMonth(), end.getDate());
		while (cursor <= last) {
			keys.push(`${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`);
			cursor.setDate(cursor.getDate() + 1);
		}
		return keys;
	}

	const eventsByDay = $derived.by(() => {
		const map = new Map<string, AidEvent[]>();
		for (const event of events) {
			for (const key of eventDayKeys(event)) {
				const existing = map.get(key);
				if (existing) existing.push(event);
				else map.set(key, [event]);
			}
		}
		return map;
	});

	const months = $derived.by(() => {
		const dated = events.filter((event) => event.startDate);
		if (!dated.length) return [] as MonthGrid[];

		let min = new Date(dated[0].startDate!);
		let max = new Date(dated[0].startDate!);
		for (const event of dated) {
			const start = new Date(event.startDate!);
			if (start < min) min = start;
			if (start > max) max = start;
			if (event.endDate) {
				const end = new Date(event.endDate);
				if (end > max) max = end;
			}
		}

		const grids: MonthGrid[] = [];
		const cursor = new Date(min.getFullYear(), min.getMonth(), 1);
		const last = new Date(max.getFullYear(), max.getMonth(), 1);

		while (cursor <= last) {
			const year = cursor.getFullYear();
			const month = cursor.getMonth();
			const daysInMonth = new Date(year, month + 1, 0).getDate();
			/** Monday-first offset for the 1st of the month. */
			const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;

			const cells: (DayCell | null)[] = Array(firstWeekday).fill(null);
			for (let day = 1; day <= daysInMonth; day++) {
				const key = `${year}-${month}-${day}`;
				cells.push({ day, events: eventsByDay.get(key) ?? [] });
			}

			grids.push({ year, month, label: MONTH_LABELS[month], cells });
			cursor.setMonth(cursor.getMonth() + 1);
		}

		return grids;
	});
</script>

{#if months.length}
	<div class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 xl:grid-cols-3">
		{#each months as grid (`${grid.year}-${grid.month}`)}
			<div class="flex w-full max-w-[22rem] flex-col rounded-xl bg-white p-3">
				<div class="font-family-mono text-[12px] font-bold text-off-black mb-1.5">
					{grid.label}{grid.year !== new Date().getFullYear() ? ` '${String(grid.year).slice(2)}` : ''}
				</div>
				<div class="grid grid-cols-7 gap-x-0.5 gap-y-3">
					{#each grid.cells as cell, i (i)}
						{@const prevCell = i > 0 ? grid.cells[i - 1] : null}
						{@const connectsToPrev =
							cell?.events.length &&
							prevCell?.events.length &&
							i % 7 !== 0 &&
							cell.events[0]._id === prevCell.events[0]._id}
						{#if cell === null}
							<div class="w-[0.87890625rem] h-[0.87890625rem]"></div>
						{:else if cell.events.length}
							<!-- Only a day with exactly one event links anywhere; a shared day would have to
							     pick one event arbitrarily, so it stays non-interactive and just shows the tooltip. -->
							{@const linkable = cell.events.length === 1 && Boolean(cell.events[0].slug)}
							<svelte:element
								this={linkable ? 'a' : 'div'}
								href={linkable ? `/events/${cell.events[0].slug}` : undefined}
								class="group/day relative flex items-center justify-center"
							>
								{#if connectsToPrev}
									<div
										class="pointer-events-none absolute top-1/2 right-1/2 h-px w-[calc(100%+0.125rem)] -translate-y-1/2 bg-off-black"
									></div>
								{/if}
								<div class="relative w-[0.87890625rem] h-[0.87890625rem] rounded-full bg-off-black transition-transform duration-300 group-hover/day:scale-125"></div>
								<div
									class={[
										'pointer-events-none absolute bottom-full z-10 mb-2 w-max max-w-50 rounded-lg bg-off-black px-3 py-2 text-center opacity-0 transition-opacity duration-300 group-hover/day:opacity-100',
										i % 7 <= 1
											? 'left-0'
											: i % 7 >= 5
												? 'right-0'
												: 'left-1/2 -translate-x-1/2'
									]}
								>
									<div class="font-family-mono text-[8.64px] font-bold text-white">
										{formatEventDatesShort(cell.events[0])}
									</div>
									<div class="text-[12px] font-bold text-white">
										{#each cell.events as event, eventIndex (event._id)}
											{#if eventIndex > 0}<span class="font-normal">{' + '}</span>{/if}{event.title}
										{/each}
									</div>
									{#if linkable}
										<div class="font-family-mono text-[10.8px] text-white/60">Click to see more info</div>
									{/if}
								</div>
							</svelte:element>
						{:else}
							<div class="flex items-center justify-center">
								<div class="w-[0.87890625rem] h-[0.87890625rem] rounded-sm bg-light-grey"></div>
							</div>
						{/if}
					{/each}
				</div>
			</div>
		{/each}
	</div>
{/if}
