<script lang="ts">
    import Scramble from '$lib/actions/Scramble.svelte';
    import Link from '$lib/ui/Link.svelte';
    import type { ManagementMember } from '$lib/data/management';

    const { item }: { item: ManagementMember } = $props();
</script>

<div class="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3">
    <div class="flex flex-col gap-4">
        <figure class="aspect-square w-full h-auto rounded-xl overflow-hidden">
            {#if item.image}
                <img src={item.image} alt={item.name} class="w-full h-full object-cover object-top" />
            {:else}
                <div class="w-full h-full bg-off-black"></div>
            {/if}
        </figure>
        <div class="flex flex-col gap-1">
            <div class="font-family-mono text-off-black text-xs md:text-sm">{item.title} {item.role ? `// ${item.role}` : ''}</div>
            <Scramble 
                text={item.name} 
                class="font-bold text-off-black" 
            />
        </div>
        <Link 
            href={item.affiliationUrl} 
            theme="light"
            border={true}
            trailing={true}
        >
            {item.affiliation}
        </Link>
    </div>
</div>
