/**
 * @file: sms.service.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { HttpClient } from '@euler/lib/request';
import { PredefinedVerifyCodeScene } from '@euler/model/enum';

export class SmsService {
  constructor(private readonly api: HttpClient) {}

  async requestVerifyCodeTicket(nonce: string): Promise<string> {
    return await this.api
      .post()
      .url('/sms/verify-code/tickets')
      .data({ nonce })
      .future();
  }

  async sendVerifyCode(
    ticket: string,
    mobile: string,
    scene: PredefinedVerifyCodeScene,
    length?: number,
  ): Promise<number> {
    return await this.api
      .post()
      .url('/sms/verify-code')
      .data({ ticket, mobile, scene, length })
      .future();
  }
}
