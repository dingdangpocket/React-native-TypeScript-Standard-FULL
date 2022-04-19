/**
 * @file: InspectionFlowManager.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { Inspection } from '@euler/model/task-detail';
import { InspectionManager } from './InspectionManager';
import { InspectionManagerBase } from './InspectionManagerBase';

export class InspectionFlowManager<
  T extends Inspection,
> extends InspectionManagerBase<T> {
  constructor(inspectionManager: InspectionManager<T>) {
    super(inspectionManager.category, inspectionManager.taskManager);
  }

  dispose() {}

  async addInspectionFlow(params: {
    templateId: number;
    assignToMemberId: number;
  }) {
    const resp = await this.taskService.addTaskInspectionFlow(this.taskNo, {
      ...params,
      category: this.category,
    });
    this.handleVersionedResponse(
      resp,
      (_, { inspection, original, response: flow }) => {
        const index = original.flows.findIndex(x => x.id === flow.id);
        if (index >= 0) {
          inspection.flows[index] = flow;
        } else {
          inspection.flows.push(flow);
        }
      },
    );
  }

  async beginInspectionFlow(id: string) {
    const original = this.getTargetInspection(this.cachedDetail);
    const index = original.flows.findIndex(x => x.id === id);
    if (index < 0) {
      throw new Error('Flow does not exist');
    }

    if (original.flows[index].status !== 'pending') {
      return;
    }

    const resp = await this.taskService.beginTaskInspectionFlow(
      this.taskNo,
      this.category,
      id,
    );

    this.handleVersionedResponse(resp, (_, { inspection, response }) => {
      const flow = inspection.flows[index];
      flow.status = response.status;
      flow.startedAt = response.startedAt;
      flow.updatedAt = response.updatedAt;
    });
  }
}
