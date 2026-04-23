<script lang="ts">
	import "./layout.css";
	import { ModeWatcher } from "mode-watcher";
	import favicon from "$lib/assets/favicon.svg";

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<ModeWatcher themeColors={{ dark: "#0b1120", light: "#f8fafc" }} />

{@render children()}
