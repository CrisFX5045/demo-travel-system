import { inflateSync } from "node:zlib";
import { readFileSync } from "node:fs";

const [, , filePath] = process.argv;

if (!filePath) {
  throw new Error("Usage: node scripts/extract-pdf-text.mjs <pdf-path>");
}

const bytes = readFileSync(filePath);
const raw = bytes.toString("latin1");
const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
const chunks = [];

function decodePdfString(value) {
  return value
    .replace(/\\([nrtbf()\\])/g, (_, char) => {
      const map = {
        n: "\n",
        r: "\r",
        t: "\t",
        b: "\b",
        f: "\f",
        "(": "(",
        ")": ")",
        "\\": "\\",
      };
      return map[char] ?? char;
    })
    .replace(/\\([0-7]{1,3})/g, (_, octal) =>
      String.fromCharCode(parseInt(octal, 8)),
    );
}

function decodeHexString(value) {
  const clean = value.replace(/\s+/g, "");
  const padded = clean.length % 2 === 0 ? clean : `${clean}0`;
  const chars = [];
  for (let i = 0; i < padded.length; i += 2) {
    const code = parseInt(padded.slice(i, i + 2), 16);
    if (Number.isFinite(code) && code > 0) chars.push(String.fromCharCode(code));
  }
  return chars.join("");
}

function extractText(content) {
  const text = [];
  const literalRegex = /\((?:\\.|[^\\)])*\)\s*Tj/g;
  const arrayRegex = /\[(.*?)\]\s*TJ/gs;
  const hexRegex = /<([0-9A-Fa-f\s]+)>\s*Tj/g;
  let match;

  while ((match = literalRegex.exec(content))) {
    text.push(decodePdfString(match[0].replace(/\s*Tj$/, "").slice(1, -1)));
  }

  while ((match = arrayRegex.exec(content))) {
    const parts = [];
    const itemRegex = /\((?:\\.|[^\\)])*\)|<([0-9A-Fa-f\s]+)>/g;
    let item;
    while ((item = itemRegex.exec(match[1]))) {
      const token = item[0];
      parts.push(
        token.startsWith("(")
          ? decodePdfString(token.slice(1, -1))
          : decodeHexString(token.slice(1, -1)),
      );
    }
    text.push(parts.join(""));
  }

  while ((match = hexRegex.exec(content))) {
    text.push(decodeHexString(match[1]));
  }

  return text.join("\n");
}

let stream;
while ((stream = streamRegex.exec(raw))) {
  const start = stream.index;
  const dictionaryStart = raw.lastIndexOf("<<", start);
  const dictionaryEnd = raw.lastIndexOf(">>", start);
  const dictionary =
    dictionaryStart >= 0 && dictionaryEnd >= dictionaryStart
      ? raw.slice(dictionaryStart, dictionaryEnd + 2)
      : "";
  let content = stream[1];

  if (dictionary.includes("/FlateDecode")) {
    try {
      content = inflateSync(Buffer.from(content, "latin1")).toString("latin1");
    } catch {
      continue;
    }
  }

  const text = extractText(content);
  if (text.trim()) chunks.push(text);
}

console.log(
  chunks
    .join("\n")
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim(),
);
