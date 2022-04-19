import { FontFamily } from '@euler/components/typography/fonts';
import {
  NotoSansSC_100Thin,
  NotoSansSC_300Light,
  NotoSansSC_400Regular,
  NotoSansSC_500Medium,
  NotoSansSC_700Bold,
  NotoSansSC_900Black,
} from '@expo-google-fonts/noto-sans-sc';
import { isLoaded, loadAsync } from 'expo-font';
import { ReactNode, useEffect } from 'react';

const NotoSansFontMap = {
  [FontFamily.NotoSans.Thin]: NotoSansSC_100Thin,
  [FontFamily.NotoSans.Light]: NotoSansSC_300Light,
  [FontFamily.NotoSans.Regular]: NotoSansSC_400Regular,
  [FontFamily.NotoSans.Medium]: NotoSansSC_500Medium,
  [FontFamily.NotoSans.Bold]: NotoSansSC_700Bold,
  [FontFamily.NotoSans.Black]: NotoSansSC_900Black,
};

export const Fonts = (props: { children?: ReactNode }) => {
  useEffect(() => {
    if (!Object.keys(NotoSansFontMap).every(f => isLoaded(f))) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      loadAsync(NotoSansFontMap).catch(() => {});
    }
  }, []);

  return <>{props.children}</>;
};
