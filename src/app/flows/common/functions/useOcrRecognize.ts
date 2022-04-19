/**
 * @file: useOcrRecognize.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { useFetchAsyncState } from '@euler/functions/useFetchAsyncState';
import { OcrRecognizeResult } from '@euler/services';
import { onErrorIgnore } from '@euler/utils';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { useEffect, useRef } from 'react';
import { LayoutRectangle } from 'react-native';

export const kMinBottomSheetHeight = 300;
export const kHandleHeight = 24;

export type OcrRecognizePreviewProps = {
  imageUri: string;
  imageSize: { width: number; height: number };
  cropRect?: LayoutRectangle;
  maskSize?: { width: number; height: number };
};

export const useOcrRecognize = <T, U>({
  imageUri,
  cropRect,
  maskSize,
  ...props
}: {
  recognize: (imageUriToRecognize: string) => Promise<OcrRecognizeResult<T>>;
  fetchExtraInfo: (result: T) => Promise<U>;
} & OcrRecognizePreviewProps) => {
  const recognizedResponse = useRef<OcrRecognizeResult<T>>();
  const [recognizeState, startRecognize] = useFetchAsyncState(
    async () => {
      let uri = imageUri;
      if (cropRect && maskSize) {
        const transformed = await manipulateAsync(
          imageUri,
          [
            {
              crop: {
                originX: cropRect.x,
                originY: cropRect.y,
                width: cropRect.width,
                height: cropRect.height,
              },
            },
            {
              resize: {
                width: maskSize.width * 2,
                height: maskSize.height * 2,
              },
            },
          ],
          {
            compress: 0.8,
            format: SaveFormat.JPEG,
          },
        );
        uri = transformed.uri;
      }
      const response = await props.recognize(uri);
      recognizedResponse.current = response;
      return response.result;
    },
    {
      status: 'loading',
    },
  );

  const [extraInfoState, fetchExtraInfo] = useFetchAsyncState(
    props.fetchExtraInfo,
    undefined,
  );

  useEffect(() => {
    startRecognize()
      .then(async result => {
        if (result) {
          await fetchExtraInfo(result);
        }
      })
      .catch(onErrorIgnore);
  }, [startRecognize, fetchExtraInfo]);

  return {
    recognizeState,
    extraInfoState,
    startRecognize,
    fetchExtraInfo,
    recognizedResponse: recognizedResponse.current,
  };
};
