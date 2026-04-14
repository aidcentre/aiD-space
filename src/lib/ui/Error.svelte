<script lang="ts">
    import { page } from '$app/stores';
    import Scramble from '$lib/actions/Scramble.svelte';
</script>

<div class="absolute top-1/2 left-1/2 -mt-8 flex py-3 px-4 -translate-x-1/2 -translate-y-1/2 flex-col gap-3 bg-white rounded-xl">
    <h1 class="font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-tight min-h-full w-full">{$page.status}</h1>
</div>

<div class="absolute bottom-4 left-4 right-4 max-w-250">
    <div class="font-bold text-off-black text-md md:text-lg lg:text-xl xl:text-2xl leading-tight">
        <Scramble 
            text="Sorry, the page you are looking for could not be found."
            speed="fast" 
        />
    </div>
</div>