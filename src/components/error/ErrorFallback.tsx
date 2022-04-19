import { getGlobalNavigationRef } from '@euler/app/components/RoutesContainer';
import ErrorSvg from '@euler/app/flows/error/assets/error.svg';
import { getColorTheme } from '@euler/app/theming';
import { FontFamily } from '@euler/components/typography';
import {
  Appearance,
  Dimensions,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export const ErrorFallback = (props: {
  error: Error | null;
  componentStack: string | null;
  eventId: string | null;
  resetError: () => void;
}) => {
  const colorMode = Appearance.getColorScheme();
  const theme = getColorTheme(colorMode ?? 'light');
  const { width } = Dimensions.get('window');
  const size = width * 1.5;
  return (
    <SafeAreaView
      css={`
        flex: 1;
        background-color: white;
      `}
    >
      <View
        css={`
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          align-items: center;
          justify-content: center;
        `}
        pointerEvents="none"
      >
        <ErrorSvg
          width={size}
          height={size}
          css={`
            left: ${width / 4}px;
          `}
        />
      </View>
      <View
        css={`
          padding: 0 15px;
          margin-top: 40%;
        `}
      >
        <Text
          css={`
            font-family: ${FontFamily.NotoSans.Black};
            font-size: 60px;
            margin-bottom: 12px;
            font-weight: bold;
          `}
        >
          Oops!
        </Text>
        <Text
          css={`
            font-family: ${FontFamily.NotoSans.Medium};
            margin-bottom: 5px;
            font-size: 16px;
          `}
        >
          Something went wrong...
        </Text>
        {props.error?.message ? (
          <Text
            css={`
              margin-bottom: 10px;
            `}
          >
            {props.error?.message}
          </Text>
        ) : null}
        <View
          css={`
            flex-direction: row;
            margin-top: 15px;
          `}
        >
          <TouchableOpacity
            onPress={props.resetError}
            css={`
              margin: 0;
              background-color: ${theme.link};
              padding: 3px 16px;
              height: 26px;
              border-radius: 13px;
              justify-content: center;
              align-items: center;
            `}
          >
            <Text
              css={`
                font-family: ${FontFamily.NotoSans.Light};
                font-size: 14px;
                color: #fff;
              `}
            >
              Retry
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              const nav = getGlobalNavigationRef();
              if (nav.isReady() && nav.canGoBack()) {
                nav.goBack();
              }
            }}
            css={`
              margin: 0;
              padding: 3px 16px;
              height: 26px;
              border-radius: 13px;
              justify-content: center;
              align-items: center;
            `}
          >
            <Text
              css={`
                font-family: ${FontFamily.NotoSans.Light};
                font-size: 14px;
                color: ${theme.link};
              `}
            >
              Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
