import { Feather } from '@expo/vector-icons';
import React, { FC } from 'react';
import { Image, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

type Props = {
  medias?: string[];
  onPress: (id: string) => void;
  requiresPhoto: boolean;
  itemsId: string;
};
const CameraCardList: FC<Props> = props => {
  const { requiresPhoto, onPress, medias, itemsId } = props;
  return (
    <>
      {medias?.length != 0 ? (
        medias?.map((item: string, index: number) => {
          return (
            <Image
              key={index}
              source={{ uri: item }}
              css={`
                width: 100px;
                height: 95px;
                background: #dfdfdf;
                border-radius: 5px;
                justify-content: center;
                align-items: center;
                margin-right: 10px;
              `}
            ></Image>
          );
        })
      ) : (
        <TouchableOpacity onPress={() => onPress?.(itemsId)}>
          <View
            css={`
              width: 100px;
              height: 95px;
              background: #dfdfdf;
              border-radius: 5px;
              justify-content: center;
              align-items: center;
              margin-right: 10px;
            `}
          >
            <Feather
              name="camera"
              size={24}
              color={requiresPhoto ? 'red' : 'gray'}
            />
          </View>
        </TouchableOpacity>
      )}
      {medias?.length != 0 ? (
        <TouchableOpacity onPress={() => onPress?.(itemsId)}>
          <View
            css={`
              width: 100px;
              height: 95px;
              background: #dfdfdf;
              border-radius: 5px;
              justify-content: center;
              align-items: center;
              margin-right: 10px;
            `}
          >
            <Feather name="camera" size={24} color={'gray'} />
          </View>
        </TouchableOpacity>
      ) : null}
    </>
  );
};
export default CameraCardList;
