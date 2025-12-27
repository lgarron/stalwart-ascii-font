#!/usr/bin/env -S bun run --

import { argv } from "node:process";
import { message, object, option } from "@optique/core";
import { run } from "@optique/run";
import { Path } from "path-class";
import { version as VERSION } from "../package.json";
import { printStalwartText } from "../src/lib";

function parseArgs() {
  return run(
    object({
      mono: option("--mono"),
    }),
    {
      programName: new Path(argv[1]).basename.path,
      description: message`Print a font sample!`,
      help: "option",
      completion: {
        mode: "option",
        name: "plural",
      },
      version: {
        mode: "option",
        value: VERSION,
      },
    },
  );
}

async function printSample({
  mono,
}: ReturnType<typeof parseArgs>): Promise<void> {
  printStalwartText(
    `ABCDEFGHIJ
KLMNOPQRST
UVWXYZ
0123456789`,
    { mono },
  );
}

if (import.meta.main) {
  await printSample(parseArgs());
}
