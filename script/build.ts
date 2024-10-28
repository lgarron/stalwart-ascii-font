import { file, write } from "bun";

const MONO_SPEC_SUFFIX = " (mono)";

const characters = await file("./src/characters.txt").text();

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

function parseSpec(spec: string, char: string): { mono: boolean } {
  switch (spec) {
    case MONO_SPEC_SUFFIX: {
      return { mono: true };
    }
    case "": {
      return { mono: false };
    }
    default:
      throw new Error(`Invalid spec for char \`${char}\`: \`${spec}\``);
  }
}

// Entries are string arrays instead of strings because this makes the JSON file inspectable by eye.
type CharacterRecord = {
  regular: string[];
  mono?: string[];
};

const partialData: Partial<Record<string, Partial<CharacterRecord>>> = {};
for (const chunk of chunks(characters.trim().split("\n").values(), 5)) {
  const [[char, ...specChars], ...lines] = chunk;
  const { mono } = parseSpec(specChars.join(""), char);
  const field = mono ? "mono" : "regular";
  // TODO: validate lines are the same length, and match appropriate mono/non-mono widths.

  // biome-ignore lint/suspicious/noAssignInExpressions: DRY pattern.
  (partialData[char] ??= {})[field] = lines;
}

for (const [key, value] of Object.entries(partialData)) {
  if (!("regular" in value)) {
    throw new Error(`Character is missing \`regular\` field: \`${key}\``);
  }
}

const data = partialData as Partial<Record<string, CharacterRecord>>;

console.log(data);

await write(
  file("./dist/stalwart-ascii-font.json"),
  JSON.stringify(data, null, "  "),
);
