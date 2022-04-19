/**
 * @file: AdvancedImage.shared.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FastImageProps, Source } from 'react-native-fast-image';
import { imageResizing } from './image-resizing';

const loadedImageUrls: { [url: string]: boolean } = {};

export type AdvancedImageProps = Omit<FastImageProps, 'source'> & {
  uri?: string | null;
  source?: Source;
  resize?: imageResizing.Options;
  placeholder?: ReactNode;
  blurhash?:
    | string
    | {
        blurhash: string;
        decodeAsync?: boolean;
        decodeWidth?: number;
        decodeHeight?: number;
      };
};

export const useImage = ({
  uri,
  resize,
  blurhash,
  onLoad,
}: Pick<AdvancedImageProps, 'uri' | 'resize' | 'blurhash'> & {
  onLoad?: (event: any) => void;
}) => {
  const hash = useMemo(() => {
    try {
      return (
        blurhash ??
        (uri?.startsWith('http') ? decodeURIComponent(uri.split('#')[1]) : '')
      );
    } catch (e) {
      return '';
    }
  }, [uri, blurhash]);

  const imageUrl = useMemo(
    () => (resize ? imageResizing.imageUriResized(uri, resize)! : uri),
    [uri, resize],
  );

  const urlRef = useRef(imageUrl);
  urlRef.current = imageUrl;

  const [showBlur, setShowBlur] = useState(
    Boolean(hash && imageUrl && !loadedImageUrls[imageUrl!]),
  );

  useEffect(() => {
    setShowBlur(Boolean(hash && imageUrl && !loadedImageUrls[imageUrl!]));
  }, [hash, imageUrl]);

  const onLoaded = useCallback(
    (event: any) => {
      setShowBlur(false);
      if (urlRef.current) {
        loadedImageUrls[urlRef.current] = true;
      }
      onLoad?.(event);
    },
    [onLoad],
  );

  return {
    hash,
    showBlur,
    imageUrl,
    onLoaded,
  };
};
