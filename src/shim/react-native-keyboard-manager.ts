import { createElement, FC } from 'react';
import { View } from 'react-native';

export const PreviousNextView: FC = ({ children, ...props }) =>
  createElement(View, props, children);

export default null;
