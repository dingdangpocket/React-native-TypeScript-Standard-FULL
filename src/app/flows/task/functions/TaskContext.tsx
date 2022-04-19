/* eslint-disable @typescript-eslint/no-use-before-define */
/**
 * @file: TaskContext.tsx
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { SuspenseContentWrapper } from '@euler/app/components/SuspenseContentWrapper';
import { TaskManager } from '@euler/app/flows/task/functions/task-detail/TaskManager';
import { useSystemMetrics } from '@euler/functions';
import { TaskDetail } from '@euler/model/task-detail';
import { useServiceFactory } from '@euler/services/factory';
import { useBehaviorSubject, useObservable } from '@euler/utils/hooks';
import {
  createContext,
  FC,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';

export type TaskContextProps = {
  taskNo: string;
  detail: TaskDetail;
  taskManager: TaskManager;
  isRefreshing: boolean;
  fetchDetail: (silent?: boolean) => void;
};

export const getTaskResourceNamespace = (taskNo: string) => {
  return `tasks:${taskNo}`;
};

export const geteTaskDetailResourceId = (taskNo: string) => {
  return `${getTaskResourceNamespace(taskNo)}:detail`;
};

export const TaskContext = createContext<TaskContextProps>(null as any);

export const useTaskContext = () => {
  return useContext(TaskContext);
};

export const TaskContextProvider: FC<{ taskNo: string }> = memo(props => {
  const resourceId = geteTaskDetailResourceId(props.taskNo);
  const { navBarHeight } = useSystemMetrics();
  return (
    <SuspenseContentWrapper
      resourceId={resourceId}
      errorMsg="加载工单信息失败"
      contentContainerStyle={{
        paddingTop: navBarHeight + 32,
      }}
    >
      <Content {...props} />
    </SuspenseContentWrapper>
  );
});

const Content: FC<{ taskNo: string }> = memo(({ taskNo, children }) => {
  const serviceFactory = useServiceFactory();

  const taskManager = useMemo(
    () => TaskManager.get(taskNo, serviceFactory),
    [taskNo, serviceFactory],
  );

  const resourceId = geteTaskDetailResourceId(taskNo);

  const detail = useObservable(taskManager.observable, resourceId);

  const [isRefreshing] = useBehaviorSubject(taskManager.refreshing$);

  const fetchDetail = useCallback(() => {
    taskManager.refresh();
  }, [taskManager]);

  const value = useMemo(
    () => ({ taskNo, detail, fetchDetail, isRefreshing, taskManager }),
    [detail, fetchDetail, isRefreshing, taskNo, taskManager],
  );

  useEffect(() => () => taskManager.stop(), [taskManager]);

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
});
