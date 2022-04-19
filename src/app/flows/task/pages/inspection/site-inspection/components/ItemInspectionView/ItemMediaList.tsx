import { LayoutProviderView } from '@euler/app/components/layout/LayoutProvider';
import { ImageViewer } from '@euler/app/components/media/ImageViewer';
import { MediaCoverView } from '@euler/app/components/media/MediaCoverView';
import { Center, StatusColors } from '@euler/components';
import { CircularProgress } from '@euler/components/CircularProgress';
import { MediaObject } from '@euler/model';
import { withConfirmation } from '@euler/utils';
import { useSharedValueFrom } from '@euler/utils/hooks';
import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { range } from 'ramda';
import { memo, useCallback, useMemo, useState } from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from 'styled-components';
import { CheckItemInfo, MediaInfo } from '../../functions/SiteInspection';

const kNumberOfColums = 3;
const kSpacing = 14;
const kVerticalSpacing = 10;
const kShowSuccessCheckmark = false;

type CellInfo =
  | { type: 'media'; media: MediaInfo; index: number }
  | { type: 'placeholder' };

const MediaView = memo(
  ({
    item,
    onPress,
  }: {
    item: MediaInfo;
    onPress?: (media: MediaObject) => void;
  }) => {
    const media = useMemo<MediaObject>(
      () => ({
        id: item.key,
        url: item.url,
        type: item.type,
        coverUrl: item.coverUrl,
      }),
      [item],
    );
    return (
      <MediaCoverView
        media={media}
        noPlaceholder
        playIconSize={44}
        onPress={onPress}
        css={`
          border-radius: 6px;
          overflow: hidden;
        `}
      />
    );
  },
);

const Cell = memo(
  ({
    cell,
    editable,
    size,
    style,
    onPress,
    onDelete,
    onRetry,
  }: {
    cell: CellInfo;
    editable?: boolean;
    size: number;
    style?: StyleProp<ViewStyle>;
    onPress?: (cell: CellInfo) => void;
    onDelete?: (cell: CellInfo & { type: 'media' }) => void;
    onRetry?: (cell: CellInfo & { type: 'media' }) => void;
  }) => {
    const {
      colors: {
        status: { danger },
      },
      inspection: {
        siteInspection: {
          itemCard: { mediaPlaceholderBgColor, mediaPlaceholderIconColor },
        },
      },
    } = useTheme();

    const [progressValue] = useSharedValueFrom(
      cell.type === 'media' && cell.media.status === 'uploading'
        ? cell.media.progress ?? 0
        : 0,
    );

    const onMediaPress = useCallback(() => {
      onPress?.(cell);
    }, [cell, onPress]);

    const onDeletePress = useCallback(() => {
      if (cell.type === 'placeholder') return;
      onDelete?.(cell);
    }, [cell, onDelete]);

    const onRetryPress = useCallback(async () => {
      if (cell.type === 'placeholder' || cell.media.status !== 'error') return;
      const result = await withConfirmation({
        title: '是否重新上传?',
        message: '',
        confirmButtonText: '是',
        cancelButtonText: '否',
      });
      if (result) {
        onRetry?.(cell);
      }
    }, [cell, onRetry]);

    if (cell.type === 'placeholder') {
      return (
        <TouchableOpacity
          onPress={onMediaPress}
          css={`
            width: ${size}px;
            height: ${size}px;
            background-color: ${mediaPlaceholderBgColor};
            border-radius: 6px;
            align-items: center;
            justify-content: center;
          `}
          style={style}
        >
          <Feather name="camera" size={30} color={mediaPlaceholderIconColor} />
        </TouchableOpacity>
      );
    }

    const { status } = cell.media;

    return (
      <View
        css={`
          width: ${size}px;
          height: ${size}px;
          border-radius: 6px;
        `}
        style={style}
      >
        <MediaView item={cell.media} onPress={onMediaPress} />
        {editable && (
          <>
            {status === 'uploaded' && kShowSuccessCheckmark ? (
              <Center
                pointerEvents="none"
                css={`
                  position: absolute;
                  right: 5px;
                  bottom: 5px;
                  width: 16px;
                  height: 16px;
                  background-color: ${StatusColors.Success};
                  border-radius: 8px;
                `}
              >
                <AntDesign name="check" size={12} color="#fff" />
              </Center>
            ) : null}
            {status === 'uploading' ||
            status === 'queued' ||
            status === 'error' ? (
              <Center
                style={StyleSheet.absoluteFill}
                css={`
                  width: ${size}px;
                  height: ${size}px;
                  border-radius: 6px;
                  overflow: hidden;
                  background-color: rgba(0, 0, 0, 0.5);
                `}
              >
                {status === 'uploading' ? (
                  <CircularProgress
                    progress={progressValue}
                    size={size / 2}
                    stroke="#aaa"
                    strokeWidth={4}
                  />
                ) : null}
                {status === 'error' ? (
                  <TouchableOpacity
                    onPress={onRetryPress}
                    css={`
                      position: absolute;
                      right: 0px;
                      bottom: 0px;
                      align-items: center;
                      justify-content: center;
                      width: 40px;
                      height: 40px;
                    `}
                  >
                    <MaterialIcons
                      name="error"
                      size={24}
                      color={StatusColors.Danger}
                    />
                  </TouchableOpacity>
                ) : null}
                {status === 'queued' ? (
                  <Center
                    css={`
                      position: absolute;
                      right: 0px;
                      bottom: 0px;
                      align-items: center;
                      justify-content: center;
                      width: 40px;
                      height: 40px;
                    `}
                  >
                    <AntDesign name="clockcircleo" size={20} color="#eee" />
                  </Center>
                ) : null}
              </Center>
            ) : null}
            <TouchableOpacity
              onPress={onDeletePress}
              css={`
                position: absolute;
                right: -7px;
                top: -7px;
                width: 18px;
                height: 18px;
                border-radius: 9px;
                background-color: ${danger};
                align-items: center;
                justify-content: center;
              `}
            >
              <AntDesign name="close" size={15} color="#fff" />
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  },
);

const Row = memo(
  ({
    width,
    editable,
    isFirstRow,
    cells,
    onCellPress,
    onDeleteMedia,
    onRetry,
  }: {
    width: number;
    editable?: boolean;
    isFirstRow?: boolean;
    cells: CellInfo[];
    onCellPress?: (cell: CellInfo) => void;
    onDeleteMedia?: (cell: CellInfo & { type: 'media' }) => void;
    onRetry?: (cell: CellInfo & { type: 'media' }) => void;
  }) => {
    const cellWidth =
      (width - kSpacing * (kNumberOfColums - 1)) / kNumberOfColums;
    return (
      <View
        css={`
          flex-direction: row;
          flex-wrap: nowrap;
          align-items: stretch;
          justify-content: flex-start;
          margin-top: ${isFirstRow ? 2 : kVerticalSpacing}px;
        `}
      >
        {cells.map((cell, index) => (
          <Cell
            key={cell.type === 'media' ? cell.media.key : '__placeholder__'}
            editable={editable}
            cell={cell}
            size={cellWidth}
            onPress={onCellPress}
            onDelete={onDeleteMedia}
            onRetry={onRetry}
            css={`
              margin-left: ${index === 0 ? 0 : kSpacing}px;
            `}
          />
        ))}
      </View>
    );
  },
);

export const ItemMediaList = memo(
  ({
    item,
    editable,
    onTakeMedia,
    onDeleteMedia,
    onRetryMediaUpload,
    onPreviewVideo,
  }: {
    item: CheckItemInfo;
    editable?: boolean;
    onTakeMedia?: (item: CheckItemInfo) => void;
    onDeleteMedia?: (item: CheckItemInfo, media: MediaInfo) => void;
    onRetryMediaUpload?: (item: CheckItemInfo, media: MediaInfo) => void;
    onPreviewVideo?: (item: CheckItemInfo, media: MediaInfo) => void;
  }) => {
    const medias = useMemo(() => item.medias ?? [], [item.medias]);

    const rows = useMemo(() => {
      const rowCount = Math.floor(medias.length / kNumberOfColums) + 1;
      const list = range(0, rowCount).map(i =>
        medias
          .slice(i * kNumberOfColums, (i + 1) * kNumberOfColums)
          .map<CellInfo>((media, j) => ({
            type: 'media',
            media,
            index: i * kNumberOfColums + j,
          })),
      );
      list[rowCount - 1].push({ type: 'placeholder' });
      return list;
    }, [medias]);

    const [currentIndex, setCurrentIndex] = useState<number>();
    const images = useMemo(
      () => medias.filter(x => x.type === 'image') ?? [],
      [medias],
    );

    const imageUrls = useMemo(() => images.map(x => x.url), [images]);

    const currentImageIndex = useMemo(
      () =>
        currentIndex == null
          ? undefined
          : medias[currentIndex]?.type === 'image'
          ? images.findIndex(x => x.key === medias[currentIndex].key)
          : 0,
      [currentIndex, images, medias],
    );

    const onCellPress = useCallback(
      (cell: CellInfo) => {
        if (cell.type === 'placeholder') {
          onTakeMedia?.(item);
        } else {
          if (cell.media.type === 'image') {
            setCurrentIndex(cell.index);
          } else {
            onPreviewVideo?.(item, cell.media);
          }
        }
      },
      [item, onPreviewVideo, onTakeMedia],
    );

    const onDelete = useCallback(
      (cell: CellInfo & { type: 'media' }) => {
        onDeleteMedia?.(item, cell.media);
      },
      [item, onDeleteMedia],
    );

    const onRetry = useCallback(
      (cell: CellInfo & { type: 'media' }) => {
        onRetryMediaUpload?.(item, cell.media);
      },
      [item, onRetryMediaUpload],
    );

    return (
      <>
        <ImageViewer
          images={imageUrls}
          index={currentImageIndex}
          show={currentImageIndex != null}
          onDismiss={() => setCurrentIndex(undefined)}
        />
        <LayoutProviderView>
          {size =>
            rows.map((cells, k) => (
              <Row
                key={k}
                isFirstRow={k === 0}
                editable={editable}
                cells={cells}
                width={size.width}
                onCellPress={onCellPress}
                onDeleteMedia={onDelete}
                onRetry={onRetry}
              />
            ))
          }
        </LayoutProviderView>
      </>
    );
  },
);
