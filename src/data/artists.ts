export const ARTISTS = {
  'max-wert': { name: 'Max Wert' },
  'ksenia-wert': { name: 'Ksenia Wert' },
} as const;

export type ArtistSlug = keyof typeof ARTISTS;

export function getName(slug: ArtistSlug): string {
  return ARTISTS[slug].name;
}