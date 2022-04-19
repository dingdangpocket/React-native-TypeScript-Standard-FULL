import { LayoutProviderView } from '@euler/app/components/layout/LayoutProvider';
import { useReportData } from '@euler/app/flows/report/functions';
import { Colors } from '@euler/components';
import { EmptyView } from '@euler/components/EmptyView';
import { VehicleReport, VehicleReportProjection } from '@euler/model/report';
import { FC, memo, ReactNode } from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const ReportContent: FC<{
  taskNo: string;
  projection: VehicleReportProjection;
  isEmpty: (report: VehicleReport) => boolean;
  children: ReactNode | ((report: VehicleReport) => ReactNode);
}> = memo(({ taskNo, projection, isEmpty, children }) => {
  const insets = useSafeAreaInsets();
  const { loading, data, error, refresh } = useReportData(taskNo, projection);

  if (!data || isEmpty(data)) {
    return (
      <ScrollView
        css={`
          flex: 1;
        `}
        contentContainerStyle={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {!data && loading ? (
          <ActivityIndicator color={Colors.Gray2} />
        ) : !data && error ? (
          <EmptyView
            error={error}
            message={__DEV__ ? error.message : '获取报告失败，请稍候重试'}
            onRetry={refresh}
          />
        ) : (
          <EmptyView message="暂无相关报告数据" onRetry={refresh} />
        )}
      </ScrollView>
    );
  }

  return (
    <LayoutProviderView
      css={`
        flex: 1;
        padding-bottom: ${insets.bottom + 10}px;
      `}
    >
      {typeof children === 'function' ? children(data) : children}
    </LayoutProviderView>
  );
});
