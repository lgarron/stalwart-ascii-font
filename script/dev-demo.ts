import { barelyServe } from "barely-a-dev-server";

barelyServe({
  entryRoot: "src/demo",
  esbuildOptions: {
    external: ["node:*"],
    target: "es2022",
  },
});
