import { ListItemCheckmark } from '@euler/app/components';
import { AddVehilceInfoHeaderItem } from '@euler/app/flows/order/components/AddVehicleInfoHeaderItem';
import { AlphabetIndex } from '@euler/app/flows/order/components/AlphabetIndex';
import { Separator } from '@euler/app/flows/order/components/Separator';
import { useVehicleBrandList } from '@euler/app/flows/order/functions/useVehicleBrandList';
import { OrderNavParams } from '@euler/app/flows/order/OrderFlow';
import { Avatar } from '@euler/components';
import { AdvancedImage } from '@euler/components/adv-image/AdvancedImage';
import { FontFamily } from '@euler/components/typography';
import { wrapNavigatorScreen } from '@euler/functions';
import { VehicleBrandInfo, VehicleModelInfo } from '@euler/model/vehicle';
import getSectionListItemLayout from '@euler/utils/getSectionListItemLayout';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  SectionList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components';

type Item = VehicleBrandInfo & {
  first?: boolean;
  last?: boolean;
  initial: string;
};

type Section = { title: string; data: Item[] };

const kSectionHeaderHeight = 25;
const kItemHeight = 56;

const SectionHeader = memo(({ text }: { text: string }) => {
  const theme = useTheme();
  return (
    <View
      css={`
        height: ${kSectionHeaderHeight}px;
        padding: 0 15px;
        justify-content: center;
        background-color: ${theme.page.background};
      `}
    >
      <Text
        css={`
          font-family: ${FontFamily.NotoSans.Bold};
          font-size: 14px;
          color: #000;
        `}
      >
        {text}
      </Text>
    </View>
  );
});

const Cell = memo(
  ({
    item,
    selected,
    onPress,
  }: {
    item: Item;
    selected?: boolean;
    onPress?: (item: VehicleBrandInfo) => void;
  }) => {
    const theme = useTheme();
    const onItemPress = useCallback(() => {
      onPress?.(item);
    }, [item, onPress]);

    return (
      <TouchableOpacity
        onPress={onItemPress}
        css={`
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          background-color: ${theme.components.table.item.backgroundColor};
          height: ${kItemHeight}px;
          padding-left: 15px;
          padding-right: 15px;
        `}
      >
        {!item.last && (
          <Separator
            css={`
              bottom: 0;
              left: 15px;
            `}
          />
        )}
        {item.logo ? (
          <AdvancedImage
            uri={item.logo}
            css={`
              width: 35px;
              height: 35px;
              margin-right: 20px;
            `}
          />
        ) : (
          <Avatar
            name={item.name}
            textStyle={{ fontFamily: FontFamily.NotoSans.Light, fontSize: 16 }}
            css={`
              width: 35px;
              height: 35px;
              border-radius: 17.5px;
              margin-right: 20px;
            `}
          />
        )}
        <Text
          css={`
            flex: 1;
            font-family: ${FontFamily.NotoSans.Regular};
            font-size: 15px;
            color: #000;
          `}
        >
          {item.name}
        </Text>
        <ListItemCheckmark
          checked={selected}
          css={`
            margin-right: 24px;
          `}
        />
      </TouchableOpacity>
    );
  },
);

export const VehicleBrandSelectorScreen = wrapNavigatorScreen(
  ({
    selected,
    onSelect,
  }: {
    selected?: {
      brand: string | undefined;
      model: string | undefined;
    };
    onSelect?: (brand: string, model: VehicleModelInfo) => void;
  }) => {
    const insets = useSafeAreaInsets();
    const brands = useVehicleBrandList();
    const { sections, indics, count } = useMemo(() => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const itemLayouts = [];
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const sections: Section[] = [];
      const map = new Map<string, Section>();
      let offset = 0;
      let index = 0;
      for (const brand of brands ?? []) {
        if (!map.has(brand.initial)) {
          map.set(brand.initial, { title: brand.initial, data: [] });
          sections.push(map.get(brand.initial)!);
          itemLayouts.push({
            length: kSectionHeaderHeight,
            offset,
            index: index++,
          });
          offset += kSectionHeaderHeight;
        }
        itemLayouts.push({
          length: kItemHeight,
          offset,
          index: index++,
        });
        offset += kItemHeight;
        map.get(brand.initial)!.data.push(brand);
      }
      return {
        sections,
        itemLayouts,
        indics: sections.map(x => x.title),
        count: offset,
      };
    }, [brands]);

    const listRef = useRef<SectionList>(null);
    const onIndexChange = useCallback((index: number) => {
      listRef.current?.scrollToLocation({ sectionIndex: index, itemIndex: 0 });
    }, []);

    const [batch, setBatch] = useState(20);
    const navigation = useNavigation<StackNavigationProp<OrderNavParams>>();
    const onPress = useCallback(
      (item: Item) => {
        navigation.push('_vehicleModelSelector', {
          brand: item.name,
          selected: selected?.model,
          onSelect: (brand, model) => {
            navigation.goBack();
            onSelect?.(brand, model);
          },
        });
      },
      [navigation, onSelect, selected?.model],
    );

    useEffect(() => {
      if (count > 0) {
        setBatch(count);
      }
    }, [count]);

    useEffect(() => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const onPress = () => {
        navigation.navigate('_addVehicleInfo', {
          onConfirm: (brand, model) => {
            onSelect?.(brand, { name: model, manufacturer: '' });
            navigation.goBack();
          },
        });
      };
      navigation.setOptions({
        headerRight: () => <AddVehilceInfoHeaderItem onPress={onPress} />,
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!brands) {
      return (
        <View
          css={`
            flex: 1;
            align-items: center;
            justify-content: center;
          `}
        >
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <>
        <SectionList
          css={`
            flex: 1;
          `}
          ref={listRef}
          contentContainerStyle={{ paddingBottom: insets.bottom + 8 }}
          sections={sections}
          initialNumToRender={batch}
          keyExtractor={(item, index) => item.name + index}
          renderSectionHeader={({ section }) => (
            <SectionHeader text={section.title} />
          )}
          renderItem={({ item }) => (
            <Cell
              item={item}
              selected={item.name === selected?.brand}
              onPress={onPress}
            />
          )}
          getItemLayout={
            getSectionListItemLayout({
              getItemHeight: () => 56,
              getSectionHeaderHeight: () => 25,
              getSeparatorHeight: () => 0,
              getSectionFooterHeight: () => 0,
            }) as any
          }
        />
        <AlphabetIndex indics={indics} onChange={onIndexChange} />
      </>
    );
  },
  { title: '品牌选择' },
);
