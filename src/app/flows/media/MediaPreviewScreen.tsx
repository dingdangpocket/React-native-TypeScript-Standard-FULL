import { MediaPreview } from '@euler/app/components/media/MediaPreview';
import { AppNavParams } from '@euler/app/Routes';
import { wrapNavigatorScreen } from '@euler/functions';
import { useNavigation } from '@react-navigation/native';
import {
  CardStyleInterpolators,
  StackNavigationProp,
} from '@react-navigation/stack';
import { ResizeMode } from 'react-native-fast-image';
import { SafeAreaView } from 'react-native-safe-area-context';

export const MediaPreviewScreen = wrapNavigatorScreen(
  (props: {
    type: 'video' | 'photo';
    url: string;
    resizeMode?: ResizeMode | 'stretch' | 'cover' | 'contain';
    onConfirm?: (url: string) => void;
  }) => {
    const navigation = useNavigation<StackNavigationProp<AppNavParams>>();
    return (
      <SafeAreaView
        css={`
          flex: 1;
          background-color: black;
        `}
      >
        {props.type === 'photo' && (
          <MediaPreview
            type={props.type}
            url={props.url}
            resizeMode={props.resizeMode}
          />
        )}
        {props.type === 'video' && (
          <MediaPreview
            type={props.type}
            url={props.url}
            controls={true}
            onClose={() => navigation.goBack()}
            onPlaybackStatusUpdate={status => {
              if (!status.isLoaded) return;
              if (status.didJustFinish) {
                navigation.goBack();
              }
            }}
          />
        )}
      </SafeAreaView>
    );
  },
  {
    headerTransparent: true,
    headerShown: false,
    title: 'Preview',
    cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
  },
);
