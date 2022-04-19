import React, { FC, memo } from 'react';
import { Image, Text, View } from 'react-native';

type Props = {
  name: string;
  imageUrl: string;
};
export const TroubleLampPreviewCell: FC<Props> = memo(({ name, imageUrl }) => {
  return (
    <View
      css={`
        height: 60px;
        margin-top: 3px;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        padding: 10px;
        border-bottom-width: 2px;
        border-bottom-color: #e0e0e0;
      `}
    >
      <>
        <Image
          source={{ uri: imageUrl }}
          css={`
            height: 27px;
            width: 27px;
          `}
        ></Image>
        <Text>{name}</Text>
      </>
      <View
        css={`
          height: 25px;
          width: 40px;
          justify-content: space-around;
          align-items: center;
          background: #d66c15;
        `}
      >
        <Text
          css={`
            color: white;
          `}
        >
          异常
        </Text>
      </View>
    </View>
  );
});
