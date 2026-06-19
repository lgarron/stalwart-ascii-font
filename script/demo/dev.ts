import { barelyServe } from "barely-a-dev-server";

await barelyServe({
  entryRoot: "src/demo",
  esbuildOptions: {
    target: "es2022",
  },
});
