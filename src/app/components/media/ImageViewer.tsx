import PhotoView from '@merryjs/photo-viewer';
import { memo } from 'react';

export const ImageViewer = memo(
  (props: {
    images: string[];
    index?: number;
    show: boolean;
    shareButton?: boolean;
    onDismiss: () => void;
  }) => {
    const data = props.images.map(uri => ({ source: { uri } }));
    return (
      <PhotoView
        visible={props.show}
        data={data}
        hideStatusBar={false}
        initial={props.index ?? 0}
        hideShareButton={props.shareButton === false}
        onDismiss={props.onDismiss}
      />
    );
  },
);
