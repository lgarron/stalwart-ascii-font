#!/usr/bin/env bun

import { printStalwartText } from "../lib";
import { printStalwartTextFromStdin } from "../lib/stdin";

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
    noAutoUppercase: flag({
      long: "no-auto-uppercase",
      description: "Don't automatically uppercase",
    }),
    stdin: flag({
      long: "stdin",
      description: "Read from stdin. Pass `-` as text to use this.",
    }),
    text: positional({ type: cmdString, displayName: "Text" }),
  },
  handler: async ({ mono, text, stdin, noAutoUppercase }) => {
    if (stdin) {
      if (text !== "-") {
        console.error("Text must be set to `-` when reading from stdin.");
        exit(1);
      }
      await printStalwartTextFromStdin();
      exit(0);
    }
    printStalwartText(text as string, {
      mono: mono,
      autoUppercase: !noAutoUppercase,
    });
  },
});

await run(binary(app), process.argv);
