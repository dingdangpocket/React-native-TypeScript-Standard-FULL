import { AntDesign } from '@expo/vector-icons';
import { FC, memo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
type ContextType = {
  translateX: number;
  translateY: number;
};
const styles = StyleSheet.create({
  tag: {
    position: 'absolute',
    left: 150,
    top: 400,
  },
});
interface Props {
  item: any;
  onPress: (id: number) => void;
}

const FailureTag: FC<Props> = memo(props => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const panGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    ContextType
  >({
    onStart: (event, context) => {
      context.translateX = translateX.value;
      context.translateY = translateY.value;
    },
    onActive: (event, context) => {
      translateX.value = event.translationX + context.translateX;
      translateY.value = event.translationY + context.translateY;
    },
    onEnd: () => {},
  });

  const dynamicStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
      ],
    };
  });
  if (props.item == '') {
    return null;
  } else {
    return (
      <PanGestureHandler onGestureEvent={panGestureEvent}>
        <Animated.View style={[styles.tag, dynamicStyle]}>
          <>
            <Image
              source={require('../assets/failureTag.png')}
              resizeMode="contain"
              css={`
                width: 120px;
                height: 75px;
              `}
            ></Image>
            <Text
              css={`
                color: white;
                position: absolute;
                left: 60px;
                top: 22px;
              `}
            >
              {props.item.tag}
            </Text>
            <View
              css={`
                color: white;
                position: absolute;
                left: 112px;
                top: 0px;
              `}
            >
              <TouchableOpacity
                onPress={() => props.onPress?.(props.item.id)}
                css={`
                  width: 50px;
                  height: 50px;
                `}
              >
                <AntDesign name="closecircleo" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </>
        </Animated.View>
      </PanGestureHandler>
    );
  }
});

export default FailureTag;
