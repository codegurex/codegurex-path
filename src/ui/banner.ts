export const brandLinks = [
  ['WEB', 'codegurex.com'],
  ['GITHUB', 'github.com/codegurex'],
  ['LINKEDIN', 'linkedin.com/in/codegurex'],
] as const;

const unicodeWordmark = [
  ' ██████╗ ██████╗ ██████╗ ███████╗ ██████╗ ██╗   ██╗██████╗ ███████╗██╗  ██╗',
  '██╔════╝██╔═══██╗██╔══██╗██╔════╝██╔════╝ ██║   ██║██╔══██╗██╔════╝╚██╗██╔╝',
  '██║     ██║   ██║██║  ██║█████╗  ██║  ███╗██║   ██║██████╔╝█████╗   ╚███╔╝ ',
  '██║     ██║   ██║██║  ██║██╔══╝  ██║   ██║██║   ██║██╔══██╗██╔══╝   ██╔██╗ ',
  '╚██████╗╚██████╔╝██████╔╝███████╗╚██████╔╝╚██████╔╝██║  ██║███████╗██╔╝ ██╗',
  ' ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝',
];

const standardWordmark = [
  '   ____ ___  ____  _____ ____ _   _ ____  _______  __',
  '  / ___/ _ \\|  _ \\| ____/ ___| | | |  _ \\| ____\\ \\/ /',
  ' | |  | | | | | | |  _|| |  _| | | | |_) |  _|  \\  /',
  ' | |__| |_| | |_| | |__| |_| | |_| |  _ <| |___ /  \\',
  '  \\____\\___/|____/|_____\\____|\\___/|_| \\_\\_____/_/\\_\\',
];

const smallWordmark = [
  '   ___ ___  ___  ___ ___ _   _ ___ _____  __',
  '  / __/ _ \\|   \\| __/ __| | | | _ \\ __\\ \\/ /',
  ' | (_| (_) | |) | _| (_ | |_| |   / _| >  <',
  '  \\___\\___/|___/|___\\___|\\___/|_|_\\___/_/\\_\\',
];

export function centerLines(lines: string[], width: number): string[] {
  return lines.map(line => `${' '.repeat(Math.max(0, Math.floor((width - line.length) / 2)))}${line}`);
}

function framedDetails(width: number, unicode: boolean): string[] {
  const boxWidth = Math.min(width, 78);
  const horizontal = unicode ? '─' : '-';
  const [tl, tr, bl, br, vertical] = unicode ? ['╭', '╮', '╰', '╯', '│'] : ['+', '+', '+', '+', '|'];
  const row = (value: string): string => `${vertical} ${value.padEnd(boxWidth - 4)} ${vertical}`;
  return [
    `${tl}${horizontal.repeat(boxWidth - 2)}${tr}`,
    ...[
      'CODEGUREX SECURITY',
      'Security for the AI Era',
      '',
      ...brandLinks.map(([label, value]) => `${label.padEnd(9)} ${value}`),
    ].map(row),
    `${bl}${horizontal.repeat(boxWidth - 2)}${br}`,
  ];
}

export interface BrandBanner {
  emblem: string;
  wordmark: string[];
  product: string;
  details: string[];
}

export function brandBanner(width: number, unicode: boolean): BrandBanner {
  const safeWidth = Math.max(1, width);
  const compact = safeWidth < 58;
  const wordmark = unicode && safeWidth >= 76
    ? unicodeWordmark
    : safeWidth >= 57
      ? standardWordmark
      : safeWidth >= 46
        ? smallWordmark
        : ['CODEGUREX'];

  return {
    emblem: unicode ? '◢ C ◣  CODEGUREX SECURITY' : '[ C ]  CODEGUREX SECURITY',
    wordmark,
    product: 'P A T H  /  SECURITY LEARNING EXPERIENCE',
    details: compact
      ? ['Security for the AI Era', ...brandLinks.map(([label, value]) => `${label}: ${value}`)]
      : framedDetails(safeWidth, unicode),
  };
}
