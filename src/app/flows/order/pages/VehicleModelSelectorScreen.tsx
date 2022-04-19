import { ListItemCheckmark } from '@euler/app/components';
import { AddVehilceInfoHeaderItem } from '@euler/app/flows/order/components/AddVehicleInfoHeaderItem';
import { Separator } from '@euler/app/flows/order/components/Separator';
import { useVehicleModelList } from '@euler/app/flows/order/functions/useVehicleModelList';
import { OrderNavParams } from '@euler/app/flows/order/OrderFlow';
import { Center } from '@euler/components';
import { AdvancedImage } from '@euler/components/adv-image/AdvancedImage';
import { FontFamily } from '@euler/components/typography';
import { wrapNavigatorScreen } from '@euler/functions';
import { VehicleModelInfo } from '@euler/model/vehicle';
import getSectionListItemLayout from '@euler/utils/getSectionListItemLayout';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { memo, useCallback, useEffect, useMemo } from 'react';
import {
  ActivityIndicator,
  SectionList,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components';

type Item = VehicleModelInfo & {
  first?: boolean;
  last?: boolean;
};

type Section = { title: string; data: Item[] };

const kSectionHeaderHeight = 30;
const kItemHeight = 60;

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
    onPress?: (item: VehicleModelInfo) => void;
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
        {item.img ? (
          <AdvancedImage
            uri={item.img}
            css={`
              width: 67.5px;
              height: 45px;
              margin-right: 20px;
            `}
          />
        ) : (
          <Center
            css={`
              width: 67.5px;
              height: 45px;
              margin-right: 20px;
              background-color: #eee;
            `}
          >
            <Text
              css={`
                font-family: ${FontFamily.NotoSans.Regular};
                font-size: 12px;
                color: #ccc;
              `}
            >
              暂无图片
            </Text>
          </Center>
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
        <ListItemCheckmark checked={selected} />
      </TouchableOpacity>
    );
  },
);

export const VehicleModelSelectorScreen = wrapNavigatorScreen(
  ({
    brand,
    selected,
    onSelect,
  }: {
    brand: string;
    selected?: string;
    onSelect?: (brand: string, model: VehicleModelInfo) => void;
  }) => {
    const insets = useSafeAreaInsets();
    const models = useVehicleModelList(brand);
    const { sections } = useMemo(() => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const sections: Section[] = [];
      const map = new Map<string, Section>();
      for (const model of models ?? []) {
        if (!map.has(model.manufacturer)) {
          map.set(model.manufacturer, { title: model.manufacturer, data: [] });
          sections.push(map.get(model.manufacturer)!);
        }
        map.get(model.manufacturer)!.data.push(model);
      }
      return { sections };
    }, [models]);

    const navigation = useNavigation<StackNavigationProp<OrderNavParams>>();
    const onPress = useCallback(
      (item: Item) => {
        onSelect?.(brand, item);
        navigation.goBack();
      },
      [brand, navigation, onSelect],
    );

    useEffect(() => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const onPress = () => {
        navigation.navigate('_addVehicleInfo', {
          brand,
          // eslint-disable-next-line @typescript-eslint/no-shadow
          onConfirm: (brand, model) => {
            navigation.goBack();
            onSelect?.(brand, { name: model, manufacturer: '' });
          },
        });
      };
      navigation.setOptions({
        headerRight: () => <AddVehilceInfoHeaderItem onPress={onPress} />,
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!models) {
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
          contentContainerStyle={{ paddingBottom: insets.bottom + 8 }}
          sections={sections}
          initialNumToRender={50}
          keyExtractor={(item, index) => item.name + index}
          renderSectionHeader={({ section }) => (
            <SectionHeader text={section.title} />
          )}
          renderItem={({ item }) => (
            <Cell
              item={item}
              selected={item.name === selected}
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
      </>
    );
  },
  { title: '车系选择' },
);
