#!/usr/bin/env bun

import { printStalwartText } from "../src/lib";

import { binary, command, flag, run } from "cmd-ts";

const app = command({
  name: "stalwart",
  args: {
    mono: flag({
      long: "mono",
      description: "Monospace",
    }),
  },
  handler: async ({ mono }) => {
    printStalwartText(
      `ABCDEFGHIJ
KLMNOPQRST
UVWXYZ
0123456789`,
      { mono },
    );
  },
});

run(binary(app), process.argv);
