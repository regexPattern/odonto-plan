<script lang="ts">
  import { Github, Moon, Scan, Sun } from "@lucide/svelte";
  import { Panel, useSvelteFlow } from "@xyflow/svelte";
  import { toggleMode } from "mode-watcher";

  interface Props {
    initialViewport: {
      x: number;
      y: number;
      zoom: number;
    };
  }

  let { initialViewport }: Props = $props();
  const { setViewport } = useSvelteFlow();

  const resetViewport = () => {
    void setViewport(initialViewport, { duration: 300 });
  };
</script>

<Panel position="top-center">
  <div class="flex gap-4">
    <button
      onclick={resetViewport}
      title="Reestablecer vista"
      aria-label="Reestablecer vista"
      class="blurred flex items-center justify-center p-2"
    >
      <Scan class="size-[20px]" />
    </button>

    <button
      onclick={toggleMode}
      title="Cambiar tema"
      aria-label="Cambiar tema"
      class="blurred flex items-center justify-center p-2"
    >
      <Moon class="size-[20px] dark:hidden" />
      <Sun class="hidden size-[20px] dark:block" />
    </button>

    <a
      href="https://github.com/regexPattern/odonto-plan"
      title="Ir al repositorio"
      aria-label="Ir al repositorio"
      class="blurred flex items-center justify-center p-2"
    >
      <Github class="size-[20px]" />
    </a>
  </div>
</Panel>
