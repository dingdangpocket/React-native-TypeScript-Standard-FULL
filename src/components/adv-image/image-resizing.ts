/**
 * @file: image-resizing.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

export namespace imageResizing {
  let imageResizingServiceImpl: ImageResizingService | undefined = undefined;

  export function setImageResizingServiceImpl(impl: ImageResizingService) {
    imageResizingServiceImpl = impl;
  }

  export interface ImageResizingService {
    /**
     * Determine if the given url is already resized.
     */
    isUriResized(uri: string): boolean;

    /**
     * Get the resized url for the given image url.
     * @param uri
     * @param options
     */
    uriResized(uri: string, options?: Options): string;
  }

  // https://www.alibabacloud.com/help/zh/doc-detail/44688.htm
  export enum Mode {
    Contain = 'contain',
    Cover = 'cover',
    Fill = 'fill',
    Inside = 'inside',
    Outside = 'outside',
  }

  export type Options = {
    width: number;
    height: number;
    mode?: Mode;
    fillColor?: string;
  };

  export function imageUriResized(
    url: string | null | undefined,
    options: Options,
  ) {
    if (!url) return undefined;

    if (!imageResizingServiceImpl) {
      return url;
    }

    if (!url.startsWith('http')) {
      return url;
    }

    if (url.includes('.gif')) {
      return url;
    }

    // if the image uri is the already resized version, skip it.
    if (imageResizingServiceImpl.isUriResized(url)) {
      return url;
    }

    return imageResizingServiceImpl.uriResized(url, options);
  }
}
