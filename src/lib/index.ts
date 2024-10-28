import { readFile } from "node:fs/promises";
import { file } from "bun";

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

interface Options {
  mono?: boolean;
  autoUppercase?: boolean;
}

function processText(
  text: string,
  handleOutputLine: (metaLine: string) => void,
  options?: Options,
): void {
  for (const line of (text as string).split("\n")) {
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
}

export function generateStalwartText(text: string, options?: Options): string {
  const metaLines: string[] = [];
  processText(text, (metaLine) => metaLines.push(metaLine), options);
  return metaLines.join("\n");
}

export function printStalwartText(text: string, options?: Options): void {
  processText(text, console.log, options);
}
