/**
 * @file: media-file.service.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
import { HttpClient, UploadProgressListener } from '@euler/lib/request';
import { UploadedFile } from '@euler/model';
import { MixedFileExtraInfo } from '@euler/model/common';
import {
  base64EncodedDataFromDataURI,
  extFromMimeType,
  mimeTypeFromFileUri,
} from '@euler/utils';
import { Platform } from 'react-native';

export type FileUploadParameters = {
  /** content type of the file, must be specified if cannot be recognized */
  mimeType?: string;
  /** specify the relative storage location of the file */
  realm?: string;
  /** optional filename */
  filename?: string;
  /** if thumbnail image(s) should be generated */
  cover?: boolean;
  /** maximim image boundary size */
  imageSize?: number;
  /** maximum image width */
  imageWidth?: number;
  /** maximum image height */
  imageHeight?: number;
  /** image fit method */
  imageFit?: 'contain' | 'cover' | 'fill' | 'inside' | 'outside';
  /** maximum cover image boundary size */
  coverSize?: number;
  /** maximum cover image width */
  coverWidth?: number;
  /** maximum image height */
  coverHeight?: number;
  /** cover image fit method */
  coverFit?: 'contain' | 'cover' | 'fill' | 'inside' | 'outside';
};

export class MediaFileService {
  constructor(private readonly api: HttpClient) {}

  async upload<TExtraInfo = MixedFileExtraInfo>(
    fileUri: string,
    options?: FileUploadParameters & {
      /** file upload progress listener */
      abortController?: AbortController;
      onProgress?: UploadProgressListener;
    },
  ): Promise<UploadedFile<TExtraInfo>> {
    const formData = new FormData();

    //#region upload parameters

    if (options?.realm) {
      formData.append('realm', options.realm);
    }

    if (options?.filename) {
      formData.append('filename', options.filename);
    }

    if (options?.cover) {
      formData.append('cover', '1');
    }

    if (options?.imageSize) {
      formData.append('imageSize', String(options.imageSize));
    }

    if (options?.imageWidth) {
      formData.append('imageWidth', String(options.imageWidth));
    }

    if (options?.imageHeight) {
      formData.append('imageHeight', String(options.imageHeight));
    }

    if (options?.imageFit) {
      formData.append('imageFit', options.imageFit);
    }

    if (options?.coverSize) {
      formData.append('coverSize', String(options.coverSize));
    }

    if (options?.coverWidth) {
      formData.append('coverWidth', String(options.coverWidth));
    }

    if (options?.coverHeight) {
      formData.append('coverHeight', String(options.coverHeight));
    }

    if (options?.coverFit) {
      formData.append('coverFit', options.coverFit);
    }

    //#endregion

    if (Platform.OS === 'web') {
      // on web, the uri should be the data uri.
      const [, contentType] = base64EncodedDataFromDataURI(fileUri);
      if (!contentType) {
        throw new Error('request.uri should be valid data uri');
      }
      const ext = extFromMimeType(contentType) ?? '';
      const resp = await fetch(fileUri);
      const blob = await resp.blob();
      formData.append('type', contentType);
      formData.append('blob', blob, `file${ext}`);
    } else {
      const fileName = fileUri.substring(fileUri.lastIndexOf('/') + 1);
      const contentType = options?.mimeType ?? mimeTypeFromFileUri(fileName);
      if (!contentType) {
        throw new Error(
          'file content type cannot be recognized, please specify via options.mimeType',
        );
      }
      // https://github.com/facebook/react-native/blob/main/Libraries/Network/FormData.js
      if (!options?.filename) {
        formData.append('filename', fileName);
      }
      formData.append('type', contentType);
      formData.append('blob', {
        uri: fileUri,
        type: contentType,
        name: fileName,
      } as any);
    }

    return await this.api
      .post()
      .url('/medias')
      .data(formData, false)
      .onUploadProgress(options?.onProgress)
      .withAbortController(options?.abortController)
      .future();
  }
}
