import { LayoutProviderView } from '@euler/app/components/layout/LayoutProvider';
import { TaskTimeline } from '@euler/app/flows/task/components/TaskTimeline';
import { useTaskContext } from '@euler/app/flows/task/functions/TaskContext';
import { wrapNavigatorScreen } from '@euler/functions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const TaskTimelineScreen = wrapNavigatorScreen(
  () => {
    const insets = useSafeAreaInsets();
    const { taskNo } = useTaskContext();
    return (
      <LayoutProviderView
        css={`
          flex: 1;
          background-color: #fff;
          margin: 10px;
          border-radius: 5px;
          padding: 15px 0;
          margin-bottom: ${insets.bottom + 10}px;
        `}
      >
        <TaskTimeline taskNo={taskNo} />
      </LayoutProviderView>
    );
  },
  { title: '进度详情' },
);
