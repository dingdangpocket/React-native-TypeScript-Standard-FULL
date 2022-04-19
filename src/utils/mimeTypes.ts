/**
 * @file: mimeTypes.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

type Entry = [string, string[]];

const Entries: Entry[] = [
  ['image/jpeg', ['.jpg', '.jpeg']],
  ['image/png', ['.png']],
  ['image/gif', ['.gif']],
  ['image/tiff', ['.tif', '.tiff']],
  ['video/mp4', ['.mp4']],
  ['video/webm', ['.webm']],
  ['video/mpeg', ['.mpeg']],
  ['video/mov', ['.mov']],
  ['video/ogg', ['.ogv']],
];

const MimeType2ExtMap = new Map<string, string[]>(Entries);
const Ext2MimeTypeMap = new Map(
  Entries.reduce<[string, string][]>((acc, entry) => {
    return acc.concat(entry[1].map(x => [x, entry[0]]));
  }, []),
);

export function extFromMimeType(mimeType: string) {
  return MimeType2ExtMap.get(mimeType.toLowerCase());
}

export function mimeTypeFromFileUri(
  uri: string,
  defaultValue = 'application/octet-stream',
) {
  const idx = uri.lastIndexOf('.');
  if (idx <= 0) return defaultValue;
  const ext = uri.substring(idx).toLowerCase();
  return Ext2MimeTypeMap.get(ext) ?? defaultValue;
}
