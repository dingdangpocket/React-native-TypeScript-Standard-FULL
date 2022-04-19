import { useContainerLayout } from '@euler/app/components/layout/LayoutProvider';
import {
  BoxConfig,
  LicensePlateNoInput,
} from '@euler/app/components/LicensePlateNoInput';
import { FontFamily } from '@euler/components/typography';
import { SafeHaptics } from '@euler/utils';
import { Ionicons } from '@expo/vector-icons';
import {
  memo,
  ReactElement,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ViewProps,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { css, useTheme } from 'styled-components';

export type KeyboardMode = 'province' | 'other';

const ProvinceChars: string[] = [
  '川贵云京沪苏浙粤渝',
  '冀鲁鄂闽皖赣黑吉辽',
  '蒙新藏宁桂青豫湘津',
  '晋甘陕琼港澳警',
];

const Chars: string[] = ['1234567890', 'QWERTYUP', 'ASDFGHJKL', 'ZXCVBNM'];

const kHorizontalMargin = 3;
const kVerticalMargin = 5;

type KeyColors = {
  bgColor: string;
  keyBgColor: string;
  funcKeyBgColor: string;
  keyColor: string;
  disabledKeyColor: string;
};

type FuncType = 'backspace' | 'done';
type KeyType = 'normal' | 'func';

type KeyPressEvent = {
  char: string;
  keyType: KeyType;
  funcType?: FuncType;
};

type KeyProps = {
  char: string;
  width: number;
  height: number;
  colors: KeyColors;
  keyType: KeyType;
  funcType?: FuncType;
  disabled?: boolean;
  onPress?: (e: KeyPressEvent) => void;
};

const Key = memo(
  ({
    char,
    width,
    height,
    colors,
    keyType,
    funcType,
    style,
    disabled,
    onPress,
    ...props
  }: KeyProps & Omit<ViewProps, 'onPress'>) => {
    const onInternalPress = useCallback(() => {
      SafeHaptics.impact();
      onPress?.({ char, keyType, funcType });
    }, [char, funcType, keyType, onPress]);
    const { keyBgColor, funcKeyBgColor, keyColor, disabledKeyColor } = colors;
    return (
      <TouchableOpacity
        style={style}
        onPress={onInternalPress}
        {...props}
        disabled={disabled}
        css={`
          ${keyType === 'normal'
            ? css`
                width: ${width}px;
              `
            : keyType === 'func' && funcType === 'backspace'
            ? css`
                width: ${height}px;
              `
            : ''};
          height: ${height}px;
          border-radius: 5px;
          background-color: ${keyType === 'normal'
            ? keyBgColor
            : funcType === 'done' && !disabled
            ? '#207FE7'
            : funcKeyBgColor};
          margin-left: ${kHorizontalMargin}px;
          margin-right: ${kHorizontalMargin}px;
          padding-left: ${funcType === 'done' ? '10px' : 0};
          padding-right: ${funcType === 'done' ? '10px' : 0};
          align-items: center;
          justify-content: center;
        `}
      >
        {keyType === 'func' && funcType === 'backspace' ? (
          <Ionicons name="ios-backspace-outline" size={24} color={keyColor} />
        ) : (
          <Text
            css={`
              font-family: ${FontFamily.NotoSans.Medium};
              font-size: 14px;
              line-height: 16px;
              text-align: center;
              color: ${disabled
                ? disabledKeyColor
                : funcType === 'done'
                ? '#fff'
                : keyColor};
            `}
          >
            {char}
          </Text>
        )}
      </TouchableOpacity>
    );
  },
);

type KeyInfo = {
  id: string;
  char: string;
  type: KeyType;
  func?: FuncType;
  disabled?: boolean;
};

type RowInfo = {
  keys: KeyInfo[];
};

const KeyRow = memo(
  ({
    keys,
    style,
    colors,
    keyWidth,
    keyHeight,
    onKeyPress,
    ...props
  }: {
    keyWidth: number;
    keyHeight: number;
    keys: KeyInfo[];
    colors: KeyColors;
    onKeyPress?: (e: KeyPressEvent) => void;
  } & ViewProps) => {
    return (
      <View
        css={`
          margin-top: ${kVerticalMargin}px;
          margin-bottom: ${kVerticalMargin}px;
          flex-direction: row;
          align-items: center;
          justify-content: center;
        `}
        style={style}
        {...props}
      >
        {keys.map(key => (
          <Key
            key={key.id}
            char={key.char}
            width={keyWidth}
            height={keyHeight}
            keyType={key.type}
            funcType={key.func}
            disabled={key.disabled}
            colors={colors}
            onPress={onKeyPress}
          />
        ))}
      </View>
    );
  },
);

type Render = (args: {
  renderInput: (props?: { boxConfig?: BoxConfig }) => ReactNode;
  renderKeypad: () => ReactNode;
}) => ReactElement;

type KeyboardProps = {
  value?: string;
  doneButtonText?: string;
  defaultSelectedIndex?: number;
  onDone?: (value: string) => void;
  onInputIndexChange?: (index: number) => void;
  children?: Render | undefined;
} & Omit<ViewProps, 'children'>;

export const LicensePlateNoKeyboard = memo(
  ({
    style,
    value,
    doneButtonText,
    children,
    defaultSelectedIndex,
    onDone,
    onInputIndexChange,
    ...props
  }: KeyboardProps) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const containerLayout = useContainerLayout();
    const { width: windowWidth } = useWindowDimensions();
    const [inputIndex, setInputIndex] = useState(defaultSelectedIndex ?? 0);
    const mode = useMemo<KeyboardMode>(
      () => (inputIndex === 0 ? 'province' : 'other'),
      [inputIndex],
    );
    const [plateValue, setPlateValue] = useState(value ?? '');
    const isValid = plateValue.length >= 7;
    const rows = useMemo<RowInfo[]>(() => {
      if (mode === 'province') {
        const charRows: RowInfo[] = ProvinceChars.map(chars => ({
          keys: chars.split('').map(char => ({
            id: char,
            char,
            type: 'normal',
          })),
        }));
        charRows[charRows.length - 1].keys.push({
          id: 'done',
          char: doneButtonText ?? 'Done',
          type: 'func',
          func: 'done',
          disabled: !isValid,
        });
        return charRows;
      } else {
        const charRows: RowInfo[] = Chars.map(chars => ({
          keys: chars.split('').map(char => ({
            id: char,
            char,
            type: 'normal',
          })),
        }));
        charRows[1].keys.push({
          id: 'backspace',
          char: '',
          type: 'func',
          func: 'backspace',
        });
        charRows[charRows.length - 1].keys.push({
          id: 'done',
          char: doneButtonText ?? 'Done',
          type: 'func',
          func: 'done',
          disabled: !isValid,
        });
        return charRows;
      }
    }, [mode, doneButtonText, isValid]);

    const width = containerLayout?.width ?? windowWidth;

    // always use the number of keys of the first row to determine
    // the key button dimension.
    const keyCount = Chars[0].length;
    const keyWidth = (width - keyCount * kHorizontalMargin * 2) / keyCount;
    const keyHeight = keyWidth / (36 / 42);

    const onKeyPress = useCallback(
      (e: KeyPressEvent) => {
        if (e.keyType === 'func') {
          if (e.funcType === 'backspace') {
            const chars = plateValue.split('');
            chars[inputIndex] = '';
            if (inputIndex - 1 >= 0 && inputIndex >= chars.length - 1) {
              setInputIndex(inputIndex - 1);
            }
            setPlateValue(chars.filter(x => x).join(''));
          } else if (e.funcType === 'done') {
            onDone?.(plateValue);
          }
        } else {
          if (mode === 'province') {
            const chars = plateValue.split('');
            chars[0] = e.char;
            setPlateValue(chars.join(''));
            setInputIndex(1);
          } else {
            const chars = plateValue.split('');
            chars[inputIndex] = e.char;
            const val = chars.join('');
            setPlateValue(val);
            if (inputIndex + 1 < 8) {
              setInputIndex(x => x + 1);
            }
          }
        }
      },
      [inputIndex, mode, onDone, plateValue],
    );

    const onInternalInputIndexChange = useCallback(
      (index: number) => {
        let targetIndex = 0;
        if (index === 0) {
          targetIndex = 0;
        } else if (index > 0) {
          targetIndex = Math.min(plateValue.length, index);
        }
        setInputIndex(targetIndex);
        onInputIndexChange?.(targetIndex);
      },
      [onInputIndexChange, plateValue.length],
    );

    const renderInput = (inputProps?: { boxConfig?: BoxConfig }) => {
      return (
        <LicensePlateNoInput
          value={plateValue}
          selectedIndex={inputIndex}
          onSelectedIndexChange={onInternalInputIndexChange}
          {...inputProps}
        />
      );
    };

    const renderKeypad = () => (
      <>
        {rows.map((row, index) => (
          <KeyRow
            key={`${mode}-${index}`}
            keys={row.keys}
            keyWidth={keyWidth}
            keyHeight={keyHeight}
            colors={theme.keyboard}
            onKeyPress={onKeyPress}
          />
        ))}
      </>
    );

    if (typeof children === 'function') {
      return children({ renderInput, renderKeypad });
    }

    return (
      <View
        style={style}
        {...props}
        css={`
          padding-bottom: ${insets.bottom}px;
          background-color: ${theme.keyboard.bgColor};
          box-shadow: 0 0 10px #ccc;
          elevation: 5;
        `}
      >
        <View
          css={`
            padding-top: 20px;
            padding-bottom: 10px;
          `}
        >
          {renderInput()}
        </View>
        {renderKeypad()}
      </View>
    );
  },
);
