import { ReportContent } from '@euler/app/flows/report/components/ReportContent';
import { isPreInspectionReportEmpty } from '@euler/app/flows/report/functions';
import { wrapNavigatorScreen } from '@euler/functions';
import { VehicleReportProjection } from '@euler/model/report';
import { ReportTabKey } from '@euler/model/viewmodel';
import { PreInspectionReportView } from '../components/PreInspectionReportView';

const projection: VehicleReportProjection = { preInspection: true };

export const PreInspectionReportScreen = wrapNavigatorScreen(
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
        isEmpty={isPreInspectionReportEmpty}
      >
        {report => <PreInspectionReportView report={report} />}
      </ReportContent>
    );
  },
  props => ({
    title: props.route.params?.title ?? '预检报告',
  }),
);
