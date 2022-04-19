import { DefaultSiteIcon } from '@euler/app/flows/task/pages/inspection/components/DefaultSiteIcon';
import { Center } from '@euler/components';
import { Img } from '@euler/components/adv-image/AdvancedImage';
import { Label } from '@euler/components/typography/Label';
import {
  getDefectiveLevelBgColor,
  getDefectiveLevelColor,
} from '@euler/functions';
import { sentry } from '@euler/lib/integration/sentry';
import { SiteGirdItemTag } from '@euler/typings/styled';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import { MotiView } from 'moti';
import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { SvgUri, SvgXml } from 'react-native-svg';
import { css, useTheme } from 'styled-components';
import * as InspectionSiteGrid from '../functions/InspectionSiteGrid';

const kNumberOfColumnsBase = 4;
const kNumberOfColumns = 4;
const kDefaultIconSize = 44;
const kCellContentOffset = 0.5;

type SiteGridCellInfo = (
  | { type: 'placeholder' }
  | (InspectionSiteGrid.ItemInfo & {
      type: 'item';
      end?: boolean;
    })
) & { first?: boolean; isFirstRow?: boolean; isLastRow?: boolean };

const Row: FC = memo(({ children }) => {
  return (
    <View
      css={`
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: stretch;
      `}
    >
      {children}
    </View>
  );
});

const TagIcon = memo(
  ({ tag, size = 13 }: { tag: SiteGirdItemTag; size?: number }) => {
    if (tag === 'hardware-capable') {
      return <Ionicons name="bluetooth" size={size} color="#fff" />;
    }
    if (tag === 'with-pending-issue') {
      return <Label color="#fff">遗</Label>;
    }
    if (tag === 'service') {
      return <Label color="#fff">保</Label>;
    }
    return null;
  },
);

// http://apps.eky.hk/css-triangle-generator/
const Badge: FC<{ size: number; color: string; tag: SiteGirdItemTag }> = memo(
  ({ size, color, tag }) => (
    <View
      css={`
        position: absolute;
        left: 0;
        top: 0;
        width: ${size}px;
        height: ${size}px;
        padding-top: 1px;
        padding-left: 1px;
      `}
    >
      <View
        css={`
          width: 0px;
          height: 0px;
          border-top-width: ${size}px;
          border-right-width: ${size}px;
          border-bottom-width: 0px;
          border-left-width: 0px;
          border-top-color: ${color};
          border-right-color: transparent;
          border-bottom-color: transparent;
          border-left-color: transparent;
          position: absolute;
          left: 0;
          top: 0;
        `}
      />
      <TagIcon tag={tag} />
    </View>
  ),
);

const SiteIcon = memo(
  ({
    url,
    type,
    color,
    size = kDefaultIconSize,
  }: {
    url?: string;
    type: InspectionSiteGrid.ItemInfo['iconType'];
    size?: number;
    color: string;
  }) => {
    const [svgXml, setSvgXml] = useState<string>();
    const [svgUrl, setSvgUrl] = useState<string>();

    useEffect(() => {
      if (!url || !type || type === 'image') return;
      Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.MD5, url)
        .then(async hash => {
          const key = `site-icon:${hash}`;
          const value = await AsyncStorage.getItem(key);
          if (value != null) {
            setSvgXml(value);
            return;
          }
          // load the content of the svg file.
          const resp = await fetch(url);
          if (resp.ok) {
            const content = await resp.text();
            await AsyncStorage.setItem(key, content);
            setSvgXml(content);
          } else {
            // fallback to the svg url;
            setSvgUrl(url);
          }
        })
        .catch(e => {
          sentry.captureException(e);
          // fallback to the svg url;
          setSvgUrl(url);
        });
    }, [url, type]);

    if (!url || !type) {
      return <DefaultSiteIcon size={size} color={color} />;
    }

    if (type === 'svg') {
      if (svgXml) {
        return <SvgXml xml={svgXml} width={size} height={size} />;
      }

      if (svgUrl) {
        return <SvgUri uri={svgUrl} width={size} height={size} />;
      }

      return (
        <Center
          css={`
            width: ${size}px;
            height: ${size}px;
          `}
        >
          <ActivityIndicator size="small" color={color} />
        </Center>
      );
    }

    return (
      <Img
        uri={url}
        resizeMode="contain"
        css={`
          width: ${size}px;
          height: ${size}px;
        `}
      />
    );
  },
);

const Cell = memo(
  ({
    item,
    size,
    showPlaceholder,
    onPress,
  }: {
    item: SiteGridCellInfo;
    size: number;
    showPlaceholder?: boolean;
    onPress?: (item: InspectionSiteGrid.ItemInfo) => void;
  }) => {
    const theme = useTheme();

    const onCellPress = useCallback(() => {
      if (item.type === 'placeholder') return;
      onPress?.(item);
    }, [item, onPress]);

    if (item.type === 'placeholder') {
      return (
        <View
          css={`
            width: ${size}px;
            height: ${size}px;
            flex-grow: 0;
            flex-shrink: 0;
            background-color: ${showPlaceholder !== false
              ? theme.inspection.siteGrid.cellBgColor
              : 'transparent'};
            ${showPlaceholder !== false
              ? css`
                  border-bottom-width: 1px;
                  border-bottom-color: ${theme.inspection.siteGrid.borderColor};
                `
              : ''};
            ${item.first || showPlaceholder !== false
              ? css`
                  border-left-width: 1px;
                  border-left-color: ${theme.inspection.siteGrid.borderColor};
                `
              : ''};
            ${showPlaceholder !== false && item.isFirstRow
              ? css`
                  border-top-width: 1px;
                  border-top-color: ${theme.inspection.siteGrid.borderColor};
                `
              : ''};
          `}
        />
      );
    }

    const { first, isFirstRow } = item;

    const backgroundColor = item.defectiveLevel
      ? getDefectiveLevelBgColor(theme, item.defectiveLevel)
      : undefined;

    return (
      <View
        css={`
          width: ${size}px;
          height: ${size}px;
          align-items: center;
          justify-content: center;
          flex-grow: 0;
          flex-shrink: 0;
          background-color: ${theme.inspection.siteGrid.cellBgColor};
          border-bottom-width: 1px;
          border-bottom-color: ${theme.inspection.siteGrid.borderColor};
          ${isFirstRow
            ? css`
                border-top-width: 1px;
                border-top-color: ${theme.inspection.siteGrid.borderColor};
              `
            : ''};
          ${first
            ? ''
            : css`
                border-left-width: 1px;
                border-left-color: ${theme.inspection.siteGrid.borderColor};
              `};
        `}
      >
        {backgroundColor ? (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            css={`
              background-color: ${backgroundColor};
              position: absolute;
              top: ${kCellContentOffset}px;
              left: ${kCellContentOffset}px;
              right: ${kCellContentOffset}px;
              bottom: ${kCellContentOffset}px;
            `}
          />
        ) : null}
        <TouchableOpacity
          css={`
            position: absolute;
            top: ${kCellContentOffset}px;
            left: ${kCellContentOffset}px;
            right: ${kCellContentOffset}px;
            bottom: ${kCellContentOffset}px;
            align-items: center;
            justify-content: center;
          `}
          onPress={onCellPress}
        >
          <SiteIcon
            url={item.icon}
            type={item.iconType}
            color={theme.inspection.siteGrid.siteIconColor}
          />
          <Label
            light
            size={14 * (kNumberOfColumnsBase / kNumberOfColumns)}
            color={
              item.defectiveLevel
                ? getDefectiveLevelColor(theme, item.defectiveLevel)
                : theme.inspection.siteGrid.defaultSiteNameColor
            }
          >
            {item.name}
          </Label>
        </TouchableOpacity>
        {item.tag ? (
          <Badge
            color={theme.inspection.siteGrid.tagColors[item.tag]}
            size={26}
            tag={item.tag}
          />
        ) : null}
      </View>
    );
  },
);

export const InspectionSiteGridView = memo(
  ({
    items,
    width,
    showPlaceholder,
    onCellPress,
  }: {
    items: InspectionSiteGrid.ItemInfo[];
    width: number;
    showPlaceholder?: boolean;
    onCellPress?: (item: InspectionSiteGrid.ItemInfo) => void;
  }) => {
    const theme = useTheme();
    const rows = useMemo(() => {
      const list: Array<SiteGridCellInfo[]> = [];
      const rowCount = Math.floor((items.length - 1) / kNumberOfColumns) + 1;

      let i = 0;
      while (i < items.length) {
        const slice = items.slice(i, i + kNumberOfColumns);
        list.push(
          slice.map((x, k) => ({
            type: 'item',
            ...x,
            first: k === 0,
            end: k === slice.length - 1 && slice.length < kNumberOfColumns,
            isFirstRow: list.length === 0,
            isLastRow: list.length === rowCount - 1,
          })),
        );
        i += kNumberOfColumns;
      }

      const lastRow = list[list.length - 1];
      if (lastRow) {
        let beginPlaceholder = true;
        while (lastRow.length < kNumberOfColumns) {
          lastRow.push({
            type: 'placeholder',
            first: beginPlaceholder,
            isFirstRow: list.length === 1,
            isLastRow: list.length === 1,
          });
          beginPlaceholder = false;
        }
      }

      return list;
    }, [items]);
    const size = Math.round(width / kNumberOfColumns);
    return (
      <View
        css={`
          //background-color: ${theme.inspection.siteGrid.cellBgColor};
        `}
      >
        {rows.map((row, i) => (
          <Row key={i}>
            {row.map((item, j) => (
              <Cell
                showPlaceholder={showPlaceholder}
                item={item}
                key={
                  item.type === 'item' ? item.siteId : `placeholder-${i}-${j}`
                }
                size={size}
                onPress={onCellPress}
              />
            ))}
          </Row>
        ))}
      </View>
    );
  },
);
