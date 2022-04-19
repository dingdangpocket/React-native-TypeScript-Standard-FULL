import { FC, memo } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
interface vehicleSitePosition {
  left: number;
  top: number;
}
export type FacadeInspectionItem = {
  siteId: number;
  siteName: string;
  hasIssue: boolean;
  itemId: number;
  styles: vehicleSitePosition | undefined;
};
interface Props {
  onPress?: (siteId: number) => void;
  item?: FacadeInspectionItem;
}
const pointStyleOption: StyleProp<ViewStyle> = {
  width: 22,
  height: 22,
  borderRadius: 22,
  justifyContent: 'center',
  alignItems: 'center',
};
const innerStyleOption: StyleProp<ViewStyle> = {
  width: 10,
  height: 10,
  borderRadius: 5,
};
const PreinspectionVehicleSitePoint: FC<Props> = memo(props => {
  if (props.item?.siteId == 206 || props.item?.siteId == 205) {
    return null;
  } else {
    return (
      <View
        style={
          props.item?.hasIssue == true
            ? {
                position: 'absolute',
                ...props.item?.styles,
              }
            : {
                position: 'absolute',
                ...props.item?.styles,
              }
        }
      >
        <TouchableOpacity
          onPress={() => props.onPress?.(props.item?.siteId ?? 0)}
          activeOpacity={0.6}
          css={`
            width: 35px;
            height: 35px;
          `}
        >
          <View
            style={
              props.item?.hasIssue == true
                ? {
                    ...pointStyleOption,
                    backgroundColor: 'rgba(237,14,14,0.3)',
                  }
                : {
                    ...pointStyleOption,
                    backgroundColor: 'rgba(0, 138, 255, 0.3)',
                  }
            }
          >
            <View
              style={
                props.item?.hasIssue == true
                  ? {
                      ...innerStyleOption,
                      backgroundColor: 'red',
                    }
                  : {
                      ...innerStyleOption,
                      backgroundColor: '#008AFF',
                    }
              }
            ></View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
});

export default PreinspectionVehicleSitePoint;
