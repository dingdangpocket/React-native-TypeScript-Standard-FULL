import { Label } from '@euler/components/typography/Label';
import { HeaderTitle } from '@react-navigation/elements';
import color from 'color';
import { View } from 'react-native';
import { useTheme } from 'styled-components';

export const NavHeaderTitle = (props: Parameters<typeof HeaderTitle>[0]) => {
  const theme = useTheme();
  if (typeof props.children !== 'string') {
    return <></>;
  }
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
        justify-content: center;
        flex: 1;
      `}
    >
      <Label
        regular
        size={18}
        lineHeight={20}
        css={`
          top: -2px;
          color: #000;
        `}
      >
        {title}
      </Label>
      {subTitle ? (
        <Label thin size={12} lineHeight={14} color={subTitleColor}>
          {subTitle}
        </Label>
      ) : null}
    </View>
  );
};
