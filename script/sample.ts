import { default as yargs } from "yargs";
import { hideBin } from "yargs/helpers";
import { printStalwartText } from "../src/lib";

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
  .version(false) // TODO: why doesn't `yargs` get the right version in `bun` or for the `dist` bin?
  .strictOptions().argv;

const { mono } = args;
printStalwartText(
  `ABCDEFGHIJ
KLMNOPQRST
UVWXYZ
0123456789`,
  { mono },
);
