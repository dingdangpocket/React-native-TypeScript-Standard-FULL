import { IconProps } from '@euler/app/components/icons/types';
import { AppNavParams } from '@euler/app/Routes';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { ComponentType, FC, memo } from 'react';
import { Image, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
interface Props {
  item: string;
  icon: ComponentType<IconProps>;
  vehiclePreInspectionMediaMap: any;
  onPress: (currentSiteName?: string, currentSitePath?: string) => void;
}
const PreinspectionImageItem: FC<Props> = memo(props => {
  const vehiclePreInspectionMediaMap = props.vehiclePreInspectionMediaMap;
  const siteName: any = props.item;
  const siteItems: string | string[] =
    vehiclePreInspectionMediaMap.get(siteName);
  const Icon: any = props.icon;
  const navigation = useNavigation<StackNavigationProp<AppNavParams | any>>();
  if (Array.isArray(siteItems)) {
    return (
      <View
        css={`
          flex-direction: row;
        `}
      >
        {siteItems.map((sitePath, index) => {
          return (
            <View
              key={index}
              css={`
                justify-content: center;
                align-items: center;
              `}
            >
              <TouchableOpacity
                onPress={() =>
                  navigation.push('PreinspectionFailurePreview', {
                    sitePath: sitePath,
                  })
                }
              >
                <Image
                  source={{
                    uri: sitePath,
                  }}
                  css={`
                    margin-left: 5px;
                    margin-right: 5px;
                    margin-top: 5px;
                    margin-bottom: 5px;
                    height: 105px;
                    width: 105px;
                    border-radius: 8px;
                  `}
                ></Image>
              </TouchableOpacity>

              <Text>{siteName}</Text>
              <View
                css={`
                  position: absolute;
                  top: 10px;
                  left: 80px;
                `}
              >
                <TouchableOpacity
                  onPress={() => props.onPress?.(siteName, sitePath)}
                  css={`
                    width: 35px;
                    height: 35px;
                  `}
                >
                  <Icon />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
    );
  } else {
    return (
      <View
        css={`
          justify-content: center;
          align-items: center;
        `}
      >
        <TouchableOpacity
          activeOpacity={0.73}
          onPress={() =>
            navigation.push('PreinspectionFailurePreview', {
              sitePath: vehiclePreInspectionMediaMap.get(siteName),
            })
          }
        >
          <Image
            source={{ uri: vehiclePreInspectionMediaMap.get(siteName) }}
            css={`
              height: 105px;
              width: 105px;
              margin-left: 5px;
              margin-right: 5px;
              margin-top: 5px;
              margin-bottom: 5px;
              border-radius: 8px;
            `}
          ></Image>
        </TouchableOpacity>

        <Text>{siteName}</Text>
        <View
          css={`
            position: absolute;
            top: 10px;
            left: 80px;
          `}
        >
          <TouchableOpacity
            onPress={() => props.onPress?.(siteName)}
            css={`
              width: 35px;
              height: 35px;
            `}
          >
            <Icon />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
});

export default PreinspectionImageItem;
