/**
 * @file: cameraPhotoOutputMetricsComputed.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { LayoutRectangle } from 'react-native';
import { PhotoFile } from 'react-native-vision-camera';

export const cameraPhotoOutputMetricsComputed = ({
  file,
  previewRect,
  maskRect = previewRect,
}: {
  file: PhotoFile;
  previewRect: LayoutRectangle;
  maskRect?: LayoutRectangle;
}) => {
  // See more information about image orientation:
  // https://developer.apple.com/documentation/uikit/uiimageorientation?language=objc
  // https://developer.apple.com/documentation/imageio/cgimagepropertyorientation?language=objc
  // https://sirv.com/help/articles/rotate-photos-to-be-upright/
  // https://www.impulseadventure.com/photo/exif-orientation.html
  let [originalWidth, originalHeight] = [file.width, file.height];

  // swap the original width and height of the image is rotated by 90 deg
  if (
    file.metadata?.Orientation === 5 ||
    file.metadata?.Orientation === 6 ||
    file.metadata?.Orientation === 7 ||
    file.metadata?.Orientation === 8
  ) {
    [originalWidth, originalHeight] = [originalHeight, originalWidth];
  }

  // compute the crop region of the original
  const [previewWidth, previewHeight] = [previewRect.width, previewRect.height];

  let [cropWidth, cropHeight] = [originalWidth, originalHeight];
  if (originalWidth / originalHeight > previewWidth / previewHeight) {
    // crop based on original image height
    cropWidth = originalHeight * (previewWidth / previewHeight);
  } else {
    // crop based on original image width
    cropHeight = originalWidth * (previewHeight / previewWidth);
  }

  const cropRect: LayoutRectangle = { x: 0, y: 0, width: 0, height: 0 };

  // scale of from preview image to the cropped original image
  const scale = cropWidth / previewWidth;

  const [cx, cy] = [
    (maskRect.x + maskRect.width / 2) * scale,
    (maskRect.y + maskRect.height / 2) * scale,
  ];

  const [dx, dy] = [
    (originalWidth - cropWidth) / 2,
    (originalHeight - cropHeight) / 2,
  ];

  cropRect.width = maskRect.width * scale;
  cropRect.height = maskRect.height * scale;
  cropRect.x = cx - cropRect.width / 2 + dx;
  cropRect.y = cy - cropRect.height / 2 + dy;

  return {
    cropRect,
    scale,
    previewWidth,
    previewHeight,
    maskWidth: maskRect.width,
    maskHeight: maskRect.height,
  };
};
