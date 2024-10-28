import { type Options, processTextSync } from "./process";

export function generateStalwartText(text: string, options?: Options): string {
  const metaLines: string[] = [];
  processTextSync(
    text.split("\n"),
    (metaLine) => metaLines.push(metaLine),
    options,
  );
  return metaLines.join("\n");
}

export function printStalwartText(text: string, options?: Options): void {
  processTextSync(text.split("\n"), console.log, options);
}
