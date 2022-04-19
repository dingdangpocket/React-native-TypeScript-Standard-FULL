import { IconProps } from '@euler/app/components/icons/types';
import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export const MileageIcon = memo(
  ({ size, color, style, ...props }: IconProps) => (
    <Svg
      width={size ?? 20}
      height={size ?? 20}
      viewBox="0 0 20 20"
      fill="none"
      style={style}
      {...props}
    >
      <Path
        d="M11 2.062V4a1 1 0 1 1-2 0V1a1 1 0 0 1 1-1c5.523 0 10 4.477 10 10s-4.477 10-10 10S0 15.523 0 10a9.968 9.968 0 0 1 2.929-7.071 1 1 0 1 1 1.402 1.427A7.975 7.975 0 0 0 2 10a8 8 0 0 0 8 8 8 8 0 0 0 1-15.938Zm-1.723 8.63-2.07-2.07a1 1 0 1 1 1.415-1.415l2.07 2.07a1.75 1.75 0 1 1-1.414 1.414h-.001Z"
        fill={color ?? '#07F'}
      />
    </Svg>
  ),
);
