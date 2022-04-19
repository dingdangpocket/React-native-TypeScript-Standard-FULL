import { AppNavParams } from '@euler/app/Routes';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { FC, memo } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
const SitePreviewCardList: FC<any> = memo(props => {
  const { siteName, vehiclePreInspectionMediaMap } = props;
  const navigation = useNavigation<StackNavigationProp<AppNavParams>>();
  const items: any = vehiclePreInspectionMediaMap.get(siteName);
  if (Array.isArray(items)) {
    return (
      <View
        css={`
          flex-direction: column;
        `}
      >
        {vehiclePreInspectionMediaMap
          .get(siteName)
          .map((sitePath: any, index: any) => {
            return (
              <View
                key={index}
                css={`
                  margin-top: 10px;
                `}
              >
                <View
                  css={`
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                    margin-left: 25px;
                    margin-right: 25px;
                  `}
                >
                  <Text
                    css={`
                      font-size: 18px;
                    `}
                  >
                    {siteName}
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
                    border-color: #b6b6b6;
                    margin: 0 auto;
                    margin-bottom: 10px;
                    margin-left: 25px;
                    margin-right: 25px;
                  `}
                />
                <TouchableOpacity
                  onPress={() =>
                    navigation.push('PreinspectionFailurePreview', {
                      sitePath: sitePath,
                    })
                  }
                >
                  <Image
                    source={{ uri: sitePath }}
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
          })}
      </View>
    );
  } else {
    return (
      <View
        css={`
          margin-top: 10px;
        `}
      >
        <View
          css={`
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            margin-left: 25px;
            margin-right: 25px;
          `}
        >
          <Text
            css={`
              font-size: 18px;
            `}
          >
            {siteName}
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
            border-color: #b6b6b6;
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
              sitePath: vehiclePreInspectionMediaMap.get(siteName),
            })
          }
        >
          <Image
            source={{ uri: vehiclePreInspectionMediaMap.get(siteName) }}
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
  }
});

export default SitePreviewCardList;
