/**
 * @file: PreInspectionManager.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
import { InspectionCategory } from '@euler/model/enum';
import { PreInspection } from '@euler/model/task-detail';
import { TaskManager } from '../TaskManager';
import { InspectionManager } from './InspectionManager';

export class PreInspectionManager extends InspectionManager<PreInspection> {
  constructor(taskManager: TaskManager) {
    super(InspectionCategory.Pre, taskManager);
  }
}
