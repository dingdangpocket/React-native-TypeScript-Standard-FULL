import { MediaInfo } from '@euler/app/flows/task/pages/inspection/site-inspection/functions/SiteInspection';
import { AppNavParams } from '@euler/app/Routes';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { FC, memo } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export type ImageItem = {
  medias: MediaInfo[];
  itemId: number;
  currentSiteId: number;
  currentSiteName: string;
};
type Props = {
  medias: MediaInfo[];
  itemId: number;
  currentSiteId: number;
  currentSiteName: string;
  onDelete?: (
    currentSiteId: number,
    currentItemId: number,
    currentMediaItem: MediaInfo,
  ) => void;
};
export const FacadeImageCard: FC<Props> = memo(
  ({ medias, onDelete, currentSiteId, itemId, currentSiteName }) => {
    const navigation = useNavigation<StackNavigationProp<AppNavParams | any>>();
    return (
      <>
        {medias.map((item: MediaInfo) => {
          return (
            <View key={item.url}>
              <TouchableOpacity
                css={`
                  align-items: center;
                `}
                onPress={() =>
                  navigation.push('PreinspectionFailurePreview', {
                    sitePath: item.url,
                  })
                }
              >
                <Image
                  source={{
                    uri: item.url,
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
                <Text>{currentSiteName}</Text>
              </TouchableOpacity>
              <View
                css={`
                  position: absolute;
                  top: 10px;
                  left: 80px;
                `}
              >
                <TouchableOpacity
                  onPress={() => onDelete?.(currentSiteId, itemId, item)}
                  css={`
                    width: 35px;
                    height: 35px;
                  `}
                >
                  <AntDesign name="closecircleo" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </>
    );
  },
);
