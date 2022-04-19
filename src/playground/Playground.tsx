import { wrapNavigatorScreen } from '@euler/functions';
import { PlaygroundNavParams } from '@euler/playground/Index';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScrollView, Text } from 'react-native';
import styled from 'styled-components/native';

const PlaygroundItem = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  margin: 8px 32px;
  padding: 16px;
  background-color: #ccc;
  border-radius: 5px;
`;

export const PlaygroundListScreen = wrapNavigatorScreen(
  () => {
    const navigation =
      useNavigation<StackNavigationProp<PlaygroundNavParams>>();
    return (
      <ScrollView contentContainerStyle={{ paddingTop: 20 }}>
        <PlaygroundItem onPress={() => navigation.push('Score', {})}>
          <Text>Score Gauge</Text>
        </PlaygroundItem>
        <PlaygroundItem
          onPress={() =>
            navigation.push('KeyboardAvoidingViewWithScrollViewDemo', {})
          }
        >
          <Text>KeyboardAvoidingView w/ ScrollView</Text>
        </PlaygroundItem>
        <PlaygroundItem
          onPress={() =>
            navigation.push('KeyboardAvoidingViewWithFlexDemo', {})
          }
        >
          <Text>KeyboardAvoidingView w/ Flex</Text>
        </PlaygroundItem>
        <PlaygroundItem
          onPress={() => navigation.push('FreeDrawingWithSvg', {})}
        >
          <Text>Free Drawing w/ SVG</Text>
        </PlaygroundItem>
        <PlaygroundItem
          onPress={() => navigation.push('FreeDrawingWithSkia', {})}
        >
          <Text>Free Drawing w/ Skia</Text>
        </PlaygroundItem>
        <PlaygroundItem
          onPress={() => navigation.push('FileUploadProgressDemo', {})}
        >
          <Text>File Upload Progress Report Demo</Text>
        </PlaygroundItem>
      </ScrollView>
    );
  },
  {
    headerShown: true,
    title: 'Playground',
  },
);
