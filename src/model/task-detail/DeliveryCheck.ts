import { CommonTaskStatus } from '../enum';
import {
  DeliveryCheckItem,
  DeliveryCheckItemCommitPayload,
} from './DeliveryCheckItem';

export type DeliveryCheck = {
  status: CommonTaskStatus;
  finishedBy?: string;
  finishedAt?: string | Date;
  items: DeliveryCheckItem[];
  version: number;
};

export type DeliveryCheckCommitPayload = {
  items: DeliveryCheckItemCommitPayload[];
};
