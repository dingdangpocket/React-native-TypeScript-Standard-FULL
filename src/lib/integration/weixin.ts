/**
 * @file: weixin.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { config } from '@euler/config';
import { makeDebug } from '@euler/utils';
import { useEffect } from 'react';
import * as WeChat from 'react-native-wechat-lib';
const debug = makeDebug('integration:weixin');

export const useWeixinIntegration = () => {
  useEffect(() => {
    WeChat.registerApp(config.weixinOpen.appId, config.weixinOpen.linking)
      .then(() => {
        debug('weixin open sdk successfully integrated');
      })
      .catch(err => {
        debug('weixin open sdk integration failed: ', err);
      });
  }, []);
};
