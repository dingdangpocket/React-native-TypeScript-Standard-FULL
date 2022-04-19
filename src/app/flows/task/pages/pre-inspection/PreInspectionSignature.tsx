import { wrapNavigatorScreen } from '@euler/functions';
import { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import ViewShot from 'react-native-view-shot';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export const PreInspectionSignatureScreen = wrapNavigatorScreen(
  ({ onDone }: { onDone?: (result: string) => void }) => {
    const [paths, setPaths] = useState<string[]>([]);
    const currentPath = useSharedValue('');
    const currentPathProps = useAnimatedProps(() => ({
      d: currentPath.value,
    }));
    const screenShot: any = useRef();
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
      });
    const onConfirmSign = () => {
      void (async () => {
        const uri = await screenShot.current.capture();
        onDone?.(uri);
      })();
    };
    return (
      <>
        <ViewShot
          ref={screenShot}
          options={{ format: 'jpg', quality: 0.9 }}
          css={`
            flex: 0.9;
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
              stroke="black"
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
        </ViewShot>

        <View
          css={`
            flex: 0.1;
            background: white;
            flex-direction: row;
            justify-content: space-around;
            border-color: #b9b9b9;
            border-top-width: 1px;
            padding: 5px;
          `}
        >
          <TouchableOpacity
            onPress={() => {
              currentPath.value = '';
              setPaths([]);
            }}
            css={`
              background:  #207fe7;
              width: 100px;
              height:55px
              border-radius:5px;
              justify-content: center;
              align-items: center;
            `}
          >
            <Text
              css={`
                color: white;
              `}
            >
              重签
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onConfirmSign}
            css={`
              background:  #207fe7;
              width: 100px;
              height:55px
              border-radius:5px;
              justify-content: center;
              align-items: center;
            `}
          >
            <Text
              css={`
                color: white;
              `}
            >
              确认
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  },
  {
    title: '签名',
  },
);
