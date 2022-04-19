import { AppNavParams } from '@euler/app/Routes';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FC, memo } from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
type Props = {
  imageRes: string | null | undefined;
  onPress?: () => void;
};

export const SignatureCard: FC<Props> = memo(({ imageRes, onPress }) => {
  const { width } = useWindowDimensions();
  const navigation = useNavigation<StackNavigationProp<AppNavParams | any>>();
  return (
    <>
      <View>
        {imageRes != null ? (
          <TouchableOpacity
            onPress={() =>
              navigation.push('PreinspectionFailurePreview', {
                sitePath: imageRes,
              })
            }
          >
            <Image
              resizeMode="contain"
              css={`
                width: ${width}px;
                height: 240px;
                background: rgb(240, 240, 240);
              `}
              source={{ uri: imageRes }}
            />
          </TouchableOpacity>
        ) : (
          <View
            css={`
              height: 150px;
              align-items: center;
              justify-content: center;
              flex-direction: row;
            `}
          >
            <TouchableOpacity
              onPress={() => onPress?.()}
              css={`
                height: 68px;
                width: 207px;
                align-items: center;
                justify-content: center;
                flex-direction: row;
                border-width: 2px;
                border-style: dotted;
              `}
            >
              <Text>点击签名</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );
});
