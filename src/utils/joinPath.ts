/**
 * @file joinPath.ts
 * @author Eric Xu <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export function joinPath(...paths: string[]) {
  return paths.reduce((result, path) => {
    if (!result) return path;
    if (!path) return result;
    return result.replace(/\/+$/, '') + '/' + path.replace(/^\/+/, '');
  }, '');
}
