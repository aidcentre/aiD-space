<script lang="ts">
	import '../../routes/layout.css';
	import aiDLogo from '/src/lib/assets/aiD_lockup_white_RGB.svg';
	let { lastCommit, author } = $props();
</script>

<div class="header navbar text-gray-200 shadow-sm">
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
			xmlns="http://www.w3.org/2000/svg"
		/>
	</div>
	<div class="navbar-end pr-3 text-xs">
		<span>Last commit {lastCommit} ago by {author}</span>
	</div>
</div>

<style>
	.header {
		font-family: 'Milling';
	}
</style>
