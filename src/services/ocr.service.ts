/**
 * @file: ocr.service.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { HttpClient } from '@euler/lib/request';
import { LicensePlateNoRecognizeInfo } from '@euler/model/ocr/LicensePlateNoRecognizeInfo';
import { base64EncodedDataFromDataURI } from '@euler/utils';
import { isSimulator } from '@euler/utils/device';
import { Platform } from 'react-native';

const kFakePlateNoRecognize = isSimulator();
const kThrowPlateNoRecognizeError = false;
const kFakeVinRecognize = isSimulator();
const kThrowVinRecognizeError = false;

export type OcrRecognizeResult<T> = {
  url?: string;
  result: T | null;
};

export class OcrService {
  constructor(private readonly api: HttpClient) {}

  async licensePlateNoRecognize(request: {
    uri: string;
  }): Promise<OcrRecognizeResult<LicensePlateNoRecognizeInfo>> {
    if (kThrowPlateNoRecognizeError) {
      throw new Error(
        'Handle height helps to calculate the internal container and sheet layouts. If handleComponent is provided, the library internally will calculate its layout, unless handleHeight is provided too.',
      );
    }
    if (kFakePlateNoRecognize) {
      return {
        result: {
          color: 'blue',
          number: '川AN65X0',
          probability: [1],
          vertexes_location: [{ x: 0, y: 0 }],
        },
      };
    }
    const formData = await this.buildFromData(request);
    return await this.api
      .post()
      .url('/ocr/license-plate-no')
      .data(formData, false)
      .future();
  }

  async vinRecognize(request: {
    uri: string;
  }): Promise<OcrRecognizeResult<string>> {
    if (kThrowVinRecognizeError) {
      throw new Error(
        'Handle height helps to calculate the internal container and sheet layouts. If handleComponent is provided, the library internally will calculate its layout, unless handleHeight is provided too.',
      );
    }
    if (kFakeVinRecognize) {
      return { result: 'WVGA267L8AD017779' };
    }
    const formData = await this.buildFromData(request);
    return await this.api.post().url('/ocr/vin').data(formData, false).future();
  }

  private async buildFromData(request: { uri: string }) {
    const formData = new FormData();
    if (Platform.OS === 'web') {
      // on web, the uri should be the data uri.
      const [, contentType] = base64EncodedDataFromDataURI(request.uri);
      if (!contentType) {
        throw new Error('request.uri should be valid data uri');
      }
      const resp = await fetch(request.uri);
      const blob = await resp.blob();
      formData.append('blob', blob, 'image.jpg');
    } else {
      const contentType = /\.png$/i.test(request.uri)
        ? 'image/png'
        : 'image/jpeg';
      // https://github.com/facebook/react-native/blob/main/Libraries/Network/FormData.js
      formData.append('image', {
        uri: request.uri,
        type: contentType,
        name: 'image.jpg',
      } as any);
    }
    return formData;
  }
}
