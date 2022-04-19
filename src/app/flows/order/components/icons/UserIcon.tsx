import { IconProps } from '@euler/app/components/icons/types';
import * as React from 'react';
import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export const UserIcon = memo(({ size, color, style, ...props }: IconProps) => (
  <Svg
    width={size ?? 18}
    height={size ?? 21}
    fill="none"
    viewBox="0 0 18 21"
    style={style}
    {...props}
  >
    <Path
      d="M8.94 10.548a8.847 8.847 0 0 1 8.838 8.838.825.825 0 0 1-1.406.582.825.825 0 0 1-.241-.582 7.2 7.2 0 0 0-7.191-7.19 7.2 7.2 0 0 0-7.19 7.191.825.825 0 0 1-1.65 0 8.847 8.847 0 0 1 8.84-8.838v-.001ZM8.94 0a5.274 5.274 0 0 1 5.268 5.27 5.274 5.274 0 0 1-5.268 5.268 5.274 5.274 0 0 1-5.268-5.269A5.274 5.274 0 0 1 8.94 0Zm0 1.649a3.625 3.625 0 0 0-3.621 3.62 3.624 3.624 0 0 0 3.62 3.62 3.624 3.624 0 0 0 3.622-3.62A3.626 3.626 0 0 0 8.94 1.65Z"
      fill={color ?? '#207FE7'}
    />
  </Svg>
));
