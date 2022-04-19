import { ResourceAccessScope } from './enum';

export type VehicleServiceRecordsFilter = {
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  scope?: ResourceAccessScope;
  taskOnly?: boolean;
};
