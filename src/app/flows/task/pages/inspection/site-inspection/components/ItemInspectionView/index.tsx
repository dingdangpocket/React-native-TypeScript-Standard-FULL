/* eslint-disable @typescript-eslint/no-use-before-define */
import { isSimpleNumericInspectionResultDataType } from '@euler/functions/inspectionResultDataTypeHelpers';
import { DefectiveLevel } from '@euler/model';
import { memo, useCallback, useMemo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useTheme } from 'styled-components';
import * as SiteInspection from '../../functions/SiteInspection';
import { ItemHeaderCell } from './ItemHeaderCell';
import { ItemMediaList } from './ItemMediaList';
import { ItemOptionCell } from './ItemOptionCell';
import { MaintenanceAdviceCell } from './MaintenanceAdviceCell';
import { ValueInputCell } from './ValueInputCell';

type CheckItem = SiteInspection.CheckItemInfo;
type Media = SiteInspection.MediaInfo;

export type ItemInspectionCallbackProps = {
  onValueChange?: (item: CheckItem, value: number | undefined) => void;
  onSelectedOptionChange?: (item: CheckItem, index: number) => void;
  onDelete?: (item: CheckItem) => void;
  onTakeMedia?: (item: CheckItem) => void;
  onDeleteMedia?: (item: CheckItem, image: Media) => void;
  onRetryMediaUpload?: (item: CheckItem, image: Media) => void;
  onEditMaintenanceAdvice?: (item: CheckItem) => void;
  onPreviewVideo?: (item: CheckItem, image: Media) => void;
};

type Props = {
  // input props
  itemNo: number;
  item: CheckItem;
  style?: StyleProp<ViewStyle>;
} & ItemInspectionCallbackProps;

export const ItemInspectionView = memo(
  ({
    itemNo,
    item,
    style,
    onValueChange,
    onDelete,
    onSelectedOptionChange,
    onEditMaintenanceAdvice,
    onTakeMedia,
    onDeleteMedia,
    onPreviewVideo,
    onRetryMediaUpload,
  }: Props) => {
    const {
      inspection: {
        siteInspection: {
          itemCard: { bgColor, shadowColor },
        },
      },
    } = useTheme();
    const selectedOption = useMemo(
      () => item.options[item.selectedOptionIndex],
      [item.options, item.selectedOptionIndex],
    );

    const isNumericType = isSimpleNumericInspectionResultDataType(
      item.valueType,
    );

    const onOptionSelected = useCallback(
      (index: number) => {
        onSelectedOptionChange?.(item, index);
      },
      [item, onSelectedOptionChange],
    );

    const onDeletePress = useCallback(() => {
      onDelete?.(item);
    }, [item, onDelete]);

    const onEditPress = useCallback(() => {
      onEditMaintenanceAdvice?.(item);
    }, [item, onEditMaintenanceAdvice]);

    const onValueInputChange = useCallback(
      (newValue: number | undefined) => {
        onValueChange?.(item, newValue);
      },
      [item, onValueChange],
    );

    return (
      <View
        css={`
          background-color: ${bgColor};
          //box-shadow: 2px 2px 10px ${shadowColor};
          elevation: 2;
          padding: 15px;
        `}
        style={style}
      >
        {/** header */}
        <ItemHeaderCell
          title={item.name}
          itemNo={itemNo}
          canDelete={item.isCustom}
          onDeletePress={onDeletePress}
          css={`
            margin-bottom: 10px;
          `}
        />

        {/** value input */}
        {isNumericType && (
          <ValueInputCell
            value={item.value}
            onChange={onValueInputChange}
            valueUnit={item.valueUnit}
            css={`
              margin-bottom: 10px;
            `}
          />
        )}

        {/** options */}
        {item.options.map((option, i) => (
          <ItemOptionCell
            key={i}
            title={option.title}
            index={i}
            defectiveLevel={option.defectiveLevel}
            selected={item.selectedOptionIndex === i}
            onSelected={onOptionSelected}
            css={`
              margin-bottom: 10px;
            `}
          />
        ))}

        {/** maintenance advice */}
        {selectedOption &&
        selectedOption.defectiveLevel !== DefectiveLevel.Fine ? (
          <MaintenanceAdviceCell
            text={selectedOption.maintenceAdvice ?? '暂无'}
            onEditPress={onEditPress}
            css={`
              margin-top: 10px;
              margin-bottom: 20px;
            `}
          />
        ) : null}

        {/** medias */}
        <ItemMediaList
          item={item}
          editable
          onTakeMedia={onTakeMedia}
          onDeleteMedia={onDeleteMedia}
          onPreviewVideo={onPreviewVideo}
          onRetryMediaUpload={onRetryMediaUpload}
        />
      </View>
    );
  },
);
