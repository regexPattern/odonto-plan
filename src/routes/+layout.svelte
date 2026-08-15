<script lang="ts">
  import "./layout.css";
  import favicon from "#lib/assets/favicon.svg";
  import { ModeWatcher } from "mode-watcher";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />

<div class="h-16 border-b border-zinc-800 bg-[#141414] flex items-center">
  <div class="p-4">Odonto Plan</div>
</div>

{@render children()}
