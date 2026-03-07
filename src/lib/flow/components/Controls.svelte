<script lang="ts">
  import { Panel, useSvelteFlow } from "@xyflow/svelte";
  import { toggleMode } from "mode-watcher";
  import { Sun, Moon, Github, Scan } from "@lucide/svelte";

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
      class="blurred flex items-center justify-center p-2"
    >
      <Scan class="size-[20px]" />
    </button>

    <button
      onclick={toggleMode}
      class="blurred flex items-center justify-center p-2"
    >
      <Moon class="size-[20px] dark:hidden" />
      <Sun class="hidden size-[20px] dark:block" />
    </button>

    <a
      href="https://github.com/regexPattern"
      class="blurred flex items-center justify-center p-2"
    >
      <Github class="size-[20px]" />
    </a>
  </div>
</Panel>
