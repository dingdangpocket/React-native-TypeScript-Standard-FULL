import { useContainerLayout } from '@euler/app/components/layout/LayoutProvider';
import { InspectionNavHeader } from '@euler/app/flows/task/pages/inspection/components/InspectionNavHeader';
import { InspectionSiteGridView } from '@euler/app/flows/task/pages/inspection/components/InspectionSiteGrid';
import { Center } from '@euler/components';
import { Label } from '@euler/components/typography/Label';
import { wrapNavigatorScreen } from '@euler/functions';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationOptions } from '@react-navigation/stack';
import { AnimatePresence, MotiView } from 'moti';
import { useCallback, useMemo, useState } from 'react';
import { ScrollView, TouchableWithoutFeedback, View } from 'react-native';
import { ItemInfo } from './functions/InspectionSiteGrid';

export const InspectionSiteSearchScreen = wrapNavigatorScreen(
  ({
    sites,
    onSelect,
  }: {
    sites: ItemInfo[];
    onSelect?: (item: ItemInfo) => void;
  }) => {
    const navigation = useNavigation();
    const { width } = useContainerLayout();
    const [searchText, setSearchText] = useState<string>();

    const onSearchInputTextChange = useCallback((text: string) => {
      setSearchText(text);
    }, []);

    const matchedItems = useMemo(() => {
      const keyword = searchText?.trim();
      if (!keyword) return [];
      const pattern = keyword.toLowerCase();
      return sites.filter(
        x =>
          x.code.toLowerCase().includes(pattern) ||
          x.name.toLowerCase().includes(pattern),
      );
    }, [searchText, sites]);

    const onCellPress = useCallback(
      (item: ItemInfo) => {
        onSelect?.(item);
      },
      [onSelect],
    );

    return (
      <AnimatePresence>
        <View
          css={`
            flex: 1;
          `}
        >
          <InspectionNavHeader
            hideRightButtons
            searchInputEditable
            searchText={searchText}
            onSearchInputChange={onSearchInputTextChange}
          />
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              flexGrow: 1,
              minHeight: 0,
            }}
          >
            {!matchedItems.length ? (
              <Center
                css={`
                  flex: 1;
                  padding: 15px 32px;
                `}
              >
                <Label light color="#555">
                  {searchText?.trim().length
                    ? '未找到检测部位? 试试调整搜索关键词，支持按拼音首字母或部位中文名称搜索'
                    : '支持按拼音首字母或部位中文名称搜索'}
                </Label>
              </Center>
            ) : null}
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <InspectionSiteGridView
                items={matchedItems}
                width={width}
                showPlaceholder={false}
                onCellPress={onCellPress}
              />
            </MotiView>
            <TouchableWithoutFeedback
              onPress={() => {
                navigation.goBack();
              }}
            >
              <View
                css={`
                  flex: 1;
                `}
              />
            </TouchableWithoutFeedback>
          </ScrollView>
        </View>
      </AnimatePresence>
    );
  },
  {
    presentation: 'transparentModal',
    cardOverlayEnabled: true,
    cardStyle: { backgroundColor: 'white' },
    animationEnabled: false,
    headerShown: false,
    gestureEnabled: false,
  } as StackNavigationOptions,
);
