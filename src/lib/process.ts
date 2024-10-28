import { stalwartCharacterData } from "../../dist/stalwart-ascii-font";

const CHAR_HEIGHT_EX = 4;

export interface Options {
  mono?: boolean;
  autoUppercase?: boolean;
}

function processLine(
  line: string,
  handleOutputLine: (metaLine: string) => void,
  options?: Options,
) {
  const currentOutputLines = new Array(CHAR_HEIGHT_EX).fill([]);
  for (let char of line) {
    if (options?.autoUppercase ?? true) {
      char = char.toUpperCase();
    }
    const record = stalwartCharacterData[char];
    if (!record) {
      throw new Error(`Character is not supported: \`${char}\``);
    }
    const charLines = (!options?.mono && record.regular) || record.mono;
    for (let i = 0; i < CHAR_HEIGHT_EX; i++) {
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
  source: string[] | { [Symbol.iterator](): Iterator<string> },
  handleOutputLine: (metaLine: string) => void,
  options?: Options,
): Promise<void> {
  for await (const line of source) {
    processLine(line, handleOutputLine, options);
  }
}
