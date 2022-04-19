import { AppNavParams } from '@euler/app/Routes';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
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

export const DashbordImageCard: FC<Props> = memo(({ imageRes, onPress }) => {
  const navigation = useNavigation<StackNavigationProp<AppNavParams | any>>();
  const { width } = useWindowDimensions();
  return (
    <>
      {imageRes == null ? (
        <View
          css={`
            height: 259px;
            background: #f1f1f1;
            align-items: center;
            justify-content: center;
            margin-top: 15px;
            margin-left: 10px;
            margin-right: 10px;
            border-radius: 10px;
          `}
        >
          <TouchableOpacity
            onPress={() => onPress?.()}
            css={`
              align-items: center;
              flex-direction: column;
            `}
          >
            <AntDesign name="camerao" size={34} color="#bbbbbb" />
            <Text
              css={`
                font-size: 14px;
                color: #999999;
                margin-top: 2px;
              `}
            >
              请拍摄仪表盘照片
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View
          css={`
            height: 259px;
            border-radius: 10px;
            align-items: center;
            margin-left: 10px;
            margin-right: 10px;
            margin-top: 15px;
          `}
        >
          <TouchableOpacity
            onPress={() =>
              navigation.push('PreinspectionFailurePreview', {
                sitePath: imageRes,
              })
            }
          >
            <Image
              source={{ uri: imageRes }}
              css={`
                height: 259px;
                width: ${width * 0.95}px;
                border-radius: 10px;
              `}
            ></Image>
          </TouchableOpacity>

          <View
            css={`
              position: relative;
              top: -34px;
              left: 158px;
            `}
          >
            <TouchableOpacity onPress={() => onPress?.()}>
              <AntDesign name="camerao" size={34} color="#bbbbbb" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
});
