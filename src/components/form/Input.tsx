/* eslint-disable @typescript-eslint/no-use-before-define */

import { MaybeText } from '@euler/components/MaybeText';
import { FontFamily } from '@euler/components/typography';
import { ValidateError, ValidateErrorObject } from '@euler/lib/form/controller';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { AnimatePresence, motify, MotiView } from 'moti';
import { identity, juxt, partial } from 'ramda';
import {
  FC,
  memo,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from 'styled-components/native';

const MotiTextInput = motify(TextInput)();
const MotiBottomSheetTextInput = motify(BottomSheetTextInput)();

type ErrorDisplayStyle = 'default' | 'tip';

const baseStyle = {
  borderRadius: 8,
  borderWidth: 2,
  padding: 10,
  contentHeight: 22,
  errorBottomOffset: -4,
  inputOffsetOnError: -8,
};

// represents the height for single line text input
const InputContainer = memo(
  ({
    focused,
    loading,
    errorMsg,
    errorBottomOffset,
    showError,
    multiline,
    style,
    borderWidth,
    children,
    tag,
  }: {
    focused: boolean;
    showError: boolean;
    style?: StyleProp<ViewStyle>;
    loading?: boolean;
    errorMsg?: ReactNode;
    errorBottomOffset: number;
    multiline?: boolean;
    borderWidth: number;
    tag?: string;
    children?: (props: {
      errorDisplayStyle: ErrorDisplayStyle | undefined;
      height: number;
    }) => ReactNode;
  }) => {
    const errorMsgRef = useRef<View>(null);
    const count = useRef(0);
    const {
      form: {
        input: { borderColor, borderColorError, borderColorFocused },
      },
    } = useTheme();

    const [errorDisplayStyle, setErrorDisplayStyle] =
      useState<ErrorDisplayStyle>();

    const [height, setHeight] = useState<number>();

    useEffect(() => {
      if (!height) return;

      if (!showError) {
        setErrorDisplayStyle(undefined);
        return;
      }

      if (multiline) {
        // always use the default display style for multiline text
        setErrorDisplayStyle('default');
        console.log('set display style: default');
      } else {
        errorMsgRef.current!.measureInWindow((...[, , , h]) => {
          if (
            h + errorBottomOffset - borderWidth >=
            height / 2 - 2 /* small margin */
          ) {
            console.log('set display style: tip');
            setErrorDisplayStyle('tip');
          } else {
            console.log('set display style: default');
            setErrorDisplayStyle('default');
          }
        });
      }
    }, [showError, multiline, height, borderWidth, errorBottomOffset]);

    const onLayout = useCallback(
      (e: LayoutChangeEvent) => {
        const h = e.nativeEvent.layout.height;
        if (h !== height) {
          setHeight(h);
        }
      },
      [height],
    );

    count.current++;
    if (tag) {
      console.log(`[${tag}] input container render #` + count.current);
    }

    return (
      <View
        css={`
          border-radius: ${baseStyle.borderRadius}px;
          border-width: ${borderWidth}px;
          border-color: ${showError
            ? borderColorError
            : focused
            ? borderColorFocused
            : borderColor};
        `}
        style={style}
        onLayout={onLayout}
      >
        {children?.({ errorDisplayStyle, height: height ?? 0 })}
        {loading && (
          <View
            css={`
              position: absolute;
              right: 0;
              top: 0;
              bottom: 0;
              padding-right: 10px;
              flex-direction: row;
              align-items: center;
              justify-content: flex-end;
            `}
          >
            <ActivityIndicator
              size="small"
              style={{
                transform: [{ scale: 0.8 }],
              }}
            />
          </View>
        )}
        {errorMsg ? (
          <View
            ref={errorMsgRef}
            css={`
              position: absolute;
              left: 10px;
              right: 10px;
              bottom: 0px;
              opacity: 0;
            `}
          >
            <ErrorText errorMsg={errorMsg}></ErrorText>
          </View>
        ) : null}
      </View>
    );
  },
);

const cssvalue = (x: string | number | undefined, d = 0): number => {
  if (x == null) return d;
  if (typeof x === 'string') return parseInt(x) || d;
  return x;
};

export const Input: FC<
  TextInputProps & {
    errorMsg?: ValidateError | ValidateErrorObject | null;
    loading?: boolean;
    inputRef?: RefObject<TextInput>;
    tag?: string;
    alwaysShowError?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
    bottomSheet?: boolean;
    errorBottomOffset?: number;
  }
> = memo(
  ({
    style,
    errorMsg,
    loading,
    inputRef,
    tag,
    alwaysShowError,
    containerStyle,
    bottomSheet,
    errorBottomOffset = baseStyle.errorBottomOffset,
    ...props
  }) => {
    const [focused, setFocused] = useState(false);
    const interacted = useRef(false);
    const changeInteracted = () => (interacted.current = true);
    const {
      form: {
        input: {
          textColor,
          textColorError,
          textColorFocused,
          placeholderColor,
        },
      },
    } = useTheme();
    const showError = Boolean(
      ((interacted.current && !focused) ||
        (!focused && alwaysShowError) ||
        errorMsg instanceof ValidateErrorObject) &&
        errorMsg,
    );
    if (errorMsg && errorMsg instanceof ValidateErrorObject) {
      errorMsg = errorMsg.error;
    }
    const flatternedStyle = StyleSheet.flatten(style) ?? ({} as ViewStyle);
    const padding = {
      left: cssvalue(flatternedStyle.paddingLeft, baseStyle.padding),
      right: cssvalue(flatternedStyle.paddingRight, baseStyle.padding),
      top: cssvalue(flatternedStyle.paddingTop, baseStyle.padding),
      bottom: cssvalue(flatternedStyle.paddingBottom, baseStyle.padding),
    };
    const borderWidth = cssvalue(
      flatternedStyle.borderWidth ??
        flatternedStyle.borderTopWidth ??
        flatternedStyle.borderBottomWidth,
      baseStyle.borderWidth,
    );
    return (
      <InputContainer
        borderWidth={borderWidth}
        focused={focused}
        loading={loading}
        errorMsg={errorMsg}
        errorBottomOffset={errorBottomOffset}
        showError={showError}
        tag={tag}
        style={containerStyle}
      >
        {({ errorDisplayStyle, height }) => (
          <>
            {bottomSheet ? (
              <MotiBottomSheetTextInput
                ref={inputRef}
                scrollEnabled={false}
                transition={{ type: 'timing', duration: 200 }}
                animate={{
                  translateY:
                    errorDisplayStyle === 'default'
                      ? baseStyle.inputOffsetOnError
                      : 0,
                }}
                css={`
                  padding: ${baseStyle.padding}px;
                  color: ${showError
                    ? textColorError
                    : focused
                    ? textColorFocused
                    : textColor};
                  font-family: ${showError
                    ? FontFamily.NotoSans.Bold
                    : props.value
                    ? FontFamily.NotoSans.Medium
                    : FontFamily.NotoSans.Light};
                `}
                placeholderTextColor={placeholderColor}
                clearButtonMode={'never'}
                {...props}
                onFocus={juxt([
                  props.onFocus ?? identity,
                  partial(setFocused, [true]),
                  changeInteracted,
                ])}
                onBlur={juxt([
                  props.onBlur ?? identity,
                  partial(setFocused, [false]),
                ])}
                style={[style]}
              />
            ) : (
              <MotiTextInput
                ref={inputRef}
                scrollEnabled={false}
                transition={{ type: 'timing', duration: 200 }}
                animate={{
                  translateY:
                    errorDisplayStyle === 'default'
                      ? baseStyle.inputOffsetOnError
                      : 0,
                }}
                css={`
                  padding: ${baseStyle.padding}px;
                  color: ${showError
                    ? textColorError
                    : focused
                    ? textColorFocused
                    : textColor};
                  font-family: ${showError
                    ? FontFamily.NotoSans.Bold
                    : props.value
                    ? FontFamily.NotoSans.Medium
                    : FontFamily.NotoSans.Light};
                `}
                placeholderTextColor={placeholderColor}
                clearButtonMode={'never'}
                {...props}
                onFocus={juxt([
                  props.onFocus ?? identity,
                  partial(setFocused, [true]),
                  changeInteracted,
                ])}
                onBlur={juxt([
                  props.onBlur ?? identity,
                  partial(setFocused, [false]),
                ])}
                style={[style]}
              />
            )}
            <InputError
              left={padding.left}
              right={padding.right}
              containerHeight={height - padding.top - padding.bottom + 4}
              errorDisplayStyle={errorDisplayStyle}
              errorBottomOffset={errorBottomOffset}
              errorMsg={errorMsg}
            />
          </>
        )}
      </InputContainer>
    );
  },
);

const InputError = memo(
  ({
    containerHeight,
    left,
    right,
    errorMsg,
    errorDisplayStyle,
    errorBottomOffset,
  }: {
    containerHeight: number;
    left: number;
    right: number;
    errorDisplayStyle?: ErrorDisplayStyle;
    errorMsg?: ReactNode;
    errorBottomOffset: number;
  }) => {
    return (
      <AnimatePresence>
        {errorMsg && errorDisplayStyle && (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            css={`
              position: absolute;
              left: ${errorDisplayStyle === 'default' ? left : 0}px;
              right: ${errorDisplayStyle === 'default' ? right : 0}px;
              bottom: ${errorDisplayStyle === 'default'
                ? errorBottomOffset
                : containerHeight}px;
              background-color: transparent;
            `}
          >
            {errorDisplayStyle === 'default' ? (
              <ErrorText errorMsg={errorMsg}></ErrorText>
            ) : (
              <ErrorTip errorMsg={errorMsg} />
            )}
          </MotiView>
        )}
      </AnimatePresence>
    );
  },
);

export const ErrorText = memo(
  ({
    errorMsg,
    style,
  }: {
    errorMsg?: ReactNode;
    style?: StyleProp<TextStyle>;
  }) => {
    const theme = useTheme();
    return (
      <MaybeText
        text={errorMsg}
        numberOfLines={0}
        css={`
          color: ${theme.form.input.borderColorError};
          font-size: 11px;
          line-height: 14px;
          font-family: ${FontFamily.NotoSans.Regular};
        `}
        style={style}
      />
    );
  },
);

const ErrorTip = memo(
  (props: { errorMsg: ReactNode; style?: StyleProp<ViewStyle> }) => {
    const theme = useTheme();
    return (
      <View>
        <View
          css={`
            background-color: ${theme.form.input.borderColorError};
            border-radius: 4px;
            padding: 5px 10px;
          `}
          style={props.style}
        >
          <ErrorText
            errorMsg={props.errorMsg}
            css={`
              color: #fff;
              line-height: 16px;
            `}
          />
        </View>
        <View
          css={`
            background-color: transparent;
            width: 0;
            height: 0;
            margin-left: 20px;
            border-width: 5px;
            border-color: transparent;
            border-top-color: ${theme.form.input.borderColorError};
          `}
        />
      </View>
    );
  },
);
