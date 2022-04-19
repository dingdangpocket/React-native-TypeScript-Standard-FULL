import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AVPlaybackStatus, ResizeMode as AVResizeMode, Video } from 'expo-av';
import { memo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import FastImage, { ResizeMode } from 'react-native-fast-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// see https://github.com/ihmpavel/expo-video-player for more video controls customization
export const MediaPreview = memo(
  (
    props:
      | {
          type: 'photo';
          url: string;
          resizeMode?: ResizeMode | 'stretch' | 'cover' | 'contain';
        }
      | {
          type: 'video';
          url: string;
          loop?: boolean;
          resizeMode?: AVResizeMode | 'stretch' | 'cover' | 'contain';
          controls?: boolean;
          onPlaybackStatusUpdate?: (status: AVPlaybackStatus) => void;
          onClose?: () => void;
        },
  ) => {
    const { top } = useSafeAreaInsets();
    return (
      <View
        css={`
          flex: 1;
        `}
      >
        {props.type === 'photo' && (
          <FastImage
            resizeMode={props.resizeMode ?? 'cover'}
            css={`
              flex: 1;
            `}
            source={{ uri: props.url }}
          />
        )}
        {props.type === 'video' && (
          <>
            <Video
              css={`
                flex: 1;
              `}
              source={{ uri: props.url }}
              resizeMode={props.resizeMode ?? 'contain'}
              isLooping={props.loop}
              shouldPlay={true}
              useNativeControls={props.controls}
              onPlaybackStatusUpdate={props.onPlaybackStatusUpdate}
            />
            <TouchableOpacity
              onPress={props.onClose}
              css={`
                position: absolute;
                top: ${top + 15}px;
                right: 15px;
              `}
            >
              <MaterialCommunityIcons
                name="window-close"
                size={32}
                color="white"
              />
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  },
);
