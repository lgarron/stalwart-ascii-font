import { barelyServe } from "barely-a-dev-server";

await barelyServe({
  entryRoot: "src/demo",
  dev: false,
  outDir: "dist/web/garron.net/code/stalwart",
  esbuildOptions: {
    target: "es2022",
  },
});
