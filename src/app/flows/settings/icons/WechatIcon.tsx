import { IconProps } from '@euler/app/components/icons/types';
import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export const WechatIcon = memo(({ size, style }: IconProps) => (
  <Svg
    width={size}
    height={size}
    fill="none"
    viewBox="-6 -2 55 55"
    style={style}
  >
    <Path
      d="M14.8694 14.9348C14.0868 14.9348 13.3042 15.4566 13.3042 16.2392C13.3042 17.0218 14.0868 17.5435 14.8694 17.5435C15.652 17.5435 16.1738 17.0218 16.1738 16.2392C16.1738 15.4239 15.652 14.9348 14.8694 14.9348ZM25.4672 22.5C24.9455 22.5 24.4564 23.0544 24.4564 23.5435C24.4564 24.0979 24.9781 24.587 25.4672 24.587C26.2498 24.587 26.7716 24.0653 26.7716 23.5435C26.7716 23.0218 26.2498 22.5 25.4672 22.5ZM22.1085 17.5435C22.8912 17.5435 23.4129 16.9892 23.4129 16.2392C23.4129 15.4566 22.8912 14.9348 22.1085 14.9348C21.3259 14.9348 20.5433 15.4566 20.5433 16.2392C20.5433 17.0218 21.3259 17.5435 22.1085 17.5435ZM31.1411 22.5C30.6194 22.5 30.1303 23.0544 30.1303 23.5435C30.1303 24.0979 30.652 24.587 31.1411 24.587C31.9238 24.587 32.4455 24.0653 32.4455 23.5435C32.4455 23.0218 31.9238 22.5 31.1411 22.5Z"
      fill="#28C445"
    />
    <Path
      d="M22.5 0C10.0761 0 0 10.0761 0 22.5C0 34.9239 10.0761 45 22.5 45C34.9239 45 45 34.9239 45 22.5C45 10.0761 34.9239 0 22.5 0V0ZM18.2283 28.2717C16.9239 28.2717 15.8804 28.0109 14.6413 27.7174L11.0543 29.5435L12.0652 26.3804C9.48913 24.5543 7.92391 22.1739 7.92391 19.337C7.92391 14.3478 12.587 10.4348 18.2283 10.4348C23.2826 10.4348 27.75 13.5652 28.6304 17.7717C28.3043 17.7391 27.9783 17.7065 27.6522 17.7065C22.7609 17.7717 18.913 21.4565 18.913 26.0217C18.913 26.7717 19.0435 27.4891 19.2391 28.2065C18.913 28.2391 18.5543 28.2717 18.2283 28.2717V28.2717ZM33.4891 31.9239L34.2717 34.5326L31.4674 32.9674C30.4565 33.2283 29.413 33.4891 28.3696 33.4891C23.4456 33.4891 19.5652 30.0978 19.5652 25.8913C19.5326 21.7174 23.413 18.3261 28.3043 18.3261C32.9674 18.3261 37.0761 21.75 37.0761 25.9239C37.0761 28.2717 35.5435 30.3587 33.4891 31.9239V31.9239Z"
      fill="#28C445"
    />
  </Svg>
));