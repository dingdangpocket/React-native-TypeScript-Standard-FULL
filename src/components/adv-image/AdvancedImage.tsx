import { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Blurhash } from 'react-native-blurhash';
import FastImage from 'react-native-fast-image';
import { AdvancedImageProps, useImage } from './AdvancedImage.shared';

export const AdvancedImage = memo(
  ({
    uri,
    source,
    resize,
    blurhash,
    onLoad,
    placeholder,
    ...props
  }: AdvancedImageProps) => {
    const { hash, showBlur, imageUrl, onLoaded } = useImage({
      uri,
      resize,
      blurhash,
      onLoad,
    });

    const blurhashOptions: Exclude<AdvancedImageProps['blurhash'], 'string'> =
      typeof hash === 'string'
        ? {
            blurhash: hash,
          }
        : hash;

    if (!imageUrl && placeholder) {
      return <>{placeholder}</>;
    }

    return (
      <FastImage
        source={
          source ?? {
            uri: imageUrl ?? undefined,
          }
        }
        onLoad={onLoaded}
        {...props}
      >
        {showBlur && (
          <Blurhash {...blurhashOptions} style={StyleSheet.absoluteFill} />
        )}
      </FastImage>
    );
  },
);

export const Img = AdvancedImage;
