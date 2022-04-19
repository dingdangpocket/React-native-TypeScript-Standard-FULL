/**
 * @file: order.service.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
import { HttpClient } from '@euler/lib/request';
import { ServiceOrderInfo } from '@euler/model';

export class OrderService {
  constructor(private readonly api: HttpClient) {}

  async plateOrder(request: ServiceOrderInfo): Promise<string> {
    return await this.api.post().url('/orders').data(request).future();
  }
}
