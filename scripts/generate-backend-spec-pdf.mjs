import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const inputPath = resolve("docs/backend/backend-spec.md");
const outputPath = resolve("docs/backend/backend-spec.pdf");

const page = {
  width: 612,
  height: 792,
  marginX: 46,
  marginTop: 46,
  marginBottom: 46,
};

const styles = {
  h1: { size: 18, lineHeight: 24, maxChars: 58, gapBefore: 0, gapAfter: 8 },
  h2: { size: 14, lineHeight: 19, maxChars: 72, gapBefore: 8, gapAfter: 4 },
  h3: { size: 12, lineHeight: 17, maxChars: 82, gapBefore: 6, gapAfter: 2 },
  body: { size: 9.6, lineHeight: 13.5, maxChars: 102, gapBefore: 0, gapAfter: 0 },
  code: { size: 8.6, lineHeight: 12.2, maxChars: 112, gapBefore: 2, gapAfter: 2 },
};

const replacements = new Map([
  ["á", "a"],
  ["é", "e"],
  ["í", "i"],
  ["ó", "o"],
  ["ú", "u"],
  ["Á", "A"],
  ["É", "E"],
  ["Í", "I"],
  ["Ó", "O"],
  ["Ú", "U"],
  ["ñ", "n"],
  ["Ñ", "N"],
  ["ü", "u"],
  ["Ü", "U"],
  ["–", "-"],
  ["—", "-"],
  ["“", '"'],
  ["”", '"'],
  ["‘", "'"],
  ["’", "'"],
]);

function normalizeText(value) {
  return Array.from(value)
    .map((char) => replacements.get(char) ?? (char.charCodeAt(0) <= 126 ? char : ""))
    .join("");
}

function cleanMarkdown(line, inCodeBlock) {
  if (inCodeBlock) return line;

  return line
    .replace(/^>\s?/, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

function getStyle(line, inCodeBlock) {
  if (inCodeBlock) return styles.code;
  if (line.startsWith("# ")) return styles.h1;
  if (line.startsWith("## ")) return styles.h2;
  if (line.startsWith("### ")) return styles.h3;
  return styles.body;
}

function stripHeading(line) {
  return line.replace(/^#{1,6}\s+/, "");
}

function wrapLine(line, maxChars) {
  if (!line) return [""];

  const words = line.split(/\s+/);
  const lines = [];
  let current = "";

  for (const word of words) {
    if (!word) continue;

    if (word.length > maxChars) {
      if (current) {
        lines.push(current);
        current = "";
      }

      for (let index = 0; index < word.length; index += maxChars) {
        lines.push(word.slice(index, index + maxChars));
      }
      continue;
    }

    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) lines.push(current);
  return lines;
}

function escapePdfText(text) {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function toPdfCommands(lines) {
  const pages = [];
  let commands = [];
  let y = page.height - page.marginTop;

  const addPage = () => {
    pages.push(commands);
    commands = [];
    y = page.height - page.marginTop;
  };

  const addLine = (text, style) => {
    if (y - style.lineHeight < page.marginBottom) addPage();

    commands.push(
      `BT /F1 ${style.size} Tf ${page.marginX} ${y.toFixed(2)} Td (${escapePdfText(text)}) Tj ET`,
    );
    y -= style.lineHeight;
  };

  for (const entry of lines) {
    const { text, style } = entry;

    if (text === "") {
      y -= styles.body.lineHeight;
      if (y < page.marginBottom) addPage();
      continue;
    }

    y -= style.gapBefore;
    for (const wrapped of wrapLine(text, style.maxChars)) {
      addLine(wrapped, style);
    }
    y -= style.gapAfter;
  }

  if (commands.length) pages.push(commands);
  return pages;
}

function buildPdf(pageCommands) {
  const objects = [];
  const addObject = (body) => {
    objects.push(body);
    return objects.length;
  };

  const fontId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const pagesId = addObject("PAGES_PLACEHOLDER");
  const pageIds = [];

  for (const commands of pageCommands) {
    const stream = commands.join("\n");
    const contentId = addObject(`<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`);
    const pageId = addObject(
      `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${page.width} ${page.height}] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${contentId} 0 R >>`,
    );
    pageIds.push(pageId);
  }

  objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;
  const catalogId = addObject(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((body, index) => {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });

  const xrefOffset = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let index = 1; index < offsets.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return pdf;
}

const markdown = readFileSync(inputPath, "utf8").replace(/\r\n/g, "\n");
const entries = [];
let inCodeBlock = false;

for (const rawLine of markdown.split("\n")) {
  if (rawLine.trim().startsWith("```")) {
    inCodeBlock = !inCodeBlock;
    continue;
  }

  const style = getStyle(rawLine, inCodeBlock);
  const cleaned = normalizeText(cleanMarkdown(stripHeading(rawLine), inCodeBlock).trimEnd());
  entries.push({ text: cleaned, style });
}

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, buildPdf(toPdfCommands(entries)), "binary");

console.log(`PDF generado: ${outputPath}`);
