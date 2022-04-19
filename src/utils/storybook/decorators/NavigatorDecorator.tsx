import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DecoratorFn } from '@storybook/react';
import * as React from 'react';

const Stack = createStackNavigator();
export const NavigatorDecorator: DecoratorFn = storyFn => (
  <NavigationContainer independent={true}>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="init" component={storyFn} />
    </Stack.Navigator>
  </NavigationContainer>
);
