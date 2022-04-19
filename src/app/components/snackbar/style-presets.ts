/**
 * @file: style-presents.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
import { FontFamily } from '@euler/components/typography';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { ImageStyle } from 'react-native-fast-image';

export type SnackbarStyles = {
  bar?: StyleProp<ViewStyle>;
  contentContainer?: StyleProp<ViewStyle>;
  image?: StyleProp<ImageStyle>;
  text?: StyleProp<TextStyle>;
  closeButton?: { size?: number; color?: string; style?: StyleProp<ViewStyle> };
};

type Preset = 'default';

export const SnackbarStylePresets: { [p in Preset]: SnackbarStyles } = {
  // default snackbar styles
  default: {
    contentContainer: {
      paddingLeft: 15,
      paddingRight: 15,
      paddingTop: 4,
      paddingBottom: 4,
    },
    text: {
      fontFamily: FontFamily.NotoSans.Regular,
      fontSize: 12,
      lineHeight: 16,
    },
    image: {
      width: 34,
      height: 34,
      borderRadius: 4,
      marginRight: 15,
    },
    closeButton: {
      size: 18,
      style: {
        marginLeft: 15,
      },
    },
  },
};
