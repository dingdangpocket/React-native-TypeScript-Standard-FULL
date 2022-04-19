import Cell from '@euler/app/components/Cell';
import { useAppLoading } from '@euler/app/components/loading';
import { AccountSafeIcon } from '@euler/app/flows/settings/icons/AccountSafeIcon';
import { CleanCacheIcon } from '@euler/app/flows/settings/icons/CleanCacheIcon';
import { InviteCollegueIcon } from '@euler/app/flows/settings/icons/InviteCollegueIcon';
import { ShareIcon } from '@euler/app/flows/settings/icons/ShareIcon';
import { UserIcon } from '@euler/app/flows/settings/icons/UserIcon';
import { AppNavParams, PlaygroundNavParams } from '@euler/app/Routes';
import { wrapNavigatorScreen } from '@euler/functions';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useState } from 'react';
import { ScrollView } from 'react-native';
import QrcodeSharingModal from './components/QrcodeSharingModal';

interface ModelDilogProps {
  head: string;
  codeUrl: any;
  title: string;
  url: string;
}

type SharingType = 'invite' | 'app';

const SharingModalInfo: { [p in SharingType]: ModelDilogProps } = {
  invite: {
    head: '新员工扫码注册',
    codeUrl: '', //
    title: '邀请新员工加入',
    url: '', //
  },
  app: {
    head: '扫一扫安装知车智检',
    codeUrl: require('./assets/chituCode.png'), //
    title: '分享应用给好友',
    url: 'http://demo.com', //
  },
};

async function getInviteInfo(): Promise<{ qrcode: string; url: string }> {
  await sleep(1000);
  return {
    qrcode: require('./assets/chituCode.png'),
    url: 'https://demo.com/',
  };
}

export const SettingsScreen = wrapNavigatorScreen(
  () => {
    const navigation =
      useNavigation<StackNavigationProp<AppNavParams & PlaygroundNavParams>>();

    const navigateToProfile = () => {
      navigation.push('Profile');
    };

    const navigateToAccountSafe = () => {
      navigation.push('AccountSafe');
    };

    const appLoading = useAppLoading();

    const [modalData, setModalData] = useState<ModelDilogProps>();

    const onClose = useCallback(() => {
      setModalData(undefined);
    }, []);

    const onInvite = useCallback(async () => {
      try {
        appLoading.show();
        const { url, qrcode } = await getInviteInfo();
        setModalData({
          ...SharingModalInfo.invite,
          codeUrl: qrcode,
          url,
        });
      } catch (e) {
        console.error(e);
        alert((e as Error).message);
      } finally {
        appLoading.hide();
      }
    }, [appLoading]);

    return (
      <ScrollView
        css={`
          flex: 1;
          background: rgb(220, 220, 220);
        `}
      >
        <Cell
          leftIcon={UserIcon}
          title={'个人信息'}
          value={'张三'}
          onPress={navigateToProfile}
        />
        <Cell
          leftIcon={AccountSafeIcon}
          title={'账号安全'}
          onPress={navigateToAccountSafe}
        />
        <Cell title={'清除缓存'} value={'-'} leftIcon={CleanCacheIcon} />
        <Cell
          leftIcon={InviteCollegueIcon}
          title={'邀请新员工加入'}
          onPress={onInvite}
        />
        <Cell
          title={'分享应用给好友'}
          leftIcon={ShareIcon}
          onPress={() => setModalData(SharingModalInfo.app)}
        />
        <QrcodeSharingModal
          title={modalData?.title ?? ''}
          head={modalData?.head ?? ''}
          codeUrl={modalData?.codeUrl ?? ''}
          url={modalData?.url ?? ''}
          isVisible={modalData != null}
          onClose={onClose}
        />
      </ScrollView>
    );
  },
  {
    title: '设置',
  },
);
