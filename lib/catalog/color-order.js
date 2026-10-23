/**
 * Colour priority for storefront: Gold → Silver → everything else.
 * Within the same rank, original order is kept.
 */
export function colourRank(label = '') {
  const l = String(label || '').toLowerCase().trim();
  if (!l) return 50;
  if (/\bgold\b/.test(l)) return 0;
  if (/\bsilver\b/.test(l)) return 1;
  return 10;
}

export function sortByColourPriority(items, getLabel = (item) => item?.label || item?.colorLabel || '') {
  return [...(items || [])]
    .map((item, index) => ({ item, index, rank: colourRank(getLabel(item)) }))
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map(({ item }) => item);
}

/** Natural filename sort so 1,2,10 upload in the right order. */
export function sortFilesByName(files = []) {
  return [...files].sort((a, b) =>
    String(a?.name || '').localeCompare(String(b?.name || ''), undefined, {
      numeric: true,
      sensitivity: 'base',
    }),
  );
}
