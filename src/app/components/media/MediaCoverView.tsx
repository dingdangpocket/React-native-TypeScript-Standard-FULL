import { Center } from '@euler/components';
import { AdvancedImage } from '@euler/components/adv-image/AdvancedImage';
import { MediaObject } from '@euler/model/MediaObject';
import { Ionicons } from '@expo/vector-icons';
import { ComponentType, memo, useCallback, useState } from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from 'styled-components/native';

export const MediaCoverView = memo(
  ({
    media,
    style,
    noPlaceholder,
    playIconSize,
    playIconStyle,
    onPress,
    TouchableComponent,
  }: {
    media: MediaObject;
    noPlaceholder?: boolean;
    style?: StyleProp<ViewStyle>;
    playIconSize?: number;
    playIconStyle?: StyleProp<ViewStyle>;
    TouchableComponent?: ComponentType;
    onPress?: (media: MediaObject) => void;
  }) => {
    const Component = TouchableComponent ?? TouchableWithoutFeedback;
    const theme = useTheme();
    const [loaded, setLoaded] = useState(false);
    const onLoad = useCallback(() => {
      setLoaded(true);
    }, []);
    return (
      <Component onPress={() => onPress?.(media)} style={{ flex: 1 }}>
        {/* We need wrap it with a View otherwise the touch will not
           register unless image loaded  */}
        <View
          css={`
            flex: 1;
            width: 100%;
          `}
          style={style}
        >
          <AdvancedImage
            resizeMode={'cover'}
            uri={media.coverUrl ?? media.url}
            onLoad={onLoad}
            css={`
              flex: 1;
              width: 100%;
            `}
          />
          {media.type === 'video' && (
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              onPress={() => onPress?.(media)}
              css={`
                background-color: rgba(255, 255, 255, 0.1);
                align-items: center;
                justify-content: center;
              `}
            >
              <Ionicons
                name="ios-play"
                size={playIconSize ?? 56}
                color="white"
                style={playIconStyle}
              />
            </TouchableOpacity>
          )}
          {!loaded && !noPlaceholder && (
            <Center
              style={StyleSheet.absoluteFill}
              css={`
                background-color: ${theme.components.placeholder.background};
              `}
            >
              <ActivityIndicator size="small" />
            </Center>
          )}
        </View>
      </Component>
    );
  },
);
