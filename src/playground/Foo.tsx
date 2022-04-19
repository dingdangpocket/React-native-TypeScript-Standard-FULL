import React, { useCallback } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export function Foo(props: { x: string }) {
  const onPress = useCallback(() => {
    console.log(props.x);
  }, [props.x]);

  return (
    <TouchableOpacity onPress={onPress}>
      <View>
        <Text>Hello</Text>
      </View>
    </TouchableOpacity>
  );
}
