/* eslint-disable @typescript-eslint/no-use-before-define */
import { Label } from '@euler/components/typography/Label';
import {
  getDefectiveLevelBgColor,
  getDefectiveLevelColor,
  getDefectiveLevelText,
} from '@euler/functions';
import { DefectiveLevel } from '@euler/model';
import { memo, useCallback } from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme } from 'styled-components';

export const ItemOptionCell = memo(
  ({
    index,
    title,
    defectiveLevel,
    selected,
    style,
    onSelected,
  }: {
    index: number;
    title: string;
    defectiveLevel: DefectiveLevel;
    selected?: boolean;
    style?: StyleProp<ViewStyle>;
    onSelected?: (index: number) => void;
  }) => {
    const theme = useTheme();
    const {
      inspection: {
        siteInspection: {
          itemCard: {
            unselectedOptionTextColor,
            unselectedOptionBgColor,
            optionBorderColor,
          },
        },
      },
    } = theme;
    const onOptionPress = useCallback(() => {
      if (selected) return;
      onSelected?.(index);
    }, [index, onSelected, selected]);
    const textColor = selected
      ? getDefectiveLevelColor(theme, defectiveLevel)
      : unselectedOptionTextColor;
    const bgColor = selected
      ? getDefectiveLevelBgColor(theme, defectiveLevel)
      : unselectedOptionBgColor;
    const borderColor = selected ? textColor : optionBorderColor;
    const statusText = selected ? getDefectiveLevelText(defectiveLevel) : '';
    return (
      <TouchableOpacity
        onPress={onOptionPress}
        css={`
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          flex-wrap: nowrap;
          background-color: ${bgColor};
          border-width: 1px;
          border-color: ${borderColor};
          height: 39px;
          border-radius: 5px;
          padding: 0 15px;
        `}
        style={style}
      >
        <Label
          light
          size={15}
          css={`
            flex: 1;
          `}
          color={textColor}
          numberOfLines={1}
        >
          {title}
        </Label>
        <Label light size={15} color={textColor} numberOfLines={1}>
          {statusText}
        </Label>
      </TouchableOpacity>
    );
  },
);
