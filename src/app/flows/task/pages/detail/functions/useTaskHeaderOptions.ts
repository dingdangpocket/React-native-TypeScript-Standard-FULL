/**
 * @file: useTaskHeaderOptions.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { useAppLoading } from '@euler/app/components/loading';
import { kMiniprogramSharingThumbnailImageUrl } from '@euler/assets';
import { config, envTypeToTag } from '@euler/config';
import { useServiceFactory } from '@euler/services/factory';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useCallback } from 'react';
import Toast from 'react-native-root-toast';
import * as WeChat from 'react-native-wechat-lib';

export const useTaskHeaderOptions = ({
  taskNo,
  licensePlateNo,
}: {
  taskNo: string;
  licensePlateNo: string;
}) => {
  const { showActionSheetWithOptions } = useActionSheet();
  const loading = useAppLoading();
  const { taskService } = useServiceFactory();

  const showActions = useCallback(() => {
    showActionSheetWithOptions(
      {
        options: ['分享微信小程序给车主', '分享微信小程序给服务顾问', '取消'],
        cancelButtonIndex: 2,
      },
      async buttonIndex => {
        if (buttonIndex === 0 || buttonIndex === 1) {
          const installed = await WeChat.isWXAppInstalled();
          if (!installed) {
            Toast.show('微信未安装', {
              duration: 1000,
              position: Toast.positions.BOTTOM,
            });
            return;
          }
          loading.show();
          try {
            const params = await taskService.getMiniprogramReportSharingParams(
              taskNo,
              {
                envTag:
                  config.environment === 'dev'
                    ? undefined
                    : envTypeToTag(config.environment),
                shareType: buttonIndex === 1 ? 'sa' : undefined,
              },
            );
            loading.hide();
            const resp = await WeChat.shareMiniProgram({
              webpageUrl: config.linking.url,
              userName: params.userName,
              path: params.pagePath,
              title: `${licensePlateNo}的车检报告`,
              hdImageUrl: kMiniprogramSharingThumbnailImageUrl,
              thumbImageUrl: kMiniprogramSharingThumbnailImageUrl,
              scene: 0,
            });
            if (resp.errCode) {
              console.error(resp.errStr);
              Toast.show('分享失败');
            }
          } catch (e) {
            loading.hide();
            console.error(e);
            Toast.show('获取分享参数失败');
          }
        }
      },
    );
  }, [
    showActionSheetWithOptions,
    loading,
    taskService,
    taskNo,
    licensePlateNo,
  ]);

  return { showActions };
};
