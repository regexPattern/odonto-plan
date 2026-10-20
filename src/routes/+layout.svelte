<script lang="ts">
  import "./layout.css";
  import { ModeWatcher, userPrefersMode } from "mode-watcher";
  import { onMount } from "svelte";
  import { iniciarAnalytics, registrarPreferencias, track } from "#lib/analytics.js";
  import favicon from "#lib/assets/favicon.svg";
  import paleta from "#lib/palette/state.svelte.js";

  let { children } = $props();

  onMount(() => {
    iniciarAnalytics();
    registrarPreferencias({ paleta: paleta.actual, modo: userPrefersMode.current });
    track({ nombre: "$pageview" });
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher defaultMode="light" />

{@render children()}
