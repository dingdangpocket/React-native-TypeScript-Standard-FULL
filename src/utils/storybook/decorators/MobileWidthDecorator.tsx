import { DecoratorFn } from '@storybook/react';
import * as React from 'react';
import { View } from 'react-native';

export const MobileWidthDecorator: DecoratorFn = storyFn => (
  <View
    css={`
      width: 375px;
      flex: 1;
    `}
  >
    {storyFn()}
  </View>
);
