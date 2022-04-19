import { StatusColors } from '@euler/components';
import { FontFamily } from '@euler/components/typography';
import { useSystemMetrics, wrapNavigatorScreen } from '@euler/functions';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';
import { memo, useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DoneButton } from './components/DoneButton';
import { TagColorPicker } from './components/TagColorPicker';
import {
  AnnotationTagColorStyle,
  DefaultAnnotationTagStyle,
} from './functions/tagPresets';

const Header = memo(
  ({
    onCancel,
    onConfirm,
  }: {
    onCancel?: () => void;
    onConfirm?: () => void;
  }) => {
    const { safeAreaInsets, navBarHeight } = useSystemMetrics();
    return (
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'timing', duration: 500 }}
        css={`
          padding-top: ${safeAreaInsets.top}px;
          height: ${navBarHeight}px;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding-left: 15px;
          padding-right: 15px;
        `}
      >
        <TouchableOpacity onPress={onCancel}>
          <Ionicons name="arrow-undo-circle-outline" size={28} color="white" />
        </TouchableOpacity>
        <DoneButton text="完成" onPress={onConfirm} />
      </MotiView>
    );
  },
);

export const AddCsutomTagScreen = wrapNavigatorScreen(
  ({
    onCancel,
    onDone,
  }: {
    onCancel?: () => void;
    onDone?: (name: string, colorStyle?: AnnotationTagColorStyle) => void;
  }) => {
    const insets = useSafeAreaInsets();
    const [name, setName] = useState<string>('');
    const [colorStyle, setColorStyle] = useState<AnnotationTagColorStyle>();
    const onConfirm = useCallback(() => {
      onDone?.(name, colorStyle);
    }, [onDone, name, colorStyle]);
    return (
      <KeyboardAvoidingView
        behavior="padding"
        css={`
          flex: 1;
          background-color: rgba(0, 0, 0, 0.1);
        `}
      >
        <BlurView
          intensity={50}
          style={StyleSheet.absoluteFill}
          css={`
            flex: 1;
            background-color: rgba(0, 0, 0, 0.1);
          `}
        ></BlurView>
        <View
          css={`
            flex: 1;
          `}
        >
          <Header onCancel={onCancel} onConfirm={onConfirm} />
          <TextInput
            value={name}
            onChangeText={setName}
            selectionColor={StatusColors.Success}
            autoFocus
            returnKeyLabel="完成"
            returnKeyType="done"
            css={`
              font-family: ${FontFamily.NotoSans.Light};
              font-size: 32px;
              line-height: 44px;
              padding: 10px 15px;
              margin-top: 100px;
              color: ${colorStyle?.fill ?? DefaultAnnotationTagStyle.textFill};
            `}
            onEndEditing={onConfirm}
          />
          <TagColorPicker
            selectedColor={colorStyle?.fill}
            onChange={setColorStyle}
            css={`
              position: absolute;
              left: 15px;
              right: 15px;
              bottom: ${Math.min(insets.bottom, 24)}px;
            `}
          />
        </View>
      </KeyboardAvoidingView>
    );
  },
  {
    presentation: 'transparentModal',
    headerShown: false,
    cardOverlayEnabled: false,
    animationEnabled: false,
    cardStyle: {
      backgroundColor: 'transparent',
    },
  },
);
