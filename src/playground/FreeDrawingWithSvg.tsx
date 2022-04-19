import { wrapNavigatorScreen } from '@euler/functions';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export const FreeDrawingWithSvg = wrapNavigatorScreen(
  () => {
    const [paths, setPaths] = useState<string[]>([]);
    const currentPath = useSharedValue('');
    const currentPathProps = useAnimatedProps(() => ({
      d: currentPath.value,
    }));

    const gesture = Gesture.Pan()
      .onBegin(e => {
        currentPath.value = `M${e.x},${e.y}`;
      })
      .onUpdate(e => {
        currentPath.value += ` L${e.x},${e.y}`;
      })
      .onEnd(() => {
        const path = `${currentPath.value}`;
        runOnJS(setPaths)([...paths, path]);
        // currentPath.value = '';
      });

    const navigation = useNavigation<StackNavigationProp<any>>();
    useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            onPress={() => {
              currentPath.value = '';
              setPaths([]);
            }}
            css={`
              padding: 0 16px;
            `}
          >
            <Text>Clear</Text>
          </TouchableOpacity>
        ),
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <View
        css={`
          flex: 1;
        `}
      >
        <Svg
          style={StyleSheet.absoluteFill}
          css={`
            background-color: #fff;
          `}
        >
          {paths.map((d, i) => (
            <Path key={i} d={d} stroke="#000" strokeWidth={3} />
          ))}
          <AnimatedPath
            stroke="#000"
            strokeWidth={3}
            animatedProps={currentPathProps}
          />
        </Svg>

        <GestureDetector gesture={gesture}>
          <Animated.View
            css={`
              flex: 1;
            `}
          />
        </GestureDetector>
      </View>
    );
  },
  {
    title: 'Free Drawing With SVG',
  },
);
