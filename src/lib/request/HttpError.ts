/**
 * @file HttpError
 * @author Eric Xu <xuxiang@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

/**
 * @class
 * @extends {Error}
 * The http error class w/ http related information.
 */
export class HttpError extends Error {
  code: string | undefined;
  status = 0;
  statusText: string | undefined;
  response: any;

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(message: string | undefined) {
    super(message);
  }
}
