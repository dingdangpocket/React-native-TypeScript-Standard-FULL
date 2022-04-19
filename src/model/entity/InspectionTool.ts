/**
 * @file: InspectionTool.ts
 * @author: eric <developer@zhichetech.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import { QuantitativeType } from '../enum';

export interface InspectionTool {
  id: number;
  code: string;
  name: string;
  quantitativeType?: QuantitativeType | null;
  isExternal: boolean;
  createdAt: string | Date;
  updatedAt?: string | Date | null;
  description?: string | null;
  protocol?: string | null;
}
