/**
 * ASCII box drawing utilities for the terminal.
 *
 * nasaBox(title, subtitle, lines, width?)
 *   Generates the standard NASA-report bordered box.
 *
 * simpleBox(lines, width?)
 *   Thin-bordered box without the NASA header.
 *
 * pad(text, width)
 *   Pads a single line to fit inside a box of the given width.
 */

const DEFAULT_W = 54;

export function nasaBox(title, subtitle, lines, width = DEFAULT_W) {
  const bar = '═'.repeat(width);
  const p = (s) => `║ ${s.padEnd(width - 2)} ║`;
  const blank = p('');
  const rows = [
    `╔${bar}╗`,
    p(`      ██  ${title}  ██`),
    p(`         ${subtitle}`),
    `╠${bar}╣`,
    blank,
    ...lines.map(l => l === '' ? blank : p(l)),
    blank,
    `╚${bar}╝`,
  ];
  return '\n' + rows.join('\n') + '\n';
}

export function simpleBox(lines, width = DEFAULT_W) {
  const bar = '─'.repeat(width);
  const p = (s) => `│ ${s.padEnd(width - 2)} │`;
  const blank = p('');
  const rows = [
    `┌${bar}┐`,
    ...lines.map(l => l === '' ? blank : p(l)),
    `└${bar}┘`,
  ];
  return rows.join('\n');
}

export function padLine(text, width = DEFAULT_W) {
  return `║ ${text.padEnd(width - 2)} ║`;
}
