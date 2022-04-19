import { AppNavParams } from '@euler/app/Routes';
import { Zocial } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { FC, memo } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
type Props = {
  title: string;
  imageUri: string | undefined | null;
};
export const PreviewImageCard: FC<Props> = memo(({ imageUri, title }) => {
  const navigation = useNavigation<StackNavigationProp<AppNavParams | any>>();
  if (imageUri) {
    return (
      <View>
        <View
          css={`
            align-items: center;
            justify-content: center;
            margin-left: 30px;
            margin-right: 30px;
            margin-top: 10px;
          `}
        >
          <Text
            css={`
              font-size: 17px;
              color: #383838;
            `}
          >
            {title}
          </Text>
        </View>
        <View
          css={`
            border-width: 0.5px;
            border-color: #b6b6b6;
            margin: 0 auto;
            margin-top: 3px;
            margin-bottom: 10px;
            margin-left: 30px;
            margin-right: 30px;
          `}
        />
        <TouchableOpacity
          onPress={() =>
            navigation.push('PreinspectionFailurePreview', {
              sitePath: imageUri,
            })
          }
        >
          <Image
            source={{ uri: imageUri }}
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
  } else {
    return (
      <View
        css={`
          margin-top: 10px;
        `}
      >
        <View
          css={`
            align-items: center;
            justify-content: center;
            margin-left: 30px;
            margin-right: 30px;
          `}
        >
          <Text
            css={`
              font-size: 17px;
              color: #383838;
            `}
          >
            {title}
          </Text>
        </View>
        <View
          css={`
            border-width: 0.5px;
            border-color: #b6b6b6;
            margin: 0 auto;
            margin-top: 3px;
            margin-bottom: 10px;
            margin-left: 30px;
            margin-right: 30px;
          `}
        />
        <View
          css={`
            height: 230px;
            border-radius: 10px;
            margin-left: 25px;
            margin-right: 25px;
            align-items: center;
            justify-content: center;
            background: #f7f7f7;
          `}
        >
          <Zocial name="dropbox" size={34} color="#c9c9c9" />
        </View>
      </View>
    );
  }
});
