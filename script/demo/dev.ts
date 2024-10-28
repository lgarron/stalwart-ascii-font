import { barelyServe } from "barely-a-dev-server";

barelyServe({
  entryRoot: "src/demo",
  esbuildOptions: {
    target: "es2022",
  },
});
