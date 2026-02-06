<script lang="ts">
	import aiDLogo from '/src/lib/assets/aiD_lockup_white_RGB.svg';
	let { lastCommit, author } = $props();
</script>

<div class="navbar items-start pt-4 shadow-sm" style:color=var(--light-grey)>
	<div class="navbar-start pl-3 text-xs">
		<span>v0.1</span>
	</div>
	<div class="navbar-center">
		<!-- TODO: consider using <object> instead for accessibility -->
		<img
			src={aiDLogo}
			alt="aiD logo and description, Norwegian Centre on AI for Decisions"
			width="200rem"
			height="200rem"
		/>
	</div>
	<div class="navbar-end pr-3 text-xs">
		<span>Last commit &nbsp; {lastCommit} ago &nbsp by &nbsp; {author}</span>
	</div>
</div>
