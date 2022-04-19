/**
 * @file: StoreGatewayDevice.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export interface StoreGatewayDevice {
  id: number;
  orgId: number;
  storeId: number;
  name?: string | null;
  macAddr: string;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
}
