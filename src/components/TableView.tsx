import { SwitchButton, SwitchButtonProps } from '@euler/components/Switch';
import { FontFamily } from '@euler/components/typography';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import React, { FC, memo, ReactElement, ReactNode, useCallback } from 'react';
import {
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from 'styled-components/native';

export type SectionProps = {
  index?: number;
  title?: ReactNode;
  style?: StyleProp<ViewStyle>;
  first?: boolean;
  last?: boolean;
};

export type Index = { section: number; row: number };

export type ItemProps = {
  tag?: string | null;
  disabled?: boolean;
  hidden?: boolean;
  icon?: Exclude<ReactNode, string | number>;
  title?: ReactNode;
  subTitle?: ReactNode;
  note?: ReactNode;
  detail?: ReactNode;
  detailIcon?: 'disclosure' | 'info' | 'info-outline' | ReactElement;
  isSwitch?: boolean;
  switchProps?: Omit<SwitchButtonProps, 'on' | 'style' | 'onChange'>;
  switchOn?: boolean;
  index?: Index;
  first?: boolean;
  last?: boolean;
  style?: StyleProp<ViewStyle>;
  cellContainerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  iconStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  noteStyle?: StyleProp<TextStyle>;
  switchStyle?: StyleProp<ViewStyle>;
  separatorStyle?: StyleProp<ViewStyle>;
  onPress?: (tag: string | null | undefined) => void;
  onSwitchChange?: (on: boolean, tag: string | null | undefined) => void;
};

const TableItem: FC<ItemProps> = memo(
  ({
    tag,
    disabled,
    hidden,
    icon,
    title,
    subTitle,
    note,
    detail,
    detailIcon,
    isSwitch,
    switchProps,
    switchOn,
    children,
    last,
    style,
    cellContainerStyle,
    contentContainerStyle,
    iconStyle,
    titleStyle,
    noteStyle,
    separatorStyle,
    switchStyle,
    onPress,
    onSwitchChange,
  }) => {
    const theme = useTheme();

    const onItemPress = useCallback(() => {
      onPress?.(tag);
    }, [onPress, tag]);

    const onItemSwitchChange = useCallback(
      (value: boolean) => {
        onSwitchChange?.(value, tag);
      },
      [onSwitchChange, tag],
    );

    if (hidden) return null;

    return (
      <View
        style={style}
        css={`
          flex-shrink: 0;
        `}
      >
        <View
          css={`
            position: absolute;
            background-color: ${theme.components.table.borderColor};
            height: ${last ? 0 : 1}px;
            left: 0;
            right: 0;
            bottom: 0;
          `}
          style={separatorStyle}
        />
        <TouchableOpacity
          onPress={onItemPress}
          disabled={disabled}
          activeOpacity={onPress ? undefined : 1}
          css={`
            flex-grow: 1;
            /** important: without shink set 0, the table
                view item will be  shrined when placing
                table view in scroll w/ dynamic contents
              */
            flex-shrink: 0;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            flex-wrap: nowrap;
            opacity: ${disabled ? 0.35 : 1};
            padding-left: 15px;
            padding-right: 15px;
            min-height: 44px;
          `}
          style={cellContainerStyle}
        >
          {/* icon */}
          {icon ? (
            <View
              css={`
                flex-shink: 0;
                flex-grow: 0;
              `}
              style={iconStyle}
            >
              {icon}
            </View>
          ) : null}
          {/* content */}
          <View
            css={`
              flex: 1;
              justify-content: center;
            `}
            style={contentContainerStyle}
          >
            <View
              css={`
                flex-direction: row;
                align-items: center;
                flex-wrap: nowrap;
              `}
            >
              {typeof title === 'string' || typeof title === 'number' ? (
                <Text
                  css={`
                    color: ${theme.components.table.item.titleColor};
                    font-family: ${FontFamily.NotoSans.Regular};
                    font-size: 14px;
                    line-height: 18px;
                  `}
                  style={titleStyle}
                >
                  {title}
                </Text>
              ) : (
                title
              )}
              {typeof subTitle === 'string' || typeof subTitle === 'number' ? (
                <Text
                  css={`
                    color: ${theme.components.table.item.subTitleColor};
                    font-family: ${FontFamily.NotoSans.Regular};
                    font-size: 12px;
                    line-height: 18px;
                    margin-left: 4px;
                  `}
                >
                  {subTitle}
                </Text>
              ) : (
                subTitle
              )}
            </View>
            {note && (typeof note === 'string' || typeof note === 'number') ? (
              <Text
                css={`
                  color: ${theme.components.table.item.noteColor};
                  font-family: ${FontFamily.NotoSans.Light};
                  font-size: 14px;
                  line-height: 16px;
                `}
                style={noteStyle}
              >
                {note}
              </Text>
            ) : (
              <>{note}</>
            )}
            {children}
          </View>
          {/* detail */}
          <View
            css={`
              flex-direction: row;
              align-items: center;
              justify-content: flex-end;
              flex-wrap: nowrap;
              margin-right: -10px;
            `}
          >
            {detail &&
            (typeof detail === 'string' || typeof detail === 'number') ? (
              <Text
                css={`
                  color: ${theme.components.table.item.detailColor};
                  font-family: ${FontFamily.NotoSans.Light};
                  font-size: 14px;
                  line-height: 16px;
                `}
              >
                {detail}
              </Text>
            ) : (
              detail
            )}
            {isSwitch ? (
              <SwitchButton
                on={switchOn}
                onChange={onItemSwitchChange}
                style={switchStyle}
                {...switchProps}
              />
            ) : null}
            {detailIcon === 'disclosure' ? (
              <Feather
                name="chevron-right"
                size={24}
                color={theme.components.table.item.detailDisclosureIconColor}
              />
            ) : detailIcon === 'info' ? (
              <MaterialIcons
                name="info"
                size={24}
                color={theme.components.table.item.detailInfoIconColor}
              />
            ) : detailIcon === 'info-outline' ? (
              <MaterialIcons
                name="info-outline"
                size={24}
                color={theme.components.table.item.detailInfoIconColor}
              />
            ) : (
              detailIcon
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  },
);

TableItem.displayName = 'TableItem';

const TableSection: FC<SectionProps> = memo(
  ({ title, style, index, ...properties }) => {
    const theme = useTheme();
    const children = React.Children.toArray(properties.children);
    const count = children.length;
    const childNodes = children.map((elem, idx) => {
      if (React.isValidElement(elem)) {
        const displayName = findDisplayName(elem);
        if (
          elem.type === TableItem ||
          displayName?.includes('TableItem') ||
          displayName?.includes('TableViewItem') ||
          (elem.type as any)?.type?.toString()?.includes('TableItem')
        ) {
          const props = elem.props as ItemProps;
          const overrides: ItemProps = {
            index: {
              section: index ?? 0,
              row: idx,
            },
          };
          if (!('first' in props) && idx === 0) {
            overrides.first = true;
          }
          if (!('last' in props) && idx === count - 1) {
            overrides.last = true;
          }
          return React.cloneElement(elem, overrides);
        } else {
          console.warn('TableView section can only contain item as child');
          return null;
        }
      }
    });

    return (
      <View style={style}>
        {title != null ? (
          <View>
            {typeof title === 'string' || typeof title === 'number' ? (
              <Text
                css={`
                  color: ${theme.components.table.section.titleColor};
                  font-family: ${FontFamily.NotoSans.Regular};
                  font-size: 14px;
                  line-height: 16px;
                `}
              ></Text>
            ) : (
              title
            )}
          </View>
        ) : null}
        <View>{childNodes}</View>
      </View>
    );
  },
);

TableSection.displayName = 'TableSection';

export type TableViewProps = {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

export const TableView: FC<TableViewProps> & {
  Section: FC<SectionProps>;
  Item: FC<ItemProps>;
} = memo(({ style, children }: TableViewProps) => {
  const count = React.Children.count(children);
  let lastSectionIndex = -1;
  let currentSectionIndex = -1;
  let rowIndexInNextSection = 0;
  const childNodes = React.Children.map(children, (elem, index) => {
    if (React.isValidElement(elem)) {
      const displayName = findDisplayName(elem);
      if (
        elem.type === TableSection ||
        displayName?.includes('TableSection') ||
        displayName?.includes('TableViewSection') ||
        (elem.type as any)?.type?.toString()?.includes('TableSection')
      ) {
        lastSectionIndex = index;
        currentSectionIndex = -1;
        rowIndexInNextSection = 0;
        const props = elem.props as SectionProps;
        const overrides: SectionProps = { index };
        if (!('first' in props) && index === 0) {
          overrides.first = true;
        }
        if (!('last' in props) && index === count - 1) {
          overrides.last = true;
        }
        if (Object.keys(overrides).length) {
          return React.cloneElement(elem, overrides);
        }
      } else if (
        elem.type === TableItem ||
        displayName?.includes('TableItem') ||
        displayName?.includes('TableViewItem') ||
        (elem.type as any)?.type?.toString()?.includes('TableItem')
      ) {
        if (currentSectionIndex === -1) {
          ++lastSectionIndex;
          currentSectionIndex = lastSectionIndex;
        }
        const props = elem.props as ItemProps;
        const overrides: ItemProps = {
          index: {
            section: currentSectionIndex,
            row: rowIndexInNextSection++,
          },
        };
        if (!('first' in props) && index === 0) {
          overrides.first = true;
        }
        if (!('last' in props) && index === count - 1) {
          overrides.last = true;
        }
        return React.cloneElement(elem, overrides);
      } else {
        console.warn('TableView can only contain section or item as child');
        return null;
      }
    }
  });
  return <View style={style}>{childNodes}</View>;
}) as any;

TableView.Section = TableSection;
TableView.Item = TableItem;

function findDisplayName(elem: any): string | undefined {
  // if elem.type contains property `styledComponentId` and `target`
  // then this element is a styled component element and try to find the
  // display name of the nested target.
  if (!elem.type) return '';
  if (elem.type.styledComponentId && elem.type.target) {
    return findDisplayName(elem.type.target);
  }
  return elem.type.displayName;
}
