import { usePickMediaAsset } from '@euler/functions/useImagePicker';
import { useLatestCameraRollImages } from '@euler/functions/useLatestCameraRollImages';
import { ImageInfo, MediaTypeOptions } from 'expo-image-picker';
import { memo, useCallback } from 'react';
import { Image, TouchableOpacity, ViewProps } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const Icon = memo(() => (
  <Svg width="30" height="26" viewBox="0 0 16 14">
    <Path
      d="M1.43164 9.97656C1.625 11.1133 2.31641 11.5938 3.47656 11.3887L3.57617 11.3711V11.6113C3.57617 12.7715 4.16797 13.3574 5.3457 13.3574H13.4434C14.6094 13.3574 15.207 12.7715 15.207 11.6113V5.99219C15.207 4.83203 14.6094 4.24023 13.4434 4.24023H12.2363L11.9082 2.41797C11.709 1.28125 11.0234 0.794922 9.86914 1L1.89453 2.40625C0.734375 2.61133 0.259766 3.29102 0.458984 4.43945L1.43164 9.97656ZM2.36914 9.74219L1.41406 4.32812C1.32031 3.77734 1.56641 3.44336 2.09375 3.34961L10.0039 1.95508C10.5254 1.86133 10.877 2.08984 10.9766 2.64648L11.2578 4.24023H5.3457C4.16797 4.24023 3.57617 4.83203 3.57617 5.99219V10.3926L3.3418 10.4336C2.81445 10.5273 2.46875 10.293 2.36914 9.74219ZM4.53711 6.05664C4.53711 5.49414 4.83594 5.20703 5.375 5.20703H13.4082C13.9414 5.20703 14.2461 5.49414 14.2461 6.05664V10.4512L12.248 8.56445C12.0137 8.34766 11.7266 8.23633 11.4336 8.23633C11.1348 8.23633 10.8652 8.3418 10.6191 8.55859L8.18164 10.7207L7.20313 9.8418C6.97461 9.64258 6.72852 9.53125 6.4707 9.53125C6.23047 9.53125 6.00195 9.63672 5.77344 9.83594L4.53711 10.9141V6.05664ZM7.32031 8.71094C8.02344 8.71094 8.60352 8.13086 8.60352 7.42188C8.60352 6.71875 8.02344 6.13281 7.32031 6.13281C6.61133 6.13281 6.03125 6.71875 6.03125 7.42188C6.03125 8.13086 6.61133 8.71094 7.32031 8.71094Z"
      fill="white"
    />
  </Svg>
));

export const LibraryButton = memo(
  ({
    mediaTypes,
    noLatestImage,
    style,
    onSelect,
    ...props
  }: ViewProps & {
    noLatestImage?: boolean;
    mediaTypes?: MediaTypeOptions;
    onSelect?: (result: ImageInfo) => void;
  }) => {
    const pickAsset = usePickMediaAsset({
      mediaTypes,
    });
    const lastestImage = useLatestCameraRollImages({
      count: noLatestImage ? 0 : 1,
      resize: { width: 100 },
    })[0];
    const onPress = useCallback(async () => {
      const result = await pickAsset();
      if (result.cancelled) return;
      onSelect?.(result as unknown as ImageInfo);
    }, [onSelect, pickAsset]);
    return (
      <TouchableOpacity
        css={`
          width: 50px;
          height: 50px;
          border-radius: ${lastestImage ? 8 : 25}px;
          overflow: hidden;
          justify-content: center;
          align-items: center;
          background-color: rgba(0, 0, 0, 0.3);
        `}
        style={style}
        onPress={onPress}
        {...props}
      >
        {lastestImage ? (
          <Image
            source={{ uri: lastestImage }}
            css={`
              flex: 1;
              align-self: stretch;
            `}
            resizeMode="cover"
          />
        ) : (
          <Icon />
        )}
      </TouchableOpacity>
    );
  },
);
