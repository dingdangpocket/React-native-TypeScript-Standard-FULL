import { SafeHaptics } from '@euler/utils';
import * as Clipboard from 'expo-clipboard';
import { FC, memo, useCallback } from 'react';
import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import Toast from 'react-native-root-toast';
import { LinkingIcon } from '../icons/LinkingIcon';
import { WechatIcon } from '../icons/WechatIcon';

interface Props {
  isVisible: boolean;
  onClose?: () => void;
  title?: string;
  codeUrl: ImageSourcePropType;
  url?: string;
  head?: string;
}

const QrcodeSharingModal: FC<Props> = memo(props => {
  const { onClose, url } = props;
  const { width, height } = useWindowDimensions();

  const onCopy = useCallback(() => {
    if (!url) return;
    Clipboard.setString(url);
    onClose?.();
    Toast.show('已复制', {
      duration: 800,
      position: 300,
    });
    SafeHaptics.impact();
  }, [onClose, url]);

  const onShareToWechat = useCallback(() => {
    // todo: something
  }, []);
  return (
    <Modal
      isVisible={props.isVisible}
      css={`
        margin-left: 0px;
      `}
    >
      <TouchableOpacity
        onPress={props.onClose}
        css={`
          height: ${height * 0.6}px;
          justify-content: center;
          align-items: center;
        `}
      />
      <View
        css={`
          height: 420px;
          width: ${width}px;
          background-color: white;
          justify-content: center;
          align-items: center;
        `}
      >
        <View
          css={`
            height: 210px;
            justify-content: center;
            align-items: center;
          `}
        >
          <Text>{props.title}</Text>
          <Image
            source={props.codeUrl}
            resizeMode="contain"
            css={`
              height: 150px;
              width: 150px;
              margin-top: 5px;
            `}
          ></Image>
        </View>

        <View
          css={`
            height: 210px;
            width: 340px;
            flex-direction: row;
            justify-content: space-around;
          `}
        >
          <TouchableOpacity onPress={onShareToWechat}>
            <WechatIcon
              size={60}
              css={`
                margin-top: 10px;
                margin-left: 10px;
              `}
            />
            <Text
              css={`
                margin-left: 10px;
              `}
            >
              微信好友
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onCopy}>
            <LinkingIcon
              size={60}
              css={`
                margin-top: 10px;
                margin-right: 10px;
              `}
            />
            <Text
              css={`
                margin-right: 10px;
              `}
            >
              复制链接
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
});

export default QrcodeSharingModal;
