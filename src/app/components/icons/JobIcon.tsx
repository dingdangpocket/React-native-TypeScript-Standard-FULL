import { IconProps } from '@euler/app/components/icons/types';
import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export const JobIcon = memo(({ size, style }: IconProps) => (
  <Svg
    width={size}
    height={size}
    fill="none"
    viewBox="-4 -4 30 30"
    style={style}
  >
    <Path
      d="M12.973 10.0068C13.9181 9.32018 14.6215 8.35198 14.9825 7.24099C15.3435 6.12999 15.3434 4.93324 14.9825 3.82225C14.6215 2.71126 13.918 1.74307 12.973 1.05644C12.0279 0.369815 10.8897 0 9.72154 0C8.55338 0 7.4152 0.369815 6.47013 1.05644C5.52506 1.74307 4.82162 2.71126 4.46063 3.82225C4.09964 4.93324 4.09963 6.12999 4.4606 7.24099C4.82158 8.35198 5.525 9.32018 6.47006 10.0068C4.57667 10.6801 2.93819 11.923 1.77968 13.565C0.621174 15.2069 -0.000520784 17.1673 3.27333e-07 19.1768C3.30586e-07 19.3952 0.086726 19.6045 0.241099 19.7589C0.395472 19.9133 0.604846 20 0.823162 20C1.04148 20 1.25085 19.9133 1.40523 19.7589C1.5596 19.6045 1.64632 19.3952 1.64632 19.1768C1.74019 17.0982 2.63197 15.1359 4.13609 13.6981C5.64022 12.2604 7.64081 11.458 9.72155 11.458C11.8023 11.458 13.8029 12.2604 15.307 13.6981C16.8111 15.1359 17.7029 17.0982 17.7968 19.1768C17.7968 19.3952 17.8835 19.6045 18.0379 19.7589C18.1922 19.9133 18.4016 20 18.6199 20C18.8382 20 19.0476 19.9133 19.202 19.7589C19.3564 19.6045 19.4431 19.3952 19.4431 19.1768C19.4436 17.1673 18.8219 15.2069 17.6634 13.565C16.5049 11.923 14.8664 10.6801 12.973 10.0068ZM5.84445 5.56175C5.84445 4.7933 6.07232 4.04211 6.49925 3.40318C6.92617 2.76424 7.53298 2.26624 8.24293 1.97217C8.95288 1.6781 9.73409 1.60116 10.4878 1.75107C11.2415 1.90099 11.9338 2.27103 12.4771 2.81441C13.0205 3.35778 13.3905 4.05008 13.5405 4.80376C13.6904 5.55744 13.6134 6.33865 13.3194 7.0486C13.0253 7.75855 12.5273 8.36536 11.8884 8.79228C11.2494 9.21921 10.4982 9.44708 9.72978 9.44708C8.69933 9.44708 7.71108 9.03773 6.98244 8.30909C6.2538 7.58045 5.84445 6.5922 5.84445 5.56175Z"
      fill="#333333"
    />
    <Path
      d="M18.6198 3.14166H25.4026C25.621 3.14166 25.8303 3.22839 25.9847 3.38276C26.1391 3.53713 26.2258 3.74651 26.2258 3.96482C26.2258 4.18314 26.1391 4.39251 25.9847 4.54689C25.8303 4.70126 25.621 4.78799 25.4026 4.78799H18.6198C18.4015 4.78799 18.1921 4.70126 18.0377 4.54689C17.8834 4.39251 17.7966 4.18314 17.7966 3.96482C17.7966 3.74651 17.8834 3.53713 18.0377 3.38276C18.1921 3.22839 18.4015 3.14166 18.6198 3.14166Z"
      fill="#0077FF"
    />
    <Path
      d="M18.6199 6.43428H23.0485C23.2668 6.43428 23.4762 6.52101 23.6305 6.67538C23.7849 6.82975 23.8716 7.03913 23.8716 7.25745C23.8716 7.47576 23.7849 7.68514 23.6305 7.83951C23.4762 7.99388 23.2668 8.08061 23.0485 8.08061H18.6199C18.4016 8.08061 18.1922 7.99388 18.0378 7.83951C17.8834 7.68514 17.7967 7.47576 17.7967 7.25745C17.7967 7.03913 17.8834 6.82975 18.0378 6.67538C18.1922 6.52101 18.4016 6.43428 18.6199 6.43428Z"
      fill="#0077FF"
    />
    <Path
      d="M18.6199 9.7928H20.8424C21.0607 9.7928 21.2701 9.87953 21.4245 10.0339C21.5789 10.1883 21.6656 10.3976 21.6656 10.616C21.6656 10.8343 21.5789 11.0437 21.4245 11.198C21.2701 11.3524 21.0607 11.4391 20.8424 11.4391H18.6199C18.4016 11.4391 18.1922 11.3524 18.0378 11.198C17.8835 11.0437 17.7967 10.8343 17.7967 10.616C17.7967 10.3976 17.8835 10.1883 18.0378 10.0339C18.1922 9.87953 18.4016 9.7928 18.6199 9.7928Z"
      fill="#0077FF"
    />
  </Svg>
));