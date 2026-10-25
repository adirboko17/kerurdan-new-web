import Link from "next/link";
import type { ReactNode } from "react";
import { SHOW_REVIEW_MARKS } from "@/lib/guides-config";
import { SITE } from "@/lib/site";

type Block =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] };

const REVIEW_MARK_PATTERN = /\[לבדיק[^\]]*\]/g;

function stripReviewMarks(text: string): string {
  return text.replace(REVIEW_MARK_PATTERN, "").replace(/\s{2,}/g, " ").trim();
}

function renderReviewMarks(text: string, keyPrefix: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const re = new RegExp(REVIEW_MARK_PATTERN.source, "g");
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    if (SHOW_REVIEW_MARKS) {
      parts.push(
        <mark key={`${keyPrefix}-mark-${match.index}`} className="guide-review-mark">
          {match[0]}
        </mark>,
      );
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length ? parts : [text];
}

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const withMarks = renderReviewMarks(text, keyPrefix);
  const nodes: ReactNode[] = [];

  withMarks.forEach((segment, segmentIndex) => {
    if (typeof segment !== "string") {
      nodes.push(segment);
      return;
    }
    const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    let last = 0;
    let linkMatch: RegExpExecArray | null;
    while ((linkMatch = linkPattern.exec(segment)) !== null) {
      if (linkMatch.index > last) {
        nodes.push(...renderBold(segment.slice(last, linkMatch.index), `${keyPrefix}-t-${segmentIndex}-${last}`));
      }
      const label = linkMatch[1];
      const href = linkMatch[2];
      const internal =
        href.startsWith(SITE.url) ? href.slice(SITE.url.length) || "/" : href.startsWith("/") ? href : null;
      if (internal) {
        nodes.push(
          <Link key={`${keyPrefix}-l-${linkMatch.index}`} href={internal}>
            {label}
          </Link>,
        );
      } else {
        nodes.push(
          <a key={`${keyPrefix}-a-${linkMatch.index}`} href={href} target="_blank" rel="noopener noreferrer">
            {label}
          </a>,
        );
      }
      last = linkMatch.index + linkMatch[0].length;
    }
    if (last < segment.length) {
      nodes.push(...renderBold(segment.slice(last), `${keyPrefix}-b-${segmentIndex}-${last}`));
    }
  });

  return nodes;
}

function renderBold(text: string, keyPrefix: string): ReactNode[] {
  const parts = text.split(/\*\*/);
  if (parts.length === 1) return [text];
  return parts.map((part, index) =>
    index % 2 === 1 ? <strong key={`${keyPrefix}-s-${index}`}>{part}</strong> : part,
  );
}

function parseTableRow(line: string): string[] {
  return line
    .split("|")
    .map((cell) => cell.trim())
    .filter((_, index, arr) => index > 0 && index < arr.length - 1);
}

export function parseGuideBlocks(markdown: string): Block[] {
  const lines = markdown.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("# ")) {
      i += 1;
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: line.slice(3).trim() });
      i += 1;
      continue;
    }

    if (line.startsWith("|")) {
      const headers = parseTableRow(line);
      i += 1;
      if (lines[i]?.includes("---")) i += 1;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        rows.push(parseTableRow(lines[i]));
        i += 1;
      }
      blocks.push({ type: "table", headers, rows });
      continue;
    }

    if (line.startsWith("- ") || line.startsWith("  - ")) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("  - "))) {
        items.push(lines[i].replace(/^\s*-\s+/, "").trim());
        i += 1;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    if (!line.trim()) {
      i += 1;
      continue;
    }

    const paragraphLines: string[] = [line];
    i += 1;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith("|") &&
      !lines[i].startsWith("- ")
    ) {
      paragraphLines.push(lines[i]);
      i += 1;
    }
    blocks.push({ type: "p", text: paragraphLines.join(" ").trim() });
  }

  return blocks;
}

export function GuideMarkdownBody({ markdown }: { markdown: string }) {
  const blocks = parseGuideBlocks(markdown);

  return (
    <>
      {blocks.map((block, index) => {
        const key = `block-${index}`;
        if (block.type === "h2") {
          return <h2 key={key}>{block.text}</h2>;
        }
        if (block.type === "p") {
          const text = SHOW_REVIEW_MARKS ? block.text : stripReviewMarks(block.text);
          return <p key={key}>{renderInline(text, key)}</p>;
        }
        if (block.type === "ul") {
          return (
            <ul key={key}>
              {block.items.map((item, itemIndex) => {
                const text = SHOW_REVIEW_MARKS ? item : stripReviewMarks(item);
                return <li key={`${key}-${itemIndex}`}>{renderInline(text, `${key}-${itemIndex}`)}</li>;
              })}
            </ul>
          );
        }
        return (
          <div key={key} className="guide-table-wrap">
            <table className="guide-table">
              <thead>
                <tr>
                  {block.headers.map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex}>{renderInline(cell, `${key}-${rowIndex}-${cellIndex}`)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </>
  );
}
