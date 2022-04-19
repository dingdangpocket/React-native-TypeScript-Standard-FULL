import { memo } from 'react';
import {
  LayoutRectangle,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS } from 'react-native-reanimated';
import { TagInfo } from '../functions/TagInfo';
import { TagInteractionContext, TagView } from './TagView';

export const AnnotationCanvas = memo(
  ({
    tags,
    width,
    height,
    style,
    onTap,
    onTagReadyForInteraction,
    onTagPress,
    onDeleteTag,
    onTagMoveBegin,
    onTagMoveEnd,
    onTagLayoutChange,
  }: {
    width: number;
    height: number;
    tags: TagInfo[];
    style?: StyleProp<ViewStyle>;
    onTap: (x: number, y: number) => void;
    onTagReadyForInteraction?: (
      id: string,
      interaction: TagInteractionContext,
    ) => void;
    onTagPress?: (id: string) => void;
    onDeleteTag?: (id: string) => void;
    onTagMoveBegin?: (id: string, x: number, y: number) => void;
    onTagMoveEnd?: (id: string, x: number, y: number) => void;
    onTagLayoutChange?: (id: string, layout: LayoutRectangle) => void;
  }) => {
    const tap = Gesture.Tap().onBegin(e => {
      runOnJS(onTap)(e.x, e.y);
    });
    return (
      <View
        css={`
          width: ${width}px;
          height: ${height}px;
          position: absolute;
        `}
        style={style}
      >
        <GestureDetector gesture={tap}>
          <Animated.View
            style={StyleSheet.absoluteFill}
            css={`
              width: ${width}px;
              height: ${height}px;
              position: absolute;
            `}
          />
        </GestureDetector>
        {tags.map(tag => (
          <TagView
            key={tag.id}
            tag={tag}
            canvasWidth={width}
            canvasHeight={height}
            onReady={onTagReadyForInteraction}
            onPress={onTagPress}
            onDelete={onDeleteTag}
            onMoveBegin={onTagMoveBegin}
            onMoveEnd={onTagMoveEnd}
            onLayout={onTagLayoutChange}
          />
        ))}
      </View>
    );
  },
);
