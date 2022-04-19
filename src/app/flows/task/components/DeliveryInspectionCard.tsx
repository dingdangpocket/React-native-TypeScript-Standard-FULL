import { AppNavParams } from '@euler/app/Routes';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { FC, useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

const DeliveryInspectionCard: FC<any> = props => {
  const { id, media, subject, requiresPhoto } = props.item;
  //id交车检查模版Id;
  //media交车检查拍摄的图片资源;
  //subject交车检查的项目名称;
  const {
    submitStatus,
    getInputDataCallback,
    deleteDeliveryItem,
    item,
    deleteImage,
    setSubmitStatus,
  } = props;
  const navigation = useNavigation<StackNavigationProp<AppNavParams & any>>();
  const [checked, setChecked] = useState<any>('');
  const options = ['是', '否'];
  const [radio, setRadio] = useState<any>('是');
  const [remark, onChangeRemark] = useState<string>('');
  const onCheck = (key: any) => {
    setChecked(key);
    setRadio(options[key]);
  };
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    if (submitStatus) {
      getInputDataCallback({
        resultText: radio,
        remark: remark,
        title: subject,
        medias: media,
      });
      setSubmitStatus(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitStatus]);

  const onCapture = (deliveryInspectionId: any) => {
    navigation.push('InspectionCamera', {
      deliveryCamera: true,
      deliveryInspectionId,
    });
  };

  return (
    <View
      css={`
        height: 264px;
        background: white;
        margin-left: 15px;
        margin-right: 15px;
        margin-top: 5px;
        margin-bottom: 10px;
        border-radius: 6px;
        padding: 15px;
      `}
    >
      <TouchableOpacity
        onPress={() => deleteDeliveryItem(item)}
        css={`
          position: absolute;
          top: ${height * 0.01}px;
          left: ${width * 0.78}px;
          z-index: 2;
          width: 50px;
          height: 50px;
          align-items: center;
          justify-content: center;
        `}
      >
        <AntDesign name="delete" size={24} color="#cc2d2d" />
      </TouchableOpacity>

      <Text
        css={`
          font-size: 14px;
          margin-top: 7px;
        `}
      >
        {subject}
      </Text>
      <View>
        <View
          css={`
            align-items: center;
            flex-direction: row;
          `}
        >
          {options.map((option, key) => {
            return (
              <View key={option}>
                {checked == key ? (
                  <TouchableOpacity
                    css={`
                      align-items: center;
                      flex-direction: row;
                      margin-right: 30px;
                      margin-top: 14px;
                      margin-left: 5px;
                      margin-bottom: 5px;
                      width: 30px;
                      height: 30px;
                    `}
                  >
                    <Ionicons
                      name="md-radio-button-on"
                      size={28}
                      color="#464646"
                    />
                    <Text>{option}</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => onCheck(key)}
                    css={`
                      align-items: center;
                      flex-direction: row;
                      margin-right: 30px;
                      margin-top: 14px;
                      margin-left: 5px;
                      margin-bottom: 5px;
                      width: 30px;
                      height: 30px;
                    `}
                  >
                    <Ionicons
                      name="md-radio-button-off-outline"
                      size={25}
                      color="gray"
                    />
                    <Text
                      css={`
                        color: gray;
                      `}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
        {media == null && requiresPhoto == true ? (
          <TouchableOpacity
            onPress={() => onCapture(id)}
            css={`
              background: #ececec;
              height: 90px;
              width: 90px;
              margin-top: 15px;
              margin-right: 5px;
              margin-left: 5px;
              border-radius: 5px;
              justify-content: center;
              align-items: center;
            `}
          >
            <Feather name="camera" size={24} color="#cc2d2d" />
            <Text
              css={`
                font-size: 10px;
                color: #cc2d2d;
              `}
            >
              需拍照
            </Text>
          </TouchableOpacity>
        ) : media == null ? (
          <TouchableOpacity
            onPress={() => onCapture(id)}
            css={`
              background: #ececec;
              height: 90px;
              width: 90px;
              margin-top: 15px;
              margin-right: 5px;
              margin-left: 5px;
              border-radius: 5px;
              justify-content: center;
              align-items: center;
            `}
          >
            <Feather name="camera" size={24} color="#838383" />
          </TouchableOpacity>
        ) : (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            css={`
              margin-top: 15px;
            `}
          >
            {media.map((mediaItem: any, index: any) => {
              return (
                <View key={index}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.push('PreinspectionFailurePreview', {
                        sitePath: mediaItem,
                      })
                    }
                  >
                    <Image
                      source={{ uri: mediaItem }}
                      css={`
                        height: 90px;
                        width: 90px;
                        margin-right: 5px;
                        margin-left: 5px;
                        border-radius: 5px;
                      `}
                    ></Image>
                  </TouchableOpacity>
                  <View
                    css={`
                      position: absolute;
                      top: 4px;
                      right: -5px;
                    `}
                  >
                    <TouchableOpacity
                      onPress={() => deleteImage(mediaItem, id)}
                      css={`
                        width: 35px;
                        height: 35px;
                      `}
                    >
                      <AntDesign name="closecircleo" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
            {media != null && requiresPhoto == true ? (
              <TouchableOpacity
                onPress={() => onCapture(id)}
                css={`
                  background: #ececec;
                  height: 90px;
                  width: 90px;
                  margin-right: 5px;
                  margin-left: 5px;
                  border-radius: 5px;
                  justify-content: center;
                  align-items: center;
                `}
              >
                <Feather name="camera" size={24} color="#cc2d2d" />
                <Text
                  css={`
                    font-size: 10px;
                    color: #cc2d2d;
                  `}
                >
                  需拍照
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => onCapture(id)}
                css={`
                  background: #ececec;
                  height: 90px;
                  width: 90px;
                  margin-right: 5px;
                  margin-left: 5px;
                  border-radius: 5px;
                  justify-content: center;
                  align-items: center;
                `}
              >
                <Feather name="camera" size={24} color="#838383" />
              </TouchableOpacity>
            )}
          </ScrollView>
        )}
        <TextInput
          onChangeText={onChangeRemark}
          value={remark}
          placeholder="备注:"
          css={`
            width: 300px;
            height: 50px;
            padding: 3px;
            border-bottom-width: 1px;
            margin: 10px;
            border-color: #dadada;
          `}
        />
      </View>
    </View>
  );
};
export default DeliveryInspectionCard;
