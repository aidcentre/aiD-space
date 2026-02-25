<script lang="ts">
	import SmallButton from './SmallButton.svelte';
	import aidLogoWithText from '/src/lib/assets/aiD_lockup_black_RGB.svg';
	import aidLogo from '/src/lib/assets/aiD_logotype_black_RGB.svg';
</script>

<div class=" relative flex min-h-16 w-full items-center justify-between p-2 pt-4">
	<div class="inline-flex w-fit items-center justify-start pl-3 text-xs">
		<!-- TODO: consider using <object> instead for accessibility -->
		<img
			src={aidLogo}
			alt="aiD logo and description, Norwegian Centre on AI for Decisions"
			class="max-h-[32px] sm:hidden"
		/>
		<img
			src={aidLogoWithText}
			alt="aiD logo and description, Norwegian Centre on AI for Decisions"
			class="max-h-[30px] max-sm:hidden"
		/>
	</div>
	<div class="pointer-events-auto mr-2 inline-flex w-fit items-center justify-end gap-2 text-xs">
		<SmallButton label="What is aiD?" link="about" colourMode="light" />
		<SmallButton label="Contact" link="contact" colourMode="light" />
	</div>
</div>
