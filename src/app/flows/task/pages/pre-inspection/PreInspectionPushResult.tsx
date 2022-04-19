import { TaskNavParams } from '@euler/app/flows/task/TaskFlow';
import { AppNavParams } from '@euler/app/Routes';
import { wrapNavigatorScreen } from '@euler/functions';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type BtnProps = {
  title: string;
  onPress: () => void;
  styleOptions: {
    btn: {
      backgroundColor?: string;
      borderWidth?: number;
      borderColor?: string;
    };
    text: { color?: string };
  };
};
const Button = (props: BtnProps) => {
  return (
    <TouchableOpacity
      onPress={() => props.onPress?.()}
      css={`
        flex: 1;
        width: 290px;
        height: 50px;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
        border-radius: 7px;
        border-width: 1px;
        border-color: white;
      `}
      style={{ ...props.styleOptions.btn }}
    >
      <Text
        css={`
          align-items: center;
          justify-content: center;
          font-size: 20px;
        `}
        style={{ ...props.styleOptions.text }}
      >
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

export const PreInspectionPushResultScreen = wrapNavigatorScreen(
  () => {
    const navigation =
      useNavigation<StackNavigationProp<TaskNavParams | AppNavParams | any>>();
    const onBack = () => {
      navigation.navigate('taskDetail', {});
    };
    const btnStyleA = {
      btn: { backgroundColor: '#e7e7e7' },
      text: { color: '#377ad3' },
    };
    const btnStyleB = {
      btn: { borderWidth: 1, borderColor: 'white' },
      text: { color: '#ffffff' },
    };
    return (
      <SafeAreaView
        css={`
          flex: 1;
          background: #377ad3;
        `}
      >
        <ScrollView showsHorizontalScrollIndicator={false}>
          <View
            css={`
              flex: 1;
              align-items: center;
              justify-content: center;
              margin-top: 220px;
            `}
          >
            <MaterialCommunityIcons
              name="checkbox-marked-circle"
              size={60}
              color="white"
            />
            <Text
              css={`
                align-items: center;
                justify-content: center;
                font-size: 16px;
                color: #e4e4e4;
                margin-top: 20px;
              `}
            >
              报告推送成功!
            </Text>
            <Text
              css={`
                align-items: center;
                justify-content: center;
                font-size: 15px;
                color: #e4e4e4;
                margin-top: 20px;
              `}
            >
              用户可通过公众号查看检测报告
            </Text>
            <Button
              title={'继续任务'}
              onPress={onBack}
              styleOptions={btnStyleA}
            />
            <Button title={'返回'} onPress={onBack} styleOptions={btnStyleB} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  },
  {
    headerShown: false,
    titleStyle: {
      fontSize: 49,
    },
  },
);
