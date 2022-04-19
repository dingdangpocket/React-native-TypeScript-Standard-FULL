import { FontFamily } from '@euler/components/typography/fonts';
import { config } from '@euler/config';
import * as version from '@euler/config/version.json';
import { useIsMobileLayout } from '@euler/utils';
import { memo, useReducer } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { css } from 'styled-components';

export function versionText(hashLength = 4) {
  const hash = version.current.slice(0, hashLength);
  return `${config.environment}-${version.code}-${hash}`;
}

const styles = {
  mobile: css`
    position: absolute;
    top: 3px;
    left: 0;
    right: 0;
    align-items: center;
  `,
  desktop: css`
    position: absolute;
    bottom: 0;
    right: 0;
  `,
};

const Content = () => {
  const isMobile = useIsMobileLayout();

  const [visible, toggle] = useReducer(s => !s, true);

  if (!visible) {
    return null;
  }

  return (
    <TouchableOpacity
      css={(isMobile ? styles.mobile : styles.desktop) as any}
      onPress={toggle}
    >
      <View
        css={`
          padding: 0 10px;
          height: 24px;
          border-radius: 12px;
          background-color: white;
          justify-content: center;
        `}
      >
        <Text
          maxFontSizeMultiplier={1}
          css={`
            font-family: ${FontFamily.NotoSans.Regular};
            font-size: 13px;
            color: black;
          `}
        >
          {versionText()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const VersionText = memo(() => {
  if (config.environment === 'production') {
    return null;
  }
  return <Content />;
});
