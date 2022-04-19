import { DecoratorFn } from '@storybook/react';
import * as React from 'react';
import { View } from 'react-native';

export const SmallViewDecorator: DecoratorFn = storyFn => (
  <View
    css={`
      align-items: flex-start;
    `}
  >
    {storyFn()}
  </View>
);
