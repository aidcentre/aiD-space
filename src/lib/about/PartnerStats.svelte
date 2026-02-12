<script lang="ts">
	import roundsquareFrame from '$lib/assets/roundsquare_frame.svg';

	let { orgType, orgAmount } = $props();
</script>

<div class="stat-box">
	<div class="amount-container">
		<img
			src={roundsquareFrame}
			alt="square dotted frame surrounding the number of ${orgType}"
			class="dotted-box"
		/>
		<span class="amount">{orgAmount}</span>
	</div>
	<span class="org-type">{orgType}</span>
</div>

<style>
	.stat-box {
		color: var(--off-black);
		display: flex;
		gap: 1.8rem;
		align-items: center;
	}
	.amount-container {
		position: relative;
		text-align: center;
		font-size: 1.4rem;
	}
	.amount {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	.dotted-box {
		height: 4rem;
		min-width: fit-content;
	}
	.org-type {
		font-size: 1.15rem;
		font-weight: 800;
		letter-spacing: 0.03rem;
	}
</style>
