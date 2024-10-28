#!/usr/bin/env bun

import { file } from "bun";
import { default as yargs } from "yargs";
import { hideBin } from "yargs/helpers";
import { printStalwartText } from "../lib";

const args = await yargs(
  // TODO: `hideBin` just shows `bun` in `bun`.
  hideBin(process.argv),
)
  .option("mono", {
    describe: "Monospace.",
    default: false,
    type: "boolean",
    alias: "m",
  })
  .option("no-auto-uppercase", {
    describe: "Don't automatically uppercase.",
    default: false,
    type: "boolean",
    alias: "n",
  })
  .usage("$0 text", "Text.", (yargs) =>
    yargs.positional("text", {
      describe: "Text",
      type: "string",
    }),
  )
  .version(false) // TODO: why doesn't `yargs` get the right version in `bun` or for the `dist` bin?
  .strictOptions().argv;

printStalwartText(args.text as string, {
  mono: args.mono,
  autoUppercase: !args["no-auto-uppercase"],
});
