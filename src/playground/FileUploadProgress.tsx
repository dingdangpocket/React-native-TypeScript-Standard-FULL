import { LibraryButton } from '@euler/app/components/media/LibraryButton';
import { wrapNavigatorScreen } from '@euler/functions';
import { useServiceFactory } from '@euler/services/factory';
import { ImageInfo, MediaTypeOptions } from 'expo-image-picker';
import { useCallback } from 'react';
import { TextInput, View } from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export const FileUploadProgressDemo = wrapNavigatorScreen(
  () => {
    const progress = useSharedValue(0);
    const { mediaFileService } = useServiceFactory();

    const scoreProps = useAnimatedProps(() => {
      return { text: (progress.value * 100).toFixed(1) + '%' } as any;
    });

    const upload = useCallback(
      async (media: ImageInfo) => {
        try {
          console.log('uploading', media.uri, '...');
          const result = await mediaFileService.upload(media.uri, {
            realm: 'test',
            cover: true,
            onProgress: e => {
              progress.value = e.total > 0 ? e.loaded / e.total : -1;
            },
          });
          console.log(result);
        } catch (e) {
          console.error(e);
        }
      },
      [mediaFileService, progress],
    );

    return (
      <View
        css={`
          flex: 1;
          align-items: center;
          padding: 32px;
        `}
      >
        <LibraryButton
          css={`
            width: 100px;
            height: 100px;
            margin-bottom: 44px;
          `}
          mediaTypes={MediaTypeOptions.All}
          onSelect={upload}
        />
        <AnimatedTextInput
          editable={false}
          textAlign="center"
          css={`
            text-align: center;
            padding: 0;
            font-size: 32px;
          `}
          animatedProps={scoreProps}
        />
      </View>
    );
  },
  {
    title: 'File Upload Progress',
  },
);
