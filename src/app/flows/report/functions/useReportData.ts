/**
 * @file: useReportData.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { VehicleReport, VehicleReportProjection } from '@euler/model/report';
import { useServiceFactory } from '@euler/services/factory';
import { onErrorIgnore } from '@euler/utils';
import { useCallback, useEffect, useState } from 'react';

type State = {
  loading: boolean;
  data?: VehicleReport;
  error?: Error;
};

export function isPreInspectionReportEmpty(report: VehicleReport) {
  return !(report.preInspection?.items.length ?? !report.dashboardImgUrl);
}

export function isInspectionReportEmpty(report: VehicleReport) {
  return !(
    report.inspection?.items.length ??
    report.obdInspection?.troubleCodes?.length
  );
}

export function isConstructionReportEmpty(report: VehicleReport) {
  return !report.construction?.items.length;
}

export function isDeliveryCheckReportEmpty(report: VehicleReport) {
  return !report.deliveryCheck?.items.length;
}

export function useReportData(
  taskNo: string,
  projection: VehicleReportProjection,
) {
  const { taskService } = useServiceFactory();
  const [state, setState] = useState<State>({ loading: true });
  const load = useCallback(
    async (current?: VehicleReport) => {
      setState({ loading: true, data: current });
      try {
        const report = await taskService.getReportWithPendingData(
          taskNo,
          projection,
        );
        setState({ loading: false, data: report });
      } catch (e) {
        console.error(e);
        setState({ loading: false, data: current, error: e as Error });
      }
    },
    [projection, taskNo, taskService],
  );

  const refresh = useCallback(() => {
    load(state.data).catch(onErrorIgnore);
  }, [load, state]);

  useEffect(() => {
    load().catch(onErrorIgnore);
  }, [load]);

  return {
    loading: state.loading,
    data: state.data,
    error: state.error,
    refresh,
  };
}
