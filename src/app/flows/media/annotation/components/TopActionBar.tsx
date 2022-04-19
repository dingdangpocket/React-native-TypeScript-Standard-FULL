import { Label } from '@euler/components/typography/Label';
import { Ionicons } from '@expo/vector-icons';
import { AnimatePresence, MotiView } from 'moti';
import { memo, useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TagInfo } from '../functions/TagInfo';
import {
  AnnotationTagColorStyle,
  DefaultAnnotationTagStyle,
} from '../functions/tagPresets';
import { DoneButton } from './DoneButton';
import { TagColorPicker } from './TagColorPicker';

export const TopActionBar = memo(
  ({
    nextTag,
    selectedTag,
    visible,
    onTagColorStyleChange,
    onRetake,
    onConfirm,
  }: {
    visible?: boolean;
    nextTag?: string;
    selectedTag?: TagInfo;
    onTagColorStyleChange?: (
      id: string,
      colorStyle: AnnotationTagColorStyle,
    ) => void;
    onRetake?: () => void;
    onConfirm?: () => void;
  }) => {
    const insets = useSafeAreaInsets();
    const onColorPaletteChange = useCallback(
      (colorStyle: AnnotationTagColorStyle) => {
        if (!selectedTag) return;
        onTagColorStyleChange?.(selectedTag.id, colorStyle);
      },
      [onTagColorStyleChange, selectedTag],
    );
    return (
      <AnimatePresence>
        {visible !== false && (
          <MotiView
            from={{ translateY: -(50 + insets.top), opacity: 0 }}
            animate={{ translateY: 0, opacity: 1 }}
            exit={{ translateY: -(50 + insets.top), opacity: 0 }}
            transition={{
              type: 'timing',
            }}
            css={`
              position: absolute;
              left: 0;
              right: 0;
              top: ${insets.top}px;
              padding: 15px;
            `}
          >
            {/** top action buttons */}
            <View
              css={`
                align-items: center;
                justify-content: space-between;
                flex-direction: row;
              `}
            >
              <TouchableOpacity onPress={onRetake}>
                <Ionicons
                  name="arrow-undo-circle-outline"
                  size={28}
                  color="white"
                />
              </TouchableOpacity>
              <DoneButton text="完成" onPress={onConfirm} />
            </View>

            {/** tap placement tip */}
            <AnimatePresence>
              {nextTag != null && (
                <MotiView
                  from={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'timing', duration: 400 }}
                  exitTransition={{ type: 'timing', duration: 300 }}
                  css={`
                    margin-top: 20px;
                    align-items: center;
                    justify-content: center;
                  `}
                >
                  <Label light color="#fff" size={14}>
                    轻触图片添加该故障标签
                  </Label>
                </MotiView>
              )}
            </AnimatePresence>

            {/** color pickers */}
            <AnimatePresence>
              {selectedTag != null && (
                <MotiView
                  from={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'timing', duration: 400 }}
                  exitTransition={{ type: 'timing', duration: 300 }}
                  css={`
                    margin-top: 32px;
                  `}
                >
                  <TagColorPicker
                    selectedColor={
                      selectedTag?.style?.textFill ??
                      DefaultAnnotationTagStyle.textFill
                    }
                    onChange={onColorPaletteChange}
                  />
                </MotiView>
              )}
            </AnimatePresence>
          </MotiView>
        )}
      </AnimatePresence>
    );
  },
);
