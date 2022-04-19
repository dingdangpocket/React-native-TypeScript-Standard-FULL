import { DeliveryCheckReportView } from '@euler/app/flows/report/components/DeliveryCheckReportView';
import { ReportContent } from '@euler/app/flows/report/components/ReportContent';
import { isDeliveryCheckReportEmpty } from '@euler/app/flows/report/functions';
import { wrapNavigatorScreen } from '@euler/functions';
import { VehicleReportProjection } from '@euler/model/report';
import { ReportTabKey } from '@euler/model/viewmodel';

const projection: VehicleReportProjection = { deliveryCheck: true };

export const DeliveryCheckReportScreen = wrapNavigatorScreen(
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
        isEmpty={isDeliveryCheckReportEmpty}
      >
        {report => <DeliveryCheckReportView report={report} />}
      </ReportContent>
    );
  },
  props => ({
    title: props.route.params?.title ?? '交车报告',
  }),
);
