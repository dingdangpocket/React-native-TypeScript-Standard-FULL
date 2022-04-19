import { FontFamily } from '@euler/components/typography';
import { ComponentType } from 'react';
import Toast, { ToastContainer, ToastProps } from 'react-native-root-toast';

(ToastContainer as ComponentType<ToastProps>).defaultProps = {
  ...(ToastContainer as ComponentType<ToastProps>).defaultProps,
  keyboardAvoiding: false,
  position: Toast.positions.CENTER,
  textStyle: {
    fontSize: 12,
    fontFamily: FontFamily.NotoSans.Light,
    lineHeight: 13,
  },
  containerStyle: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 44,
    backgroundColor: '#111',
    opacity: 0.8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadowColor: '#111',
};
