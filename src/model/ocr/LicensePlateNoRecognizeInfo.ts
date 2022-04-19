/**
 * @file: LicensePlateNoRecognizeInfo.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
export interface LicensePlateNoRecognizeInfo {
  color: 'green' | 'blue' | 'yellow';
  number: string;
  probability: number[];
  vertexes_location: { x: number; y: number }[];
}
