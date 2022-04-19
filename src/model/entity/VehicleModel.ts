/**
 * @file: VehicleModel.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

export interface VehicleModel {
  id: number;
  initialLetter: string;
  brandId: string;
  brandName: string;
  manufacturerId: string;
  manufacturerName: string;
  seriesId: string;
  seriesName: string;
  logoUrl?: string | null;
  imageUrl?: string | null;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
}
