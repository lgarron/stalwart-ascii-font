import { exit } from "node:process";
import { file, write } from "bun";

const CHAR_WIDTH_CH = 6;

const REGULAR_SPEC_SUFFIX = " (regular)";

let characterData = await file("./src/characters.txt").text();
if (characterData.endsWith("\n")) {
  characterData = characterData.slice(0, -1);
}

function chunks(source: Iterator<string>, chunkSize: number): string[][] {
  let currentChunk: string[] = [];
  const output: string[][] = [currentChunk];
  while (true) {
    const { done, value } = source.next();
    if (done) {
      return output;
    }
    if (currentChunk.length >= chunkSize) {
      currentChunk = [];
      output.push(currentChunk);
    }
    currentChunk.push(value);
  }
}

function parseSpec(spec: string, char: string): { regular: boolean } {
  switch (spec) {
    case REGULAR_SPEC_SUFFIX: {
      return { regular: true };
    }
    case "": {
      return { regular: false };
    }
    default:
      throw new Error(`Invalid spec for char \`${char}\`: \`${spec}\``);
  }
}

// Entries are string arrays instead of strings because this makes the JSON file inspectable by eye.
type CharacterRecord = {
  mono: string[];
  regular?: string[];
};

let exitCode = 0;

const partialData: Partial<Record<string, Partial<CharacterRecord>>> = {};
for (const chunk of chunks(characterData.split("\n").values(), 5)) {
  const [charSpec, ...lines] = chunk;
  const [char, ...specChars] = charSpec;
  const spec = specChars.join("");
  const { regular } = parseSpec(spec, char);
  const field = regular ? "regular" : "mono";
  // TODO: validate lines are the same length, and match appropriate mono/non-mono widths.

  const firstLineWidth = lines[0].length;
  for (const line of lines.slice(1)) {
    if (line.length !== firstLineWidth) {
      console.error(
        `Not all lines are the same length for char: \`${charSpec}\``,
      );
      exitCode = 1;
      break;
    }
  }

  if (regular && firstLineWidth === CHAR_WIDTH_CH) {
    console.error(
      `Regular character \`${charSpec}\` matches monospace char width. This is probably an accident, and not currently supported.`,
    );
    exitCode = 1;
  }

  if (!regular && firstLineWidth !== CHAR_WIDTH_CH) {
    console.error(
      `Mono character \`${charSpec}\` has an invalid char width: ${firstLineWidth}`,
    );
    exitCode = 1;
  }

  // biome-ignore lint/suspicious/noAssignInExpressions: DRY pattern.
  (partialData[char] ??= {})[field] = lines;
}

if (exitCode !== 0) {
  exit(exitCode);
}

for (const [key, value] of Object.entries(partialData)) {
  if (!("mono" in value)) {
    throw new Error(`Character is missing \`regular\` field: \`${key}\``);
  }
}

const data = partialData as Partial<Record<string, CharacterRecord>>;

console.log(data);

await write(
  file("./dist/stalwart-ascii-font.json"),
  JSON.stringify(data, null, "  "),
);

await write(
  file("./dist/stalwart-ascii-font.ts"),
  `export const stalwartCharacterData: Partial<
  Record<
    string,
    {
      mono: string[];
      regular?: string[];
    }
  >
> = ${JSON.stringify(data, null, "  ")};`,
);
