/**
 * Colour priority for storefront swatches & cards:
 * Gold → Silver → everything else (stable within the same rank).
 */
export function colourRank(label = '') {
  const l = String(label || '').toLowerCase().trim();
  if (!l || l === 'default') return 50;

  // Gold family first (incl. rose / yellow gold, “gold & silver” combos)
  if (
    /\bgold\b/.test(l) ||
    /\bgld\b/.test(l) ||
    /yellow\s*gold|rose\s*gold|white\s*gold|champagne/.test(l)
  ) {
    return 0;
  }

  // Silver second
  if (
    /\bsilver\b/.test(l) ||
    /\bslv\b/.test(l) ||
    /sterling|s\s*925|\bs925\b|\b925\b/.test(l)
  ) {
    return 1;
  }

  return 10;
}

export function sortByColourPriority(
  items,
  getLabel = (item) => item?.label || item?.colorLabel || '',
) {
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
