/**
 * @file: VinInfo.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

export interface DecodedVinWMIInfo {
  region: string;
  country: string;
  manufacturer: string;
}

export interface DecodedVinInfo {
  vin: string;
  is_valid: boolean;

  vin_decomposed: string;
  vin_decomposed_segments: string[];

  iso: {
    ref: string; // ISO-3799-2009
    wmi: string;
    vds: string;
    vis: string;
  };

  region: string;
  country: string;
  manufacturer: string;
  manufacturer_code: string;

  production_year: number[];
  plant_code: string;
  serial_no: string;
  checksum: string;

  vpy_threshold: number;
  less_than_vpy_threshold: boolean;
}

export interface VinManufacturer {
  code: string;
  country: string;
  name: string;
}
