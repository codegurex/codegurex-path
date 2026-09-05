export const brandLinks = [
  ['WEB', 'codegurex.com'],
  ['GITHUB', 'github.com/codegurex'],
  ['LINKEDIN', 'linkedin.com/in/codegurex'],
] as const;

const glyphs: Record<string, string[]> = {
  C: ['1111', '1000', '1000', '1000', '1111'],
  O: ['1111', '1001', '1001', '1001', '1111'],
  D: ['1110', '1001', '1001', '1001', '1110'],
  E: ['1111', '1000', '1110', '1000', '1111'],
  G: ['1111', '1000', '1011', '1001', '1111'],
  U: ['1001', '1001', '1001', '1001', '1111'],
  R: ['1110', '1001', '1110', '1010', '1001'],
  X: ['1001', '1001', '0110', '1001', '1001'],
};

export function largeWord(word: string, unicode: boolean): string[] {
  const on = unicode ? '█' : '#';
  const off = ' ';
  return Array.from({ length: 5 }, (_, row) => [...word].map(letter => {
    const pixels = glyphs[letter]?.[row];
    if (!pixels) return '';
    return [...pixels].map(pixel => pixel === '1' ? on : off).join('').trimEnd();
  }).join('  ').trimEnd());
}

function mark(unicode: boolean): string[] {
  if (unicode) return [
    '    ◢████████',
    '  ◢██◤',
    ' ██',
    ' ██',
    ' ██',
    '  ◥██◣',
    '    ◥████████',
  ];
  return [
    '    /########',
    '  /##',
    ' ##',
    ' ##',
    ' ##',
    '  \\##',
    '    \\########',
  ];
}

function framedDetails(width: number, unicode: boolean): string[] {
  const boxWidth = Math.min(width, 78);
  const horizontal = unicode ? '─' : '-';
  const [tl, tr, bl, br, vertical] = unicode ? ['╭', '╮', '╰', '╯', '│'] : ['+', '+', '+', '+', '|'];
  const row = (value: string): string => `${vertical} ${value.padEnd(boxWidth - 4)} ${vertical}`;
  const lines = [
    'CODEGUREX SECURITY',
    'Security for the AI Era',
    '',
    ...brandLinks.map(([label, value]) => `${label.padEnd(9)} ${value}`),
  ];
  return [
    `${tl}${horizontal.repeat(boxWidth - 2)}${tr}`,
    ...lines.map(row),
    `${bl}${horizontal.repeat(boxWidth - 2)}${br}`,
  ];
}

export interface BrandBanner {
  logo: string[];
  wordmark: string[];
  details: string[];
  sideBySide: boolean;
}

export function brandBanner(width: number, unicode: boolean): BrandBanner {
  const safeWidth = Math.max(1, width);
  if (safeWidth < 58) {
    return {
      logo: [unicode ? '◢ C ◣' : '[ C ]'],
      wordmark: ['CODEGUREX PATH'],
      details: ['CodeGurex Security · Security for the AI Era', ...brandLinks.map(([label, value]) => `${label}: ${value}`)],
      sideBySide: false,
    };
  }

  const wordmark = [...largeWord('CODEGUREX', unicode), '', 'P A T H  /  SECURITY LEARNING EXPERIENCE'];
  const logo = mark(unicode);
  const combinedWidth = Math.max(...logo.map(line => line.length)) + 3 + Math.max(...wordmark.map(line => line.length));
  return {
    logo,
    wordmark,
    details: framedDetails(safeWidth, unicode),
    sideBySide: safeWidth >= combinedWidth,
  };
}

export function combineColumns(left: string[], right: string[], gap = 3): string[] {
  const leftWidth = Math.max(...left.map(line => line.length));
  const rows = Math.max(left.length, right.length);
  return Array.from({ length: rows }, (_, index) => `${left[index]?.padEnd(leftWidth) ?? ' '.repeat(leftWidth)}${' '.repeat(gap)}${right[index] ?? ''}`.trimEnd());
}
