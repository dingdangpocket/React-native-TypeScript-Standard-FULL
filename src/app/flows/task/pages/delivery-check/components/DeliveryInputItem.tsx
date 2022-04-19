import { IconProps } from '@euler/app/components/icons/types';
import CameraCardList from '@euler/app/flows/task/pages/delivery-check/components/CameraCardList';
import RemarkModal from '@euler/app/flows/task/pages/delivery-check/components/RemarkModal';
import { AppNavParams } from '@euler/app/Routes';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { ComponentType, FC, useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

type Props = {
  id?: string;
  subject?: string;
  remark?: string;
  itemId?: string;
  checked?: boolean;
  medias?: string[];
  requiresPhoto?: boolean;
  Tag?: string | ComponentType<IconProps>;
  submitStatus?: boolean;
  resCode?: string;
  resText?: string;
  resMark?: string;
  onInputDataCallback: (value: any) => void;
  setSubmitStatus: (status: boolean) => void;
};
const DeliveryInputItem: FC<Props> = props => {
  const {
    itemId,
    medias,
    subject,
    setSubmitStatus,
    submitStatus,
    onInputDataCallback,
    resCode,
    resText,
    resMark,
  } = props;

  const navigation = useNavigation<StackNavigationProp<AppNavParams | any>>();
  const [isVisible, setIsvisible] = useState<boolean>(false);
  const [remark, setRemark] = useState<string>('添加备注:');
  const [resultCode, setResultCode] = useState<string>('OK');
  const [resultText, setResultText] = useState<string>('是');

  const remarkValueCallback = (value: string) => {
    setRemark(value);
    console.log('输入的备注信息', value);
  };

  const onCapturePhoto = (id: string) => {
    navigation.navigate('InspectionCamera', {
      deliveryCamera: true,
      itemId: id,
    });
  };

  useEffect(() => {
    if (submitStatus) {
      onInputDataCallback({
        remark: remark,
        title: subject,
        medias: medias,
        resultCode: resultCode,
        resultText: resultText,
      });
      setSubmitStatus(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitStatus]);

  useEffect(() => {
    if (resCode && resText && resMark) {
      setResultCode(resCode);
      setResultText(resText);
      setRemark(resMark);
    }
  }, [resCode, resMark, resText]);

  const onCheckTrue = () => {
    setResultCode('OK');
    setResultText('是');
  };
  const onCheckFalse = () => {
    setResultCode('NO');
    setResultText('否');
  };

  return (
    <>
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
        <View
          css={`
            flex-direction: row;
            justify-content: space-between;
          `}
        >
          <Text>{subject}</Text>
          <AntDesign name="delete" size={24} color="#cc2d2d" />
        </View>
        <View
          css={`
            flex-direction: row;
            justify-content: space-between;
            margin-top: 10px;
          `}
        >
          <TouchableOpacity
            onPress={() => onCheckTrue()}
            css={`
              width: 90px;
              height: 40px;
              justify-content: center;
              align-items: center;
            `}
            style={
              resultCode == 'OK'
                ? {
                    backgroundColor: 'green',
                  }
                : { backgroundColor: 'gray' }
            }
          >
            <Text>是</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onCheckFalse()}
            css={`
              width: 90px;
              height: 40px;
              justify-content: center;
              align-items: center;
            `}
            style={
              resultCode == 'NO'
                ? {
                    backgroundColor: 'red',
                  }
                : { backgroundColor: 'gray' }
            }
          >
            <Text>否</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal={true}
          css={`
            margin-top: 10px;
          `}
        >
          <CameraCardList
            requiresPhoto={true}
            onPress={onCapturePhoto}
            medias={medias}
            itemsId={itemId ?? '0'}
          />
        </ScrollView>
        <TouchableOpacity onPress={() => setIsvisible(true)}>
          <View
            css={`
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              margin-top: 10px;
            `}
          >
            <Text>{remark}</Text>
            <Feather name="edit" size={24} color="black" />
          </View>
        </TouchableOpacity>
      </View>
      <RemarkModal
        isVisible={isVisible}
        setIsvisible={setIsvisible}
        remarkValueCallback={remarkValueCallback}
      />
    </>
  );
};
export default DeliveryInputItem;
