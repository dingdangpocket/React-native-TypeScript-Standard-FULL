import { IconProps } from '@euler/app/components/icons/types';
import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export const Pencil = memo(({ size = 20, color }: IconProps) => {
  return (
    <Svg width={size} height={size} fill="none">
      <Path
        d="M19.7953 2.50344C19.8567 2.64059 19.9059 2.80051 19.9432 2.98338C19.9811 3.16618 20 3.35664 20 3.5547C20 3.75276 19.9621 3.95068 19.8862 4.14873C19.8102 4.34684 19.6888 4.5373 19.5224 4.72005C19.3404 4.90295 19.1774 5.06284 19.0333 5.19994C18.8892 5.33706 18.7641 5.45895 18.6579 5.56561C18.5367 5.68747 18.4229 5.79416 18.3167 5.8855L14.063 1.61226C14.245 1.44467 14.4611 1.24282 14.7113 1.0066C14.9615 0.770465 15.17 0.583925 15.3368 0.446751C15.5492 0.279187 15.7691 0.16112 15.9966 0.0924935C16.224 0.0239982 16.4477 -0.00649374 16.6676 0.00114889C16.8875 0.00881768 17.0997 0.0430787 17.3045 0.103984C17.5092 0.164915 17.6873 0.233437 17.839 0.309682C18.1576 0.477403 18.5101 0.770572 18.8968 1.18948C19.2834 1.60836 19.583 2.04645 19.7953 2.50344ZM2.07525 13.6553C2.1662 13.5639 2.37856 13.3468 2.71212 13.004C3.04578 12.6612 3.46285 12.2385 3.9632 11.7357L5.62384 10.0676L7.46638 8.21654L12.357 3.30328L16.6107 7.59945L11.7201 12.5127L9.90032 14.3637C9.29372 14.9578 8.74777 15.5026 8.2625 15.9977C7.77726 16.4928 7.3753 16.9003 7.05688 17.2202C6.73838 17.5401 6.54881 17.723 6.48819 17.7687C6.33664 17.9058 6.16211 18.0505 5.96506 18.2028C5.76794 18.3553 5.56324 18.4771 5.35086 18.5685C5.13863 18.6752 4.82768 18.8046 4.41817 18.957C4.00877 19.1093 3.58038 19.2578 3.13299 19.4026C2.6857 19.5474 2.26109 19.6731 1.85911 19.7797C1.45726 19.8862 1.15783 19.9549 0.960659 19.9853C0.551127 20.031 0.278245 19.9701 0.141724 19.8025C0.00525607 19.635 -0.0326497 19.3532 0.027976 18.957C0.0583292 18.7437 0.130418 18.4353 0.24414 18.0315C0.357888 17.6277 0.479168 17.2088 0.608001 16.7746C0.736964 16.3405 0.862021 15.9405 0.983403 15.5749C1.10471 15.2093 1.20321 14.9579 1.27908 14.8208C1.37009 14.6076 1.47248 14.4133 1.58617 14.2381C1.69995 14.0628 1.86302 13.8686 2.07525 13.6553ZM9.66008 17.9653H11.6943V20H9.66008V17.9653ZM13.7931 17.9653H15.8273V20H13.7931V17.9653ZM17.9425 17.9653H19.9768V20H17.9425V17.9653Z"
        fill={color}
      />
    </Svg>
  );
});