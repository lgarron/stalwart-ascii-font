#!/usr/bin/env bun

import { printStalwartText } from "../src/lib";

import {
  binary,
  string as cmdString,
  command,
  flag,
  positional,
  run,
} from "cmd-ts";

import { exit } from "node:process";

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
