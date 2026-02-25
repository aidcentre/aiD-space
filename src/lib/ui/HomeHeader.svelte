<script lang="ts">
	import SmallButton from './SmallButton.svelte';
	import aidLogoWithText from '/src/lib/assets/aiD_lockup_black_RGB.svg';
	import aidLogo from '/src/lib/assets/aiD_logotype_black_RGB.svg';
</script>

<div class="navbar items-start pt-4" style:color="var(--light-grey)">
	<div class="navbar-start pl-3 text-xs">
		<!-- TODO: consider using <object> instead for accessibility -->
		<img
			src={aidLogoWithText}
			alt="aiD logo and description, Norwegian Centre on AI for Decisions"
			class="max-h-[30px]"
		/>
	</div>
	<div class="pointer-events-auto mr-2 navbar-end gap-2 text-xs">
		<SmallButton label="What is aiD?" link="about" colourMode="light" />
		<SmallButton label="Contact" link="contact" colourMode="light" />
	</div>
</div>
