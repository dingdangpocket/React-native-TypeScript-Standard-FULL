import { StatusColors } from '@euler/components';
import { MaybeText } from '@euler/components/MaybeText';
import { FontFamily } from '@euler/components/typography';
import { memo, ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

type ErrorContentType = Error | ReactNode;

const ErrorLabel = memo(({ error }: { error?: ErrorContentType }) => {
  if (!error) return null;
  return (
    <View
      css={`
        margin-top: 8px;
      `}
    >
      <MaybeText
        text={error instanceof Error ? error.message : error}
        css={`
          color: ${StatusColors.Danger};
          margin-left: 10px;
          font-family: ${FontFamily.NotoSans.Thin};
          font-size: 12px;
        `}
      />
    </View>
  );
});

export const FormGroup = memo(
  ({
    label,
    helpText,
    error,
    style,
    children,
  }: {
    label?: ReactNode;
    helpText?: ReactNode;
    error?: ErrorContentType;
    children?: ReactNode;
    style?: StyleProp<ViewStyle>;
  }) => {
    return (
      <View
        css={`
          margin-bottom: 10px;
          padding: 10px 0;
        `}
        style={style}
      >
        <MaybeText
          text={label}
          css={`
            margin-bottom: 4px;
          `}
        />
        {children}
        <MaybeText text={helpText} />
        <ErrorLabel error={error} />
      </View>
    );
  },
);
