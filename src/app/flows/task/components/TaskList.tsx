import { useOrderContext } from '@euler/app/flows/order/functions/OrderContext';
import { SegmentControl } from '@euler/components';
import { EmptyView } from '@euler/components/EmptyView';
import { useInfiniteList } from '@euler/functions';
import { VehicleInspectionTask } from '@euler/model/entity';
import { DateSegmentItem } from '@euler/model/viewmodel';
import { useServiceFactory } from '@euler/services/factory';
import { onErrorIgnore } from '@euler/utils';
import { dateSegmentToRange } from '@euler/utils/datetime';
import { usePrevious } from '@euler/utils/hooks';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RefreshControl, StyleProp, View, ViewStyle } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FooterView } from './FooterView';
import { Header } from './Header';
import { TaskListItem } from './TaskListItem';

export const TaskList = memo(
  ({
    style,
    columns,
    limit,
    onTaskPress,
  }: {
    style?: StyleProp<ViewStyle>;
    columns?: number;
    limit: number;
    onTaskPress?: (task: VehicleInspectionTask) => void;
  }) => {
    const ref = useRef<FlatList<VehicleInspectionTask>>(null);

    const {
      dateSegments,
      selectedSegmentIndex,
      data,
      isLoading,
      isRefreshing,
      error,
      hasMore,
      fetch,
      fetchSinceLastError,
      onDateSegmentChange,
      onScrollToBottom,
    } = useTaskList({
      limit,
      onRefresh: () => {
        if (!ref.current) return;
        ref.current.scrollToOffset({ animated: false, offset: 0 });
      },
    });

    const segments = useMemo(
      () => dateSegments.map(x => x.text),
      [dateSegments],
    );

    const safeAreaInsets = useSafeAreaInsets();
    const tabHeight = useBottomTabBarHeight();

    const onRefresh = useCallback(() => {
      fetch().catch(onErrorIgnore);
    }, [fetch]);

    return (
      <View
        css={`
          padding-left: ${safeAreaInsets.left}px;
          padding-right: ${safeAreaInsets.right}px;
          padding-top: ${safeAreaInsets.top}px;
          padding-bottom: 0;
          background-color: #eee;
        `}
        style={style}
      >
        <Animated.View>
          <Header />
          <SegmentControl
            segments={segments}
            selectedIndex={selectedSegmentIndex}
            onSelectedIndexChange={onDateSegmentChange}
            css={`
              margin: 5px 15px 5px 15px;
            `}
          />
        </Animated.View>
        <View
          css={`
            flex: 1;
            overflow: visible;
          `}
        >
          <FlatList
            ref={ref}
            data={data}
            numColumns={columns}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: tabHeight + safeAreaInsets.bottom,
            }}
            keyExtractor={(x: VehicleInspectionTask) => String(x.id)}
            refreshing={isRefreshing}
            refreshControl={<RefreshControl refreshing={isRefreshing} />}
            onRefresh={onRefresh}
            onEndReachedThreshold={0.3}
            onEndReached={onScrollToBottom}
            renderItem={item => (
              <TaskListItem
                task={item.item}
                style={columns ? { flex: 1 / columns } : undefined}
                onPress={onTaskPress}
              />
            )}
            ListEmptyComponent={<EmptyView error={error} onRetry={onRefresh} />}
            ListFooterComponent={
              <FooterView
                isLoading={isLoading && !isRefreshing}
                total={data.length}
                error={error}
                hasMore={hasMore}
                onRetry={fetchSinceLastError}
                space={safeAreaInsets.bottom}
              />
            }
            css={`
              flex: 1;
              padding-top: 8px;
            `}
          />
        </View>
      </View>
    );
  },
);

function useDateSegments() {
  return useMemo<DateSegmentItem[]>(
    () => [
      {
        type: 'offset',
        unit: 'day',
        text: '今日',
        value: 0,
      },
      {
        type: 'offset',
        unit: 'day',
        text: '近3日',
        value: -2,
      },
      {
        type: 'offset',
        unit: 'day',
        text: '近7日',
        value: -6,
      },
    ],
    [],
  );
}

function useTaskList({
  limit,
  onRefresh,
}: {
  limit: number;
  onRefresh: () => void;
}) {
  const dateSegments = useDateSegments();
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState(0);
  const dateRange = useMemo(
    () => dateSegmentToRange(dateSegments[selectedSegmentIndex]),
    [dateSegments, selectedSegmentIndex],
  );

  const { taskService } = useServiceFactory();

  const query = useCallback(
    async (offset: number) => {
      return await taskService.list(
        dateRange.startDate,
        dateRange.endDate,
        offset,
        limit,
      );
    },
    [taskService, dateRange, limit],
  );

  const { fetch, fetchMore, fetchSinceLastError, ...list } = useInfiniteList({
    limit,
    query,
  });

  const onScrollToBottom = useCallback(() => {
    fetchMore().catch(onErrorIgnore);
  }, [fetchMore]);

  const onDateSegmentChange = useCallback((index: number) => {
    setSelectedSegmentIndex(index);
  }, []);

  const prevDateRange = usePrevious(dateRange);

  useEffect(() => {
    if (
      prevDateRange?.startDate !== dateRange.startDate ||
      prevDateRange?.endDate !== dateRange.endDate
    ) {
      onRefresh();
      setTimeout(() => {
        fetch().catch(onErrorIgnore);
      }, 100);
    }
  }, [dateRange, prevDateRange, fetch, onRefresh]);

  const orderContext = useOrderContext();
  useEffect(() => {
    // go to the today's segment and refresh the task list when order placed.
    const sub = orderContext.orderCreationSuccessful.subscribe(
      (orderNo: string) => {
        console.log('new order creation successful with order no: ', orderNo);
        if (selectedSegmentIndex !== 0) {
          setSelectedSegmentIndex(0);
        } else {
          onRefresh();
          setTimeout(() => {
            fetch().catch(onErrorIgnore);
          }, 100);
        }
      },
    );
    return () => sub.unsubscribe();
  }, [fetch, onRefresh, orderContext, selectedSegmentIndex]);

  return {
    dateSegments,
    selectedSegmentIndex,
    onDateSegmentChange,
    onScrollToBottom,
    onRefresh,
    fetch,
    fetchMore,
    fetchSinceLastError,
    ...list,
  };
}
