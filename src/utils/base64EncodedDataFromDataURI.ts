/**
 * @file: base64EncodedDataFromDataURI.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

export function base64EncodedDataFromDataURI(
  dataURI: string,
): [string, string] {
  const [prefix, base64EncodedData] = dataURI.split(',');
  const mimeType = prefix.split(':')[1].split(';')[0];
  return [base64EncodedData, mimeType];
}
