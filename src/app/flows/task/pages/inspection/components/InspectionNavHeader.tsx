/* eslint-disable @typescript-eslint/no-use-before-define */
import { Label } from '@euler/components/typography/Label';
import { useSystemMetrics } from '@euler/functions';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { FC, memo, useCallback, useRef } from 'react';
import {
  LayoutChangeEvent,
  LayoutRectangle,
  StyleProp,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, {
  interpolateColor,
  scrollTo,
  SharedValue,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { css, useTheme } from 'styled-components/native';

type SearchInputProps = {
  searchInputEditable?: boolean;
  searchText?: string;
  onSearchInputPress?: () => void;
  onSearchInputChange?: (text: string) => void;
};

type ScrollerProps = {
  activeIndex?: SharedValue<number>;
  scrollerItems?: string[];
  onScrollerItemPress?: (index: number) => void;
};

type Props = {
  hideRightButtons?: boolean;
  onLayout?: (e: LayoutChangeEvent) => void;
} & SearchInputProps &
  ScrollerProps;

const kSearchInputHeight = 36;
const kNavButtonSize = 36;

export const InspectionNavHeader = memo(
  ({
    activeIndex,
    scrollerItems,
    onLayout,
    onScrollerItemPress,
    ...searchInputProps
  }: Props) => {
    const defaultActiveIndex = useSharedValue(0);
    const { navBarHeight, safeAreaInsets } = useSystemMetrics();
    const theme = useTheme();
    return (
      <View
        css={`
          background-color: ${theme.inspection.siteGrid.headerBgColor};
        `}
        onLayout={onLayout}
      >
        {/** shade */}
        <LinearGradient
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 1 }}
          colors={['#006be4', '#5ba0e0']}
          locations={[0.335, 1]}
          style={StyleSheet.absoluteFill}
          css={`
            flex: 1;
          `}
        />

        {/** search bar */}
        <SearchNavBar
          css={`
            height: ${navBarHeight}px;
            padding-top: ${safeAreaInsets.top}px;
            margin-bottom: 12px;
          `}
          {...searchInputProps}
        />

        {/** scroller */}
        {scrollerItems && scrollerItems.length > 2 ? (
          <Scroller
            activeIndex={activeIndex ?? defaultActiveIndex}
            items={scrollerItems}
            onItemPress={onScrollerItemPress}
          />
        ) : null}
      </View>
    );
  },
);

const ScrollerItem = memo(
  ({
    text,
    index,
    activeIndex,
    onLayout,
    onPress,
  }: {
    text: string;
    index: number;
    activeIndex: SharedValue<number>;
    onLayout: (index: number, layout: LayoutRectangle) => void;
    onPress?: (index: number) => void;
  }) => {
    const isActive = useDerivedValue(() =>
      index === activeIndex.value ? 1 : 0,
    );
    const progress = useDerivedValue(() =>
      withTiming(isActive.value, { duration: 200 }),
    );
    const style = useAnimatedStyle(() => {
      return {
        backgroundColor: interpolateColor(
          progress.value,
          [0, 1],
          ['transparent', '#046ad6'],
        ),
        borderColor: interpolateColor(
          progress.value,
          [0, 1],
          ['rgba(255, 255, 255, 0.15)', '#fff'],
        ),
      };
    });

    const onInternalPress = useCallback(() => {
      onPress?.(index);
    }, [index, onPress]);

    const onInternalLayout = useCallback(
      (e: LayoutChangeEvent) => {
        onLayout(index, e.nativeEvent.layout);
      },
      [index, onLayout],
    );

    return (
      <Animated.View
        style={style}
        css={`
          margin-right: 10px;
          height: 26px;
          border-radius: 13px;
          border-width: 1px;
        `}
        onLayout={onInternalLayout}
      >
        <TouchableOpacity
          css={`
            flex: 1;
            padding: 0 12px;
            align-items: center;
            justify-content: center;
          `}
          onPress={onInternalPress}
        >
          <Label light size={14} color="#fff">
            {text}
          </Label>
        </TouchableOpacity>
      </Animated.View>
    );
  },
);

const Scroller = memo(
  ({
    activeIndex,
    items,
    onItemPress,
  }: {
    activeIndex: SharedValue<number>;
    items: string[];
    onItemPress?: (index: number) => void;
  }) => {
    const layouts = useSharedValue<LayoutRectangle[]>([]);
    const calculatedLayouts = useRef<LayoutRectangle[]>([]).current;
    const onItemLayout = useCallback(
      (index: number, layout: LayoutRectangle) => {
        if (calculatedLayouts.length !== items.length) {
          calculatedLayouts.length = items.length;
        }
        calculatedLayouts[index] = layout;
        for (let i = 0; i < items.length; i++) {
          if (!calculatedLayouts[i]) return;
        }
        layouts.value = calculatedLayouts.map(x => x);
      },
      [calculatedLayouts, items.length, layouts],
    );

    const scrollViewRef = useAnimatedRef<ScrollView>();
    const scrollOffset = useDerivedValue(
      () => layouts.value[activeIndex.value],
    );
    useDerivedValue(() => {
      if (!scrollOffset.value) return;
      scrollTo(
        scrollViewRef,
        scrollOffset.value.x - 10,
        scrollOffset.value.y,
        true,
      );
    });

    return (
      <ScrollView
        horizontal
        ref={scrollViewRef}
        css={`
          margin-top: 0;
          margin-bottom: 10px;
        `}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 8,
          paddingBottom: 8,
          paddingLeft: 10,
          paddingRight: 10,
        }}
      >
        {items.map((text, index) => (
          <ScrollerItem
            key={index}
            index={index}
            text={text}
            activeIndex={activeIndex}
            onLayout={onItemLayout}
            onPress={onItemPress}
          />
        ))}
      </ScrollView>
    );
  },
);

const NavButton: FC<{ onPress?: () => void; style?: StyleProp<ViewStyle> }> =
  memo(({ style, onPress, children }) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        css={`
          padding-left: 8px;
          padding-right: 8px;
          height: ${kNavButtonSize}px;
          align-items: center;
          justify-content: center;
        `}
        style={style}
      >
        {children}
      </TouchableOpacity>
    );
  });

const SearchBox = memo(
  ({
    onSearchInputPress,
    searchText,
    searchInputEditable,
    onSearchInputChange,
  }: SearchInputProps) => {
    const wrapperCss = css`
      background-color: #fff;
      height: ${kSearchInputHeight}px;
      border-radius: ${kSearchInputHeight / 2}px;
      padding: 0 20px;
      flex: 1;
    `;

    if (searchInputEditable) {
      return (
        <View
          css={`
            ${wrapperCss}
          `}
        >
          <TextInput
            placeholder="搜索检测项目或指标"
            value={searchText ?? ''}
            onChangeText={onSearchInputChange}
            autoFocus
            css={`
              flex: 1;
            `}
          />
        </View>
      );
    }
    return (
      <TouchableOpacity
        onPress={onSearchInputPress}
        activeOpacity={0.9}
        css={`
          ${wrapperCss};
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
        `}
      >
        <Feather name="search" size={16} color="#999" />
        <Label
          size={14}
          light
          color="#999"
          css={`
            margin-left: 10px;
          `}
        >
          搜索检测项目或指标
        </Label>
      </TouchableOpacity>
    );
  },
);

const SearchNavBar = memo(
  ({
    hideRightButtons,
    style,
    ...searchInputProps
  }: {
    hideRightButtons?: boolean;
    style?: StyleProp<ViewStyle>;
  } & SearchInputProps) => {
    const navigation = useNavigation();
    return (
      <View
        style={style}
        css={`
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          flex-wrap: nowrap;
        `}
      >
        <NavButton onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={34} color="#fff" />
        </NavButton>
        <SearchBox {...searchInputProps} />
        {hideRightButtons ? (
          <View
            css={`
              width: ${kNavButtonSize + 10}px;
            `}
          />
        ) : (
          <>
            <NavButton>
              <Feather name="bluetooth" size={20} color="#fff" />
            </NavButton>
            <NavButton>
              <Ionicons
                name="ios-ellipsis-vertical-sharp"
                size={24}
                color="#fff"
              />
            </NavButton>
          </>
        )}
      </View>
    );
  },
);
