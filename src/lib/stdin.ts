import type { ReadLine } from "node:readline";
import { createInterface } from "node:readline/promises";
import { type Options, processTextAsync } from "./process";

export async function printStalwartTextFromStdin(
  options?: Options,
): Promise<void> {
  // TODO: figure out why `node` buffers stdin. 😩
  const readline: ReadLine = createInterface({
    input: process.stdin,
  });

  await processTextAsync(readline, console.log, options);
}
