import { defineEnvVars } from "@sveltejs/kit/env";

export const variables = defineEnvVars({
  GRAPH_STATE_STORAGE_KEY: { public: true },
});
