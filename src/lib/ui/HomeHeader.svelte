<script lang="ts">
	import SmallButton from './SmallButton.svelte';
	import aiDLogo from '/src/lib/assets/aiD_lockup_black_RGB.svg';
</script>

<div class="navbar items-start pt-4" style:color="var(--light-grey)">
	<div class="navbar-start pl-3 text-xs">
		<!-- TODO: consider using <object> instead for accessibility -->

		<img
			src={aiDLogo}
			alt="aiD logo and description, Norwegian Centre on AI for Decisions"
			width="200rem"
			height="200rem"
		/>
	</div>
	<div class="pointer-events-auto mr-2 navbar-end gap-2 text-xs">
		<SmallButton label="What is aiD?" link="about" colourMode="light" />
		<SmallButton label="Contact" link="contact" colourMode="light" />
	</div>
</div>
