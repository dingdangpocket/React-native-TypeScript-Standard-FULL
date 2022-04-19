import { QrcodeSharingView } from '@euler/app/flows/task/components/QrcodeSharingView';
import { QrcodeSharing } from '@euler/app/flows/task/components/QrcodeSharingView.shared';
import { Center, Colors, StatusColors } from '@euler/components';
import { FontFamily } from '@euler/components/typography';
import { wrapNavigatorScreen } from '@euler/functions';
import { useServiceFactory } from '@euler/services/factory';
import { onErrorIgnore, useIsMobileLayout } from '@euler/utils';
import { base64EncodedDataFromDataURI } from '@euler/utils/base64EncodedDataFromDataURI';
import { makeTempFile } from '@euler/utils/fs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { CardStyleInterpolators } from '@react-navigation/stack';
import * as FileSystem from 'expo-file-system';
import {
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Platform,
  ScrollView,
  StyleProp,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import Toast from 'react-native-root-toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as WeChat from 'react-native-wechat-lib';

const ActionButton = memo(
  ({
    text,
    icon,
    style,
    onPress,
  }: {
    text: string;
    icon: ReactNode;
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
  }) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        css={`
          align-items: center;
          justify-content: center;
        `}
        style={style}
      >
        <Center
          css={`
            width: 56px;
            height: 56px;
            border-radius: 10px;
            background-color: #fff;
          `}
        >
          {icon}
        </Center>
        <Text
          css={`
            font-family: ${FontFamily.NotoSans.Light};
            font-size: 10px;
            color: ${Colors.Gray1};
            margin-top: 8px;
          `}
        >
          {text}
        </Text>
      </TouchableOpacity>
    );
  },
);

const kSpacing = 30;

export const QrcodeSharingScreen = wrapNavigatorScreen(
  ({
    taskNo,
    licensePlateNo,
    storeName,
    top,
  }: {
    taskNo: string;
    licensePlateNo: string;
    storeName: string;
    top?: number;
  }) => {
    const isMobileLayout = useIsMobileLayout();
    const dimension = useWindowDimensions();
    const safeAreaInsets = useSafeAreaInsets();
    const navigation = useNavigation();
    const width =
      isMobileLayout || dimension.width <= 375 ? dimension.width : 375;
    const cardWidth = width - 2 * kSpacing;
    const cardHeight = Math.round((cardWidth * 500) / 375);
    const { taskService } = useServiceFactory();
    const [model, setModel] = useState<QrcodeSharing.Model>();
    const qrcodeSharing = useRef<QrcodeSharing.QrcodeSharingAPI>(null);

    useEffect(() => {
      taskService
        .getSubscribeBindQrcodeImageUrl(taskNo, {
          logo: false,
          size: cardWidth,
          __fake__: true,
        })
        .then(qrcodeUrl => {
          console.log(qrcodeUrl);
          setModel({
            title: '长按识别二维码绑定车辆',
            subTitle: '获取车辆检测/施工报告',
            licensePlateNo,
            storeName,
            qrcodeUrl,
          });
        })
        .catch(onErrorIgnore);
    }, [cardWidth, licensePlateNo, storeName, taskNo, taskService]);

    const widthStyle =
      width === dimension.width
        ? undefined
        : {
            width,
          };

    const onSaveToPhotoAlbum = useCallback(async () => {
      try {
        if (!qrcodeSharing.current) return;
        const dataURI = await qrcodeSharing.current.toDataURI(
          'image/jpeg',
          0.85,
        );
        if (dataURI) {
          qrcodeSharing.current
            .save(dataURI)
            .then(() => {
              navigation.goBack();
              Toast.show('已保存图片到本地', {
                duration: 1500,
                position: Toast.positions.BOTTOM,
              });
            })
            .catch(e => {
              console.error(e);
              Toast.show('保存失败', {
                duration: 500,
                position: Toast.positions.CENTER,
              });
            });
        }
      } catch (e) {
        console.error('failed to generate qrcode sharing image: ', e);
        alert('保存图片失败, 请稍候重试!');
      }
    }, [navigation]);

    const onShareToWx = useCallback(async () => {
      if (!qrcodeSharing.current) return;

      if (Platform.OS === 'web') {
        Toast.show('暂不支持浏览器分享', {
          duration: 500,
          position: Toast.positions.BOTTOM,
        });
        return;
      }

      if (!(await WeChat.isWXAppInstalled())) {
        Toast.show('未安装微信', {
          duration: 500,
          position: Toast.positions.BOTTOM,
        });
        return;
      }

      try {
        const dataURI = await qrcodeSharing.current.toDataURI('image/jpeg', 1);
        if (!dataURI) {
          Toast.show('生成图片失败', {
            duration: 1500,
            position: Toast.positions.BOTTOM,
          });
          return;
        }

        const [data] = base64EncodedDataFromDataURI(dataURI)!;
        const imageUrl = await makeTempFile('.jpeg');
        await FileSystem.writeAsStringAsync(imageUrl, data, {
          encoding: 'base64',
        });

        await WeChat.shareLocalImage({
          imageUrl: imageUrl.replace('file://', ''),
          scene: 0,
        });

        navigation.goBack();

        Toast.show('分享成功', {
          duration: 1000,
          position: Toast.positions.BOTTOM,
        });

        await FileSystem.deleteAsync(imageUrl);
      } catch (e) {
        console.error(e);
        Toast.show('分享失败', {
          duration: 1500,
          position: Toast.positions.BOTTOM,
        });
      }
    }, [navigation]);

    return (
      <View
        css={`
          flex: 1;
          background-color: rgba(0, 0, 0, 0.9);
        `}
        style={widthStyle ? { alignItems: 'center' } : undefined}
      >
        <ScrollView
          css={`
            flex: 1;
          `}
          style={widthStyle}
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: (top ?? safeAreaInsets.top + 44) + 15,
          }}
        >
          <View
            css={`
              flex: 1;
              align-items: center;
            `}
          >
            {
              <View
                css={`
                  width: ${cardWidth}px;
                  height: ${cardHeight}px;
                  background-color: #fff;
                  border-radius: 10px;
                  overflow: hidden;
                `}
              >
                {model ? (
                  <QrcodeSharingView
                    ref={qrcodeSharing}
                    model={model}
                    width={cardWidth}
                    height={cardHeight}
                  />
                ) : null}
              </View>
            }
          </View>
        </ScrollView>
        <View
          css={`
            background-color: #fff;
            align-self: stretch;
          `}
        >
          <View
            css={`
              flex-direction: row;
              align-items: center;
              justify-content: center;
              background-color: ${Colors.Gray9};
              padding: 16px;
            `}
          >
            <ActionButton
              text="分享给好友"
              icon={
                <MaterialCommunityIcons
                  name="share"
                  size={32}
                  color={StatusColors.Success}
                />
              }
              onPress={onShareToWx}
            />
            <ActionButton
              text="保存到相册"
              icon={
                <Ionicons name="download-outline" size={24} color="black" />
              }
              css={`
                margin-left: 48px;
              `}
              onPress={onSaveToPhotoAlbum}
            />
          </View>
          <View
            css={`
              padding-bottom: ${safeAreaInsets.bottom}px;
              background-color: #fff;
            `}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              css={`
                height: 44px;
                align-items: center;
                justify-content: center;
              `}
            >
              <Text
                css={`
                  font-family: ${FontFamily.NotoSans.Light};
                  font-size: 14px;
                  color: #000;
                `}
              >
                取消
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  },
  {
    presentation: 'transparentModal',
    animationEnabled: true,
    headerShown: false,
    cardOverlayEnabled: true,
    cardStyle: {
      backgroundColor: 'transparent',
    },
    cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
  },
);
