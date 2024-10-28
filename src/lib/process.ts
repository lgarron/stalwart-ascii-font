import { readFile } from "node:fs/promises";
import type { ReadLine } from "node:readline";
import { createInterface } from "node:readline/promises";
import { stdin } from "bun";

const CHAR_EX = 4;

const FONT_DATA: Partial<
  Record<
    string,
    {
      regular: string[];
      mono?: string[];
    }
  >
> = JSON.parse(
  await readFile(
    new URL("../../dist/stalwart-ascii-font.json", import.meta.url),
    "utf-8",
  ),
);

export interface Options {
  mono?: boolean;
  autoUppercase?: boolean;
}

function processLine(
  line: string,
  handleOutputLine: (metaLine: string) => void,
  options?: Options,
) {
  const currentOutputLines = new Array(CHAR_EX).fill([]);
  for (let char of line) {
    if (options?.autoUppercase ?? true) {
      char = char.toUpperCase();
    }
    const record = FONT_DATA[char];
    if (!record) {
      throw new Error(`Character is not supported: \`${char}\``);
    }
    const charLines =
      options?.mono && record.mono ? record.mono : record.regular;
    for (let i = 0; i < CHAR_EX; i++) {
      currentOutputLines[i] += charLines[i];
    }
  }
  handleOutputLine(currentOutputLines.join("\n"));
}

export function processTextSync(
  source: string[],
  handleOutputLine: (metaLine: string) => void,
  options?: Options,
): void {
  for (const line of source) {
    processLine(line, handleOutputLine, options);
  }
}

export async function processTextAsync(
  source: string[] | ReadLine,
  handleOutputLine: (metaLine: string) => void,
  options?: Options,
): Promise<void> {
  for await (const line of source) {
    processLine(line, handleOutputLine, options);
  }
}

export async function printStalwartTextFromStdin(
  options?: Options,
): Promise<void> {
  // TODO: figure out why `node` buffers stdin. 😩
  const readline = createInterface({
    input: process.stdin,
  });

  await processTextAsync(readline, console.log, options);
}
