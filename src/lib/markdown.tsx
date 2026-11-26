import { Fragment, type ReactNode } from "react";

function inline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern =
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+|\/[^\s)]*)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = pattern.exec(text))) {
    if (match.index > last) {
      nodes.push(text.slice(last, match.index));
    }
    if (match[1] && match[2]) {
      nodes.push(
        <a key={`${keyPrefix}-a-${index}`} href={match[2]}>
          {match[1]}
        </a>,
      );
    } else if (match[3]) {
      nodes.push(
        <strong key={`${keyPrefix}-s-${index}`}>{match[3]}</strong>,
      );
    } else if (match[4]) {
      nodes.push(<em key={`${keyPrefix}-e-${index}`}>{match[4]}</em>);
    }
    last = match.index + match[0].length;
    index += 1;
  }

  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Markdown({ source }: { source: string }) {
  const lines = source.split(/\r?\n/);
  const blocks: ReactNode[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];
  let index = 0;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    const text = paragraph.join(" ");
    blocks.push(<p key={`p-${index}`}>{inline(text, `p-${index}`)}</p>);
    paragraph = [];
    index += 1;
  };

  const flushList = () => {
    if (list.length === 0) return;
    blocks.push(
      <ul key={`ul-${index}`}>
        {list.map((item, itemIndex) => (
          <li key={`li-${index}-${itemIndex}`}>
            {inline(item, `li-${index}-${itemIndex}`)}
          </li>
        ))}
      </ul>,
    );
    list = [];
    index += 1;
  };

  for (const line of lines) {
    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    const item = /^[-*]\s+(.+)$/.exec(line);
    if (heading) {
      flushParagraph();
      flushList();
      const level = heading[1].length;
      const Tag = level === 1 ? "h1" : level === 2 ? "h2" : "h3";
      blocks.push(
        <Tag key={`h-${index}`}>{inline(heading[2], `h-${index}`)}</Tag>,
      );
      index += 1;
      continue;
    }
    if (item) {
      flushParagraph();
      list.push(item[1]);
      continue;
    }
    if (!line.trim()) {
      flushParagraph();
      flushList();
      continue;
    }
    flushList();
    paragraph.push(line.trim());
  }

  flushParagraph();
  flushList();

  return <Fragment>{blocks}</Fragment>;
}
