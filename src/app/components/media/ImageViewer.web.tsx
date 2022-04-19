import { memo, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ImagesViewer from 'react-images-viewer';

export const ImageViewer = memo(
  (props: {
    images: string[];
    index?: number;
    show: boolean;
    shareButton?: boolean;
    onDismiss: () => void;
  }) => {
    const data = props.images.map(uri => ({ src: uri }));
    const [currImg, setCurrImg] = useState(props.index ?? 0);
    return (
      <ImagesViewer
        backdropCloseable={true}
        imgs={data}
        currImg={currImg}
        isOpen={props.show}
        onClickPrev={() => setCurrImg(currImg - 1)}
        onClickNext={() => setCurrImg(currImg + 1)}
        onClickThumbnail={(index: any) => setCurrImg(index)}
        showThumbnails={true}
        onClose={props.onDismiss}
      />
    );
  },
);
