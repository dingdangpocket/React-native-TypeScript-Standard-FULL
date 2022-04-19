import {
  InspectionOrderPriority,
  InspectionOrderType,
  InspectionTaskStatus,
} from '../enum';

export type TaskBasicInfo = {
  // information that cannot be changed
  id: number;
  taskNo: string;
  orgId: number;
  storeId: number;
  orderId: number;
  orderNo: string;
  orderType: InspectionOrderType;
  reportNo: string;
  priority?: InspectionOrderPriority;
  expectedDuration?: number;
  serviceAgentId: number;
  serviceAgentName: string;
  createdAt: string | Date;
  finishedAt?: string | Date;
  updatedAt?: string | Date;

  // information that can be changed.
  vin: string;
  licensePlateNo: string;
  vehicleName: string;
  vehicleBrandName: string;
  vehicleManufacturer?: string;
  vehicleModel: string;
  vehicleModelYear?: number;
  vehicleDisplacement?: string;
  vehicleTrimLevel?: string;
  vehicleFuelType?: string;
  vehicleMileage: number;
  vehicleBrandLogo?: string;
  vehicleImageUrl?: string;
  remark?: string;
  nextServiceMileage?: number;
  nextServiceDate?: string | Date;
  hasOilService: boolean;

  status: InspectionTaskStatus;
  version: number;
};
