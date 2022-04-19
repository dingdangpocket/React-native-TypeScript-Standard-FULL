import { AppNavParams } from '@euler/app/Routes';
import {
  VehicleInspectionTaskCheckSite,
  VehicleInspectionTaskCheckSiteItemMedia,
} from '@euler/model/entity';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FC, memo } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  item: VehicleInspectionTaskCheckSite;
};
export const FacadePreviewCard: FC<Props> = memo(({ item }) => {
  const navigation = useNavigation<StackNavigationProp<AppNavParams | any>>();
  return (
    <>
      {item?.inspectedSiteItems
        ? item?.inspectedSiteItems[0]?.medias?.map(
            (image: VehicleInspectionTaskCheckSiteItemMedia, index: number) => {
              return (
                <View key={index}>
                  <View
                    css={`
                      flex-direction: row;
                      align-items: center;
                      justify-content: space-between;
                      margin-left: 25px;
                      margin-right: 25px;
                      margin-top: 13px;
                    `}
                  >
                    <Text
                      css={`
                        font-size: 16px;
                        color: #585858;
                      `}
                    >
                      {item.name}
                    </Text>
                    <View
                      css={`
                        height: 25px;
                        width: 40px;
                        align-items: center;
                        justify-content: center;
                        background: #e7770f;
                      `}
                    >
                      <Text
                        css={`
                          background: #e7770f;
                          color: white;
                        `}
                      >
                        异常
                      </Text>
                    </View>
                  </View>
                  <View
                    css={`
                      border-width: 0.5px;
                      border-color: #e79821;
                      margin: 0 auto;
                      margin-top: 3px;
                      margin-bottom: 10px;
                      margin-left: 25px;
                      margin-right: 25px;
                    `}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      navigation.push('PreinspectionFailurePreview', {
                        sitePath: image.url,
                      })
                    }
                  >
                    <Image
                      source={{ uri: image.url }}
                      css={`
                        height: 230px;
                        border-radius: 10px;
                        margin-left: 25px;
                        margin-right: 25px;
                      `}
                    ></Image>
                  </TouchableOpacity>
                </View>
              );
            },
          )
        : null}
    </>
  );
});
