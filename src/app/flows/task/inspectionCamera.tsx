import { CameraView } from '@euler/app/components/media/camera/CameraView';
import { TaskNavParams } from '@euler/app/flows/task/TaskFlow';
import { AppNavParams } from '@euler/app/Routes';
import { wrapNavigatorScreen } from '@euler/functions';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native';

interface Props {
  troubleLampCamera?: boolean;
  vehiclePreInspectionCamera?: boolean;
  otherSitePreinspectionCamera?: boolean;
  deliveryCamera?: boolean;
  itemId?: string;
}

export const InspectionCameraScreen = wrapNavigatorScreen(
  (props: Props) => {
    const navigation =
      useNavigation<StackNavigationProp<AppNavParams | TaskNavParams | any>>();
    const onPhotoCaptured = (res: any) => {
      if (props.deliveryCamera) {
        navigation.navigate('InspectionImageEdit', {
          res: res.file.path,
          buttonArray: ['检查合格', '达到上限', '已修复', '已更换'],
          backTo: 'DeliveryInspection',
          itemId: props.itemId,
        });
        return;
      }
      if (props.troubleLampCamera) {
        navigation.navigate('PreInspection', { res: res.file.path });
        return;
      }
      if (props.vehiclePreInspectionCamera) {
        navigation.navigate('InspectionImageEdit', {
          res: res.file.path,
          buttonArray: ['划痕', '凹陷', '掉漆', '破损', '进水', '脏污'],
          backTo: 'PreInspection',
        });
        return;
      }
      if (props.otherSitePreinspectionCamera) {
        navigation.navigate('InspectionImageEdit', {
          res: res.file.path,
          buttonArray: ['划痕', '凹陷', '掉漆', '破损', '进水', '脏污'],
          backTo: 'PreInspection',
        });
        return;
      }
    };
    return (
      <SafeAreaView
        css={`
          flex: 1;
        `}
      >
        <CameraView
          statusBar={false}
          maxDuration={15000}
          initialOpacity={1}
          onDismiss={() => navigation.goBack()}
          onCaptured={onPhotoCaptured}
          css={`
            flex: 1;
          `}
        />
      </SafeAreaView>
    );
  },
  {
    headerShown: false,
    cardStyle: {
      backgroundColor: '#000',
    },
  },
);
