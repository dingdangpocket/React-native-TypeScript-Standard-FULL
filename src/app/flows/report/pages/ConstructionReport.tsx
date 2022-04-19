import { ContructionReportView } from '@euler/app/flows/report/components/ContructionReportView';
import { ReportContent } from '@euler/app/flows/report/components/ReportContent';
import { isConstructionReportEmpty } from '@euler/app/flows/report/functions';
import { wrapNavigatorScreen } from '@euler/functions';
import { VehicleReportProjection } from '@euler/model/report';
import { ReportTabKey } from '@euler/model/viewmodel';

const projection: VehicleReportProjection = { construction: true };

export const ConstructionReportScreen = wrapNavigatorScreen(
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
        isEmpty={isConstructionReportEmpty}
      >
        {report => <ContructionReportView report={report} />}
      </ReportContent>
    );
  },
  props => ({
    title: props.route?.params.title ?? '施工报告',
  }),
);
