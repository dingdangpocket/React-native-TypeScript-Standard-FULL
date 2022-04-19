import {
  LayoutProviderView,
  useContainerLayout,
} from '@euler/app/components/layout/LayoutProvider';
import { MediaCarousel } from '@euler/app/components/media/MediaCarousel';
import { VehicleFacadeBirdView } from '@euler/app/flows/report/components/VehicleFacadeBirdView';
import {
  ResultGroup,
  usePreInspectionResults,
} from '@euler/app/flows/report/functions/usePreInspectionResults';
import { FontFamily } from '@euler/components/typography';
import { getDefectiveLevelColor } from '@euler/functions';
import { FacadeSiteConfig } from '@euler/model';
import { MediaObject } from '@euler/model/MediaObject';
import { VehicleReport } from '@euler/model/report';
import { FC, memo, ReactNode, useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useTheme } from 'styled-components/native';

export const DashboardImageView = memo(
  ({ report }: { report: VehicleReport }) => {
    const medias = useMemo<MediaObject[]>(
      () => [{ type: 'image', id: '', url: report.dashboardImgUrl ?? '' }],
      [report.dashboardImgUrl],
    );
    if (!report.dashboardImgUrl) return null;
    return (
      <MediaCarousel
        medias={medias}
        scrollEnabled={false}
        //TouchableComponent={TouchableOpacity}
        css={`
          flex: 1;
        `}
      />
    );
  },
);

export const PreInspectionResultsView = memo(
  ({
    groups,
    normalSites,
  }: {
    groups: ResultGroup[];
    normalSites: FacadeSiteConfig[];
  }) => {
    const theme = useTheme();
    const { width } = useContainerLayout();
    const mediaHeight = width * 0.75;

    return (
      <>
        {groups.map(group => (
          <View key={group.name}>
            <View
              css={`
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                padding: 10px 0;
              `}
            >
              <Text
                css={`
                  font-family: ${FontFamily.NotoSans.Medium};
                  font-size: 16px;
                `}
              >
                {group.name ?? ''}
              </Text>
              <Text
                css={`
                  font-family: ${FontFamily.NotoSans.Regular};
                  font-size: 14px;
                  color: ${getDefectiveLevelColor(theme, group.defectiveLevel)};
                `}
              >
                异常
              </Text>
            </View>
            <MediaCarousel
              medias={group.medias}
              css={`
                height: ${mediaHeight}px;
              `}
            />
          </View>
        ))}
        {normalSites.map(site => (
          <View
            key={site.code}
            css={`
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
            `}
          >
            <Text
              css={`
                font-family: ${FontFamily.NotoSans.Bold};
                font-size: 14px;
              `}
            >
              {site.name}外观
            </Text>
            <Text
              css={`
                font-family: ${FontFamily.NotoSans.Regular};
                font-size: 14px;
                color: ${theme.colors.defectiveLevel.fine};
              `}
            >
              良好
            </Text>
          </View>
        ))}
      </>
    );
  },
);

const Section: FC<{
  title?: ReactNode;
}> = memo(({ title, children }) => {
  const theme = useTheme();
  return (
    <View
      css={`
        background-color: ${theme.section.background};
        margin-top: 10px;
      `}
    >
      {typeof title === 'string' ? (
        <Text
          css={`
            align-self: center;
            margin: 10px;
            font-family: ${FontFamily.NotoSans.Medium};
            font-size: 17px;
          `}
        >
          {title}
        </Text>
      ) : (
        title
      )}
      {children}
    </View>
  );
});

export const PreInspectionReportView = memo(
  ({ report }: { report: VehicleReport }) => {
    const { overlays, groupsWithIssues, normalSites } = usePreInspectionResults(
      report.preInspection,
    );

    const { width } = useContainerLayout();
    return (
      <ScrollView
        css={`
          flex: 1;
        `}
      >
        {report.dashboardImgUrl ? (
          <Section title="仪表盘信息">
            <View
              css={`
                height: ${(width - 20) * 0.75}px;
                padding: 0 10px;
                padding-bottom: 10px;
              `}
            >
              <LayoutProviderView
                css={`
                  flex: 1;
                `}
              >
                <DashboardImageView report={report} />
              </LayoutProviderView>
            </View>
          </Section>
        ) : null}

        <Section title="车辆外观状态">
          <VehicleFacadeBirdView overlays={overlays} size={width - 20} />
        </Section>

        <Section>
          <View
            css={`
              padding: 0 10px;
            `}
          >
            <LayoutProviderView>
              <PreInspectionResultsView
                groups={groupsWithIssues}
                normalSites={normalSites}
              />
            </LayoutProviderView>
          </View>
        </Section>
      </ScrollView>
    );
  },
);
