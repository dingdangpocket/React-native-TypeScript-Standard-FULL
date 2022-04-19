import { FontFamily } from '@euler/components/typography';
import { EvilIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { memo } from 'react';
import { StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';

const secondsPerHour = 3600;

export const Timestamp = memo(
  ({
    timestamp,
    value,
    style,
    label,
    labelStyle,
  }: {
    timestamp?: string | Date;
    value?: number;
    style?: StyleProp<ViewStyle>;
    label?: string;
    labelStyle?: StyleProp<TextStyle>;
  }) => {
    let sec =
      value !== undefined
        ? value
        : Math.round(dayjs().diff(dayjs(timestamp)) / 1000);
    let day = 0,
      hour = 0,
      min = 0;
    day = Math.floor(sec / (secondsPerHour * 24));
    sec -= day * (secondsPerHour * 24);
    hour = Math.floor(sec / secondsPerHour);
    sec -= hour * secondsPerHour;
    min = Math.floor(sec / 60);
    sec -= min * 60;

    const components = [];
    if (day) {
      components.push(`${day}天`);
      if (hour) {
        components.push(`${hour}小时`);
      }
    } else if (hour) {
      components.push(`${hour}小时`);
    } else if (min) {
      components.push(`${min}分`);
    } else {
      components.push(`${min}秒`);
    }

    const text = `${label ?? '在厂'}${components.join('')}`;

    return (
      <View
        css={`
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
        `}
        style={style}
      >
        <EvilIcons
          name="clock"
          size={14}
          color="#555"
          css={`
            margin-top: 2px;
          `}
        />
        <Text
          css={`
            font-family: ${FontFamily.NotoSans.Thin};
            font-size: 10px;
          `}
          style={labelStyle}
        >
          {text}
        </Text>
      </View>
    );
  },
);
