/**
 * @file: cache.web.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

// because there is local storage limit in web browsers, thus,
// we don't cache everything about tasks on web for now.

export const ensureCacheDirectoryExists = () => Promise.resolve();

export const readCachedFileContents = () => Promise.resolve(null);

export const writeContentsToCachedFile = () => Promise.resolve();

export const deleteCachedFile = () => Promise.resolve();
