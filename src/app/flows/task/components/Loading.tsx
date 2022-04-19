import { useIsMobileLayout } from '@euler/utils';
import React, { memo } from 'react';
import ContentLoader, {
  Circle,
  IContentLoaderProps,
  Rect,
} from 'react-content-loader/native';
import { useWindowDimensions } from 'react-native';

export const TaskDetailLoader = memo((props: IContentLoaderProps) => {
  const isMobileLayout = useIsMobileLayout();
  const { width } = useWindowDimensions();
  const loaderWidth = isMobileLayout ? width - 30 : width * 0.75;
  const loaderHeight = loaderWidth * (400 / 375);
  return (
    <ContentLoader
      speed={1.2}
      width={loaderWidth}
      height={loaderHeight}
      viewBox="0 0 375 400"
      backgroundColor="#d7d7d7"
      foregroundColor="#ecebeb"
      {...props}
    >
      <Rect x="94" y="15" rx="3" ry="3" width="257" height="10" />
      <Rect x="94" y="35" rx="3" ry="3" width="193" height="5" />
      <Rect x="94" y="46" rx="3" ry="3" width="193" height="5" />
      <Rect x="94" y="63" rx="3" ry="3" width="170" height="5" />
      <Rect x="20" y="100" rx="3" ry="3" width="94" height="20" />
      <Rect x="137" y="100" rx="3" ry="3" width="97" height="20" />
      <Rect x="258" y="100" rx="3" ry="3" width="94" height="20" />
      <Rect x="20" y="146" rx="3" ry="3" width="333" height="105" />
      <Rect x="21" y="317" rx="3" ry="3" width="333" height="15" />
      <Rect x="20" y="349" rx="3" ry="3" width="333" height="15" />
      <Rect x="20" y="381" rx="3" ry="3" width="333" height="15" />
      <Rect x="20" y="285" rx="3" ry="3" width="333" height="15" />
      <Circle cx="50" cy="44" r="34" />
    </ContentLoader>
  );
});
