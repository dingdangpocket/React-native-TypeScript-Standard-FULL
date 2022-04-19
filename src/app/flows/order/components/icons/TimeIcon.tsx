import { IconProps } from '@euler/app/components/icons/types';
import * as React from 'react';
import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export const TimeIcon = memo(
  ({ size, color = '#07F', style, ...props }: IconProps) => (
    <Svg
      width={size ?? 22}
      height={size ?? 21}
      fill="none"
      viewBox="0 0 22 21"
      style={style}
      {...props}
    >
      <Path
        d="M5.57 18.094H2.784c-.975 0-1.393-.629-1.393-1.392V2.785c0-1.236.24-1.393 1.393-1.393h11.138c1.077 0 1.412.361 1.412 1.393v1.863c0 .972 1.393 1.098 1.393 0V2.785C16.728.73 16.064 0 13.92 0H2.785C1.419 0 0 .167 0 2.723v14.431c-.003.275.036.55.116.813a2.192 2.192 0 0 0 2.143 1.525c1.703.007 2.395 0 3.308 0 .913 0 .852-1.398.002-1.398Z"
        fill={color}
      />
      <Path
        d="M4.183 4.167c-1 0-1.044 1.41 0 1.41h8.354c.957 0 1.109-1.41 0-1.41H4.183ZM6.426 8.34H4.183c-1 0-1.044 1.411 0 1.411h2.243c.957 0 1.109-1.41 0-1.41ZM15.34 7.6l.016 5.713h5.645A5.617 5.617 0 0 0 15.48 7.6h-.141Z"
        fill={color}
      />
      <Path
        d="M14.297 8.73a6.046 6.046 0 0 0-5.994 5.864 5.77 5.77 0 0 0 5.77 5.77 6.044 6.044 0 0 0 5.864-5.993h-5.64V8.73Z"
        fill={color}
      />
    </Svg>
  ),
);
