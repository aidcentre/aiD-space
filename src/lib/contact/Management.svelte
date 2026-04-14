<script lang="ts">
    import SectionLabel from '$lib/about/SectionLabel.svelte';
    import { management_data } from '$lib/data/management';
    import ManagementCard from './ManagementCard.svelte';
</script>

<section>
    <div class="grid grid-cols-12 gap-x-4 gap-y-8 md:gap-y-12 max-w-[1920px] px-4 mx-auto my-30 md:my-40 lg:my-60">
        <div class="col-span-12">
            <SectionLabel label="Management" />
        </div>
        {#each management_data as item (item.name)}
            <ManagementCard {item} />
        {/each}
    </div>
</section>