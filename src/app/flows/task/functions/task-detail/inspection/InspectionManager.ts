/**
 * @file: InspectionManager.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { InspectionSiteInfo } from '@euler/functions/useInventory';
import { InspectionCategory, SiteInspectionType } from '@euler/model/enum';
import { Inspection, SiteInspectionStaged } from '@euler/model/task-detail';
import produce, { freeze } from 'immer';
import { BehaviorSubject, Subscription } from 'rxjs';
import { TaskManager } from '../TaskManager';
import { InspectionFlowManager } from './InspectionFlowManager';
import { InspectionManagerBase } from './InspectionManagerBase';
import { SiteInspectionManager } from './SiteInspectionManager';

export type SiteInspectionContext<T extends Inspection> = {
  manager: SiteInspectionManager<T>;
  subscription: Subscription;
};

export class InspectionManager<
  T extends Inspection,
> extends InspectionManagerBase<T> {
  readonly flowManager = new InspectionFlowManager<T>(this);
  readonly siteInspectionContextMap = new Map<
    number,
    SiteInspectionContext<T>
  >();
  readonly siteInspections$ = new BehaviorSubject(
    new Map<number, SiteInspectionStaged>(),
  );
  readonly siteIdsBeingCommited$ = new BehaviorSubject(new Set<number>());

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(category: InspectionCategory, taskManager: TaskManager) {
    super(category, taskManager);
  }

  async addInspectionFlow(params: {
    templateId: number;
    assignToMemberId: number;
  }) {
    await this.flowManager.addInspectionFlow(params);
  }

  async beginInspectionFlow(id: string) {
    await this.flowManager.beginInspectionFlow(id);
  }

  siteInspectionWillCommit(siteId: number) {
    const current = this.siteIdsBeingCommited$.getValue();
    const next = produce(freeze(current), draft => {
      draft.add(siteId);
    });
    this.siteIdsBeingCommited$.next(next);
  }

  siteInspectionDidCommit(siteId: number) {
    const current = this.siteIdsBeingCommited$.getValue();
    const next = produce(freeze(current), draft => {
      draft.delete(siteId);
    });
    this.siteIdsBeingCommited$.next(next);
  }

  dispose() {
    for (const context of this.siteInspectionContextMap.values()) {
      context.subscription.unsubscribe();
      context.manager.dispose();
    }
    this.siteInspectionContextMap.clear();
    this.flowManager.dispose();
  }

  /**
   * Begin inspection for the given site.
   */
  beginSiteInspection(params: {
    site: InspectionSiteInfo;
    inspectionType: SiteInspectionType;
    technicianId: number;
    technicianName: string;
  }) {
    const siteId = params.site.id;
    let context = this.siteInspectionContextMap.get(siteId);
    if (!context) {
      const manager = new SiteInspectionManager<T>(
        this,
        params.site,
        params.inspectionType,
        params.technicianId,
        params.technicianName,
      );
      const subscription = manager.staged$.subscribe(staged => {
        const current = freeze(this.siteInspections$.value);
        const siteInspections = produce(current, draft => {
          // update site inspection with the updated staged data.
          draft.set(siteId, staged);
        });
        this.siteInspections$.next(siteInspections);
      });
      context = { manager, subscription };
      this.siteInspectionContextMap.set(siteId, context);
    }
    return context.manager;
  }

  endSiteInspection(siteId: number) {
    const context = this.siteInspectionContextMap.get(siteId);
    if (!context) {
      return;
    }
    const current = freeze(this.siteInspections$.value);
    const nextState = produce(current, draft => {
      draft.delete(siteId);
    });
    this.siteInspections$.next(nextState);
    context.subscription.unsubscribe();
    this.siteInspectionContextMap.delete(siteId);
  }

  getSiteInspectionManager(
    siteId: number,
  ): SiteInspectionManager<T> | undefined {
    return this.siteInspectionContextMap.get(siteId)?.manager;
  }
}
