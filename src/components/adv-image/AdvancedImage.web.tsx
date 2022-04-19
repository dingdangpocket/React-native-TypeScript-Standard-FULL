import { isBlurhashValid } from 'blurhash';
import { memo, useMemo } from 'react';
import { BlurhashCanvas } from 'react-blurhash';
import { ImageBackground, StyleSheet } from 'react-native';
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

    const hashData = typeof hash === 'string' ? hash : hash.blurhash;
    const hashOptions =
      typeof hash === 'string'
        ? {}
        : { width: hash.decodeWidth, height: hash.decodeHeight };

    const isValid = useMemo(
      () => showBlur && isBlurhashValid(hashData) && hashData.length === 36,
      [showBlur, hashData],
    );

    if (!imageUrl && placeholder) {
      return <>{placeholder}</>;
    }

    return (
      <ImageBackground
        {...props}
        source={
          source
            ? (source as any)
            : {
                uri: imageUrl ?? undefined,
              }
        }
        css={`
          position: relative;
          overflow: hidden;
        `}
        onLoad={onLoaded as any}
      >
        {showBlur && isValid && (
          <BlurhashCanvas
            hash={hashData}
            {...hashOptions}
            style={StyleSheet.absoluteFillObject}
          />
        )}
      </ImageBackground>
    );
  },
);

export const Img = AdvancedImage;
