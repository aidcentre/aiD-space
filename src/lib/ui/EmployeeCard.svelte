<script lang="ts">
    import type { Employee } from '$lib/sanity/types';
    import Scramble from '$lib/actions/Scramble.svelte';
    import Link from '$lib/ui/Link.svelte';

    const { employee }: { employee: Employee } = $props();
</script>

<div class="flex flex-col gap-4">
    <figure class="aspect-square w-full h-auto rounded-lg lg:rounded-xl xl:rounded-2xl overflow-hidden">
        {#if employee.image?.asset}
            <img
                src={employee.image?.asset.url}
                alt={employee.name ?? ''}
                class="w-full h-full object-cover object-top grayscale"
                loading="lazy"
            />
        {:else}
            <div class="w-full h-full bg-off-black"></div>
        {/if}
    </figure>
    <div class="flex flex-col gap-1">
        {#if employee.role}
            <div class="font-family-mono text-off-black text-xs md:text-sm">
                {employee.role}
            </div>
        {/if}
        <Scramble text={employee.name ?? ''} speed="slow" class="text-sm md:text-base font-bold text-off-black" />
    </div>
    {#if employee.affiliationGroup?.url}
        <Link
            href={employee.affiliationGroup.url}
            theme="light"
            border={true}
            trailing={true}
            target="_blank"
        >
            {employee.affiliationGroup.label ?? employee.affiliationGroup.url}
        </Link>
    {/if}
</div>