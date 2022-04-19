import { DecoratorFn } from '@storybook/react';
import * as React from 'react';
import { Platform, View } from 'react-native';

export const DarkBackground: DecoratorFn = storyFn => (
  <View
    css={`
      flex: 1;
      background-color: #252e34;
      padding: 40px;
      align-items: flex-start;
      ${Platform.OS === 'web' && 'min-height: calc(100vh - 2em)'}
    `}
  >
    {storyFn()}
  </View>
);
