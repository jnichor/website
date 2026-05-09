/**
 * Removes products by ID from lib/products.ts in-place.
 *
 * Walks the file line-by-line: each top-level product object opens with `  {`
 * (2-space indent) and closes with `  },`. The ID inside is matched against
 * TO_DELETE; matching blocks are removed.
 *
 * Run: npx tsx scripts/delete-products.ts
 */
import { readFile, writeFile } from "node:fs/promises";

const TO_DELETE = new Set<string>([
  "p002",
  "p004",
  "p005",
  "p006",
  "p007",
  "p008",
  "p009",
  "p011",
  "p012",
  "p013",
  "p014",
  "p016",
  "p017",
  "p018",
  "p019",
  "p020",
  "p021",
  "p023",
  "p024",
  "p027",
  "p031",
  "p032",
  "p033",
  "p034",
  "p035",
  "p036",
  "p037",
  "p038",
  "p039",
]);

interface Block {
  start: number;
  end: number;
  id: string;
}

async function main() {
  const path = "lib/products.ts";
  const text = await readFile(path, "utf-8");
  const lines = text.split("\n");

  const blocks: Block[] = [];
  let blockStart = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^  \{\s*$/.test(line)) {
      blockStart = i;
    }
    const idMatch = line.match(/^\s+id:\s*"(p\d+)"/);
    if (idMatch && blockStart >= 0) {
      let endLine = -1;
      for (let j = i + 1; j < lines.length; j++) {
        if (/^  \},?\s*$/.test(lines[j])) {
          endLine = j;
          break;
        }
      }
      if (endLine === -1) {
        throw new Error(`Could not find end of block starting at line ${blockStart}`);
      }
      blocks.push({ start: blockStart, end: endLine, id: idMatch[1] });
      blockStart = -1;
    }
  }

  const toRemoveLines = new Set<number>();
  const removedIds: string[] = [];
  const keptIds: string[] = [];
  for (const block of blocks) {
    if (TO_DELETE.has(block.id)) {
      for (let i = block.start; i <= block.end; i++) toRemoveLines.add(i);
      removedIds.push(block.id);
    } else {
      keptIds.push(block.id);
    }
  }

  const newLines = lines.filter((_, i) => !toRemoveLines.has(i));
  const newText = newLines.join("\n").replace(/\n{3,}/g, "\n\n");
  await writeFile(path, newText);

  console.log(`Removed ${removedIds.length}: ${removedIds.join(", ")}`);
  console.log(`Kept    ${keptIds.length}: ${keptIds.join(", ")}`);

  const missing = [...TO_DELETE].filter((id) => !removedIds.includes(id));
  if (missing.length > 0) {
    console.warn(`\nWARNING: did not find these IDs to delete: ${missing.join(", ")}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
