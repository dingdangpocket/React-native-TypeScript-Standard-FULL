/**
 * @file: dataURIToBlob.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

export function dataURItoBlob(dataURI: string) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  const [prefix, base64EncodedData] = dataURI.split(',') as [string, string];
  const byteString = atob(base64EncodedData);

  // separate out the mime component
  const mimeString = prefix.split(':')[1].split(';')[0];

  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // Old Code
  // write the ArrayBuffer to a blob, and you're done
  // const bb = new BlobBuilder();
  // bb.append(ab);
  // return bb.getBlob(mimeString);

  // New Code
  return new Blob([ab], { type: mimeString });
}
