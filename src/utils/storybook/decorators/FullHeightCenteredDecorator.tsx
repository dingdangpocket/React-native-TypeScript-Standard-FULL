import { DecoratorFn } from '@storybook/react';
import * as React from 'react';
import { Platform, View } from 'react-native';

export const FullHeightCenteredDecorator: DecoratorFn = storyFn => (
  <View
    css={`
      width: 100%;
      flex: 1;
      ${Platform.OS === 'web' && 'height: 100vh'};
      justify-content: center;
      align-items: center;
    `}
  >
    {storyFn()}
  </View>
);
