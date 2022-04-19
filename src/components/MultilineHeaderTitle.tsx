import { FontFamily } from '@euler/components/typography';
import { HeaderTitle } from '@react-navigation/elements';
import color from 'color';
import { Text, View } from 'react-native';
import { useTheme } from 'styled-components';

export const MultilineHeaderTitle = (
  props: Parameters<typeof HeaderTitle>[0],
) => {
  const theme = useTheme();
  if (typeof props.children !== 'string') {
    return <></>;
  }
  if (props.children.includes('\n')) {
    const [title, subtitle] = props.children!.split('\n');
    // $hack(eric): allow use directive/modifier in form of
    // `!color[#aabbcc] text` to set the sub title color.
    const m = subtitle ? /^!color\[(.+?)\]\s(.+?)$/.exec(subtitle) : null;
    const subTitleColor =
      m?.[1] ??
      (props.tintColor
        ? color(props.tintColor).fade(0.6).string()
        : theme.page.header.subTitleColor);
    const subTitle = m?.[2] ?? subtitle;
    return (
      <View
        css={`
          align-items: center;
        `}
      >
        <HeaderTitle {...props}>{title}</HeaderTitle>
        <Text
          css={`
            font-family: ${FontFamily.NotoSans.Thin};
            font-size: 12px;
            line-height: 14px;
            color: ${subTitleColor};
          `}
        >
          {subTitle}
        </Text>
      </View>
    );
  }
  return <HeaderTitle {...props} />;
};
