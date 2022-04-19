import { LinkButton } from '@euler/app/components/LinkButton';
import { Label } from '@euler/components/typography/Label';
import { memo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useTheme } from 'styled-components';

export const MaintenanceAdviceCell = memo(
  ({
    text,
    style,
    onEditPress,
  }: {
    text: string;
    style?: StyleProp<ViewStyle>;
    onEditPress?: () => void;
  }) => {
    const {
      inspection: {
        siteInspection: {
          itemCard: {
            maintenaceAdviceLabelColor: labelColor,
            maintenaceAdviceTextColor: textColor,
            maintenaceAdviceBorderColor: borderColor,
            maintenaceAdviceBgColor: bgColor,
          },
        },
      },
    } = useTheme();
    return (
      <View style={style}>
        <View
          css={`
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
          `}
        >
          <Label light size={14} color={labelColor}>
            推荐项目:{' '}
          </Label>
          <LinkButton text="+编辑" onPress={onEditPress} />
        </View>
        <View
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
        >
          <Label light size={15} color={textColor} numberOfLines={1}>
            {text}
          </Label>
        </View>
      </View>
    );
  },
);
