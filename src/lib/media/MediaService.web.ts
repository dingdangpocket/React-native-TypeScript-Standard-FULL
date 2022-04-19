/**
 * @file: MediaService.web.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

export class MediaService {
  static shared = new MediaService();

  async saveToLibrary(): Promise<{
    status: 'unauthorized' | 'ok';
  }> {
    throw new Error('Not supported in web environment');
  }
}
