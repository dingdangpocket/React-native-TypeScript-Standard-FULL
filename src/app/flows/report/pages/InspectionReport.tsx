import { InspectionReportView } from '@euler/app/flows/report/components/InspectionReportView';
import { ReportContent } from '@euler/app/flows/report/components/ReportContent';
import { isInspectionReportEmpty } from '@euler/app/flows/report/functions';
import { wrapNavigatorScreen } from '@euler/functions';
import { VehicleReportProjection } from '@euler/model/report';
import { ReportTabKey } from '@euler/model/viewmodel';

const projection: VehicleReportProjection = {
  inspection: true,
  obdInspection: true,
  diagnostic: true,
};

export const InspectionReportScreen = wrapNavigatorScreen(
  ({
    taskNo,
  }: {
    title?: string;
    taskNo: string;
  } & { [p in ReportTabKey]?: boolean }) => {
    return (
      <ReportContent
        taskNo={taskNo}
        projection={projection}
        isEmpty={isInspectionReportEmpty}
      >
        {report => <InspectionReportView report={report} />}
      </ReportContent>
    );
  },
  props => ({
    title: props.route.params?.title ?? '检测报告',
  }),
);
