#!/usr/bin/env -S bun run --

import { basename } from "node:path";
import { argv } from "node:process";
import {
  argument,
  constant,
  flag,
  merge,
  message,
  object,
  option,
  or,
  string,
} from "@optique/core";
import { run } from "@optique/run";
import { version as VERSION } from "../../package.json";
import { printStalwartText } from "../lib";
import { printStalwartTextFromStdin } from "../lib/stdin";

function parseArgs() {
  return run(
    merge(
      object({
        mono: option("--mono"),
        noAutoUppercase: option("--no-auto-uppercase", {
          description: message`Don't automatically uppercase (error on lowercase letters).`,
        }),
      }),
      or(
        object({ textSource: constant("stdin"), stdin: flag("--stdin") }),
        object({
          textSource: constant("positional"),
          text: argument(string()),
        }),
      ),
    ),
    {
      programName: basename(argv[1]),
      description: message`The commandline tool of the future!`,
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

async function print(args: ReturnType<typeof parseArgs>): Promise<void> {
  const { mono, noAutoUppercase, textSource } = args;
  switch (textSource) {
    case "stdin": {
      await printStalwartTextFromStdin();
      break;
    }
    case "positional": {
      printStalwartText(args.text, {
        mono: mono,
        autoUppercase: !noAutoUppercase,
      });
      break;
    }
    default:
      throw new Error("Internal error: Invalid text source.") as never;
  }
}

if (import.meta.main) {
  await print(parseArgs());
}
