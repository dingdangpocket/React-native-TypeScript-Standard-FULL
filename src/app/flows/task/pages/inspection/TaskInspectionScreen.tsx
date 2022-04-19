/* eslint-disable @typescript-eslint/no-use-before-define */
import { SuspenseContentWrapper } from '@euler/app/components/SuspenseContentWrapper';
import { useTaskContext } from '@euler/app/flows/task/functions/TaskContext';
import { HiddenSiteBottomSheet } from '@euler/app/flows/task/pages/inspection/components/HiddenSiteBottomSheet';
import { InspectionNavHeader } from '@euler/app/flows/task/pages/inspection/components/InspectionNavHeader';
import { InspectionSiteGridView } from '@euler/app/flows/task/pages/inspection/components/InspectionSiteGrid';
import { InspectionSiteGridHeader } from '@euler/app/flows/task/pages/inspection/components/InspectionSiteGridHeader';
import { SiteInspectionBottomSheetFlow } from '@euler/app/flows/task/pages/inspection/site-inspection/SiteInspectionBottomSheetFlow';
import {
  SiteInspectionNavigatorContextProvider,
  useSiteInspectionNavigatorContext,
} from '@euler/app/flows/task/pages/inspection/site-inspection/SiteInspectionNavigator';
import { TaskNavParams } from '@euler/app/flows/task/TaskFlow';
import {
  useAdaptiveContainerWidth,
  useSystemMetrics,
  wrapNavigatorScreen,
} from '@euler/functions';
import {
  useInventory,
  useInventoryLookup,
} from '@euler/functions/useInventory';
import { VehicleInspectionFlow } from '@euler/model';
import { comparer, isNotNull } from '@euler/utils';
import { sorted, uniq } from '@euler/utils/array';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { SectionList, SectionListData } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import * as InspectionSiteGrid from './functions/InspectionSiteGrid';

type Props = {
  flow: VehicleInspectionFlow;
};

export const TaskInspectionScreen = wrapNavigatorScreen(
  (props: Props) => {
    return (
      <SuspenseContentWrapper
        ErrorBoundaryComponent={null}
        contentContainerStyle={{
          justifyContent: 'center',
        }}
      >
        <SiteInspectionNavigatorContextProvider>
          <Content {...props} />
        </SiteInspectionNavigatorContextProvider>
      </SuspenseContentWrapper>
    );
  },
  { headerShown: false },
);

const Content = memo(({ flow }: Props) => {
  const navigation = useNavigation<StackNavigationProp<TaskNavParams>>();
  const [inventory] = useInventory();
  const inventoryQuery = useInventoryLookup(inventory);

  const { detail } = useTaskContext();
  const [navHeaderHeight, setNavHeaderHeight] = useState(0);
  const [activeSectionForHiddenSites, setActiveSectionForHiddenSites] =
    useState<InspectionSiteGrid.GroupSection>();
  const activeIndex = useSharedValue(0);
  const listRef = useRef<SectionList>(null);
  const { safeAreaInsets } = useSystemMetrics();
  const width = useAdaptiveContainerWidth();

  const sections = useMemo(
    () =>
      InspectionSiteGrid.buildGroupSectionsFromTemplate(
        inventoryQuery,
        flow.template,
        detail.inspection.sites,
        detail.inspection.customIssues,
      ),
    [
      detail.inspection.customIssues,
      detail.inspection.sites,
      flow.template,
      inventoryQuery,
    ],
  );

  const scrollerItems = useMemo(() => sections.map(x => x.title), [sections]);

  const { siteInspectionFlow } = useSiteInspectionNavigatorContext();
  const presentSiteInspectionFlow = useCallback(
    (siteId: number) => {
      const site = inventoryQuery.getSiteById(siteId);
      if (!site) return;
      siteInspectionFlow.current?.present('_siteInspection', {
        site,
        onDone: () => {
          siteInspectionFlow.current?.finish();
        },
      });
    },
    [inventoryQuery, siteInspectionFlow],
  );

  const onSiteSelected = useCallback(
    (item: InspectionSiteGrid.ItemInfo) => {
      presentSiteInspectionFlow(item.siteId);
    },
    [presentSiteInspectionFlow],
  );

  const onHiddenSiteSelected = useCallback(
    (item: InspectionSiteGrid.ItemInfo) => {
      setActiveSectionForHiddenSites(undefined);
      presentSiteInspectionFlow(item.siteId);
    },
    [presentSiteInspectionFlow],
  );

  const onScrollerItemPress = useCallback((index: number) => {
    listRef.current?.scrollToLocation({ sectionIndex: index, itemIndex: 0 });
  }, []);

  const onSearchInputPress = useCallback(() => {
    const sites = uniq(
      sections.flatMap(x => x.data[0].items),
      x => x.siteId,
    );
    navigation.push('_inspectionSiteSearch', {
      sites,
      onSelect: item => {
        navigation.goBack();
        onSiteSelected(item);
      },
    });
  }, [navigation, onSiteSelected, sections]);

  return (
    <>
      <InspectionNavHeader
        activeIndex={activeIndex}
        scrollerItems={scrollerItems}
        onScrollerItemPress={onScrollerItemPress}
        onSearchInputPress={onSearchInputPress}
        onLayout={e => setNavHeaderHeight(e.nativeEvent.layout.height)}
      />
      <SectionList
        ref={listRef as any}
        contentContainerStyle={{
          paddingBottom: safeAreaInsets.bottom + 15,
        }}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        sections={sections}
        initialNumToRender={10}
        keyExtractor={x => x.groupId}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 95,
          minimumViewTime: 50,
        }}
        renderSectionHeader={({
          section,
        }: {
          section: SectionListData<
            InspectionSiteGrid.GroupSectionDataItem,
            InspectionSiteGrid.GroupSection
          >;
        }) => {
          return (
            <InspectionSiteGridHeader
              groupId={section.groupId}
              name={section.title}
              onMorePress={() => setActiveSectionForHiddenSites(section)}
            />
          );
        }}
        renderItem={({ item: section }) => (
          <InspectionSiteGridView
            items={section.items}
            width={width}
            onCellPress={onSiteSelected}
          />
        )}
        onViewableItemsChanged={({ viewableItems }) => {
          const visibleSectionIndics = sorted(
            uniq(
              viewableItems
                .filter(x => isNotNull(x.section))
                .map(x => {
                  const section = x.section! as InspectionSiteGrid.GroupSection;
                  return section.index;
                }),
              x => x,
            ),
            comparer,
          );
          activeIndex.value = visibleSectionIndics[0] ?? 0;
          // console.log(viewableItems);
        }}
      />
      <HiddenSiteBottomSheet
        show={activeSectionForHiddenSites != null}
        items={activeSectionForHiddenSites?.hiddenSites ?? []}
        topMargin={navHeaderHeight}
        onSelect={onHiddenSiteSelected}
        onDismiss={() => setActiveSectionForHiddenSites(undefined)}
      />
      <SiteInspectionBottomSheetFlow ref={siteInspectionFlow} />
    </>
  );
});
