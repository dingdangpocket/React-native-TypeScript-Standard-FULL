import { FontFamily, Heading } from '@euler/components/typography';
import { useIsMobileLayout } from '@euler/utils/responsiveness';
import { FC, memo } from 'react';
import { Text, View } from 'react-native';
import styled from 'styled-components/native';

const Welcome = styled(Heading)`
  color: ${props => props.theme.colors.primary};
`;

export const LoginHeader: FC<{
  title?: string;
  subTitle?: string;
  avatar?: string;
}> = memo(props => {
  const isMobile = useIsMobileLayout();
  return (
    <View
      css={`
        align-items: ${isMobile ? 'flex-start' : 'center'};
      `}
    >
      <Welcome
        text={props.title ?? '欢迎您'}
        css={`
          font-family: ${FontFamily.NotoSans.Light};
          font-size: 32px;
          margin-bottom: 8px;
        `}
      />
      {props.subTitle ? (
        <Text
          css={`
            font-family: ${FontFamily.NotoSans.Light};
            font-size: 16px;
            color: rgba(0, 0, 0, 0.5);
            margin-bottom: 32px;
          `}
        >
          {props.subTitle}
        </Text>
      ) : null}
    </View>
  );
});
