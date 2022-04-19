import { LayoutProviderView } from '@euler/app/components/layout/LayoutProvider';
import { ImageViewer } from '@euler/app/components/media/ImageViewer';
import { MediaCoverView } from '@euler/app/components/media/MediaCoverView';
import { ModalNavParams } from '@euler/app/Routes';
import { Colors } from '@euler/components';
import { MediaObject } from '@euler/model/MediaObject';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { range } from 'ramda';
import { ComponentType, memo, useCallback, useMemo, useState } from 'react';
import { FlatList, StyleProp, View, ViewStyle } from 'react-native';

const PageIndicator = memo(
  (props: { style?: StyleProp<ViewStyle>; total: number; current: number }) => (
    <View
      css={`
        flex-direction: row;
        height: 16px;
        border-radius: 8px;
        background-color: rgba(255, 255, 255, 0.8);
        align-items: center;
        padding-left: 6px;
        padding-right: 3px;
      `}
      style={props.style}
    >
      {range(0, props.total).map(i => (
        <View
          key={i}
          css={`
            width: 8px;
            height: 8px;
            border-radius: 4px;
            background-color: ${i === props.current
              ? Colors.White
              : Colors.Gray3};
            margin-right: 3px;
          `}
        />
      ))}
    </View>
  ),
);

export const MediaCarousel = memo(
  ({
    medias,
    style,
    itemStyle,
    showPageIndicators,
    scrollEnabled,
    playIconSize,
    playIconStyle,
    listKey,
    TouchableComponent,
    ...props
  }: {
    scrollEnabled?: boolean;
    medias: MediaObject[];
    style?: StyleProp<ViewStyle>;
    showPageIndicators?: boolean;
    TouchableComponent?: ComponentType;
    itemStyle?: StyleProp<ViewStyle>;
    listWidth?: number;
    listKey?: string;
    aspectRatio?: number;
    playIconSize?: number;
    playIconStyle?: StyleProp<ViewStyle>;
  } & (
    | {
        display?: 'swiper';
      }
    | {
        display: 'list';
        size?: number | { width: number; height: number };
        rowStyle?: StyleProp<ViewStyle>;
        itemSpacer?: number;
        numberOfItemsPerRow?: number;
      }
  )) => {
    const navigation = useNavigation<StackNavigationProp<ModalNavParams>>();
    const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = useMemo(
      () => medias.filter(x => x.type === 'image'),
      [medias],
    );
    const imageUrls = useMemo(() => images.map(x => x.url), [images]);
    const currentImageIndex = useMemo(
      () =>
        medias[currentIndex]?.type === 'image'
          ? images.findIndex(x => x.id === medias[currentIndex].id)
          : 0,
      [currentIndex, images, medias],
    );
    const onMediaPress = useCallback(
      (media: MediaObject) => {
        if (media.type === 'image') {
          setIsImageViewerOpen(true);
        } else {
          // todo
          navigation.navigate('_mediaPreview', {
            type: 'video',
            url: media.url,
          });
        }
      },
      [navigation],
    );

    if (!medias.length) return null;

    if (props.display === 'list') {
      const {
        size,
        numberOfItemsPerRow,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        rowStyle,
        itemSpacer = 0,
        listWidth,
        aspectRatio = 1,
      } = props;

      return (
        <LayoutProviderView passthrough={listWidth != null} style={style}>
          {layout => {
            const width = listWidth ?? layout.width;

            let mediaWidth = 0;
            let mediaHeight = 0;

            if (numberOfItemsPerRow) {
              mediaWidth = Math.max(
                0,
                (width - (numberOfItemsPerRow - 1) * itemSpacer) /
                  numberOfItemsPerRow,
              );
            } else if (size) {
              if (typeof size === 'number') {
                mediaWidth = size;
              } else {
                mediaWidth = size.width;
                mediaHeight = size.height;
              }
            } else {
              mediaWidth = width;
            }

            if (!mediaHeight) {
              mediaHeight = mediaWidth / aspectRatio;
            }

            return (
              <View
                css={`
                  flex-direction: row;
                  flex-wrap: wrap;
                `}
              >
                <ImageViewer
                  images={imageUrls}
                  index={currentImageIndex}
                  show={isImageViewerOpen}
                  onDismiss={() => setIsImageViewerOpen(false)}
                />
                {medias.map(item => (
                  <View
                    key={item.id}
                    css={`
                      width: ${mediaWidth}px;
                      height: ${mediaHeight}px;
                      margin-right: ${itemSpacer}px;
                    `}
                    style={itemStyle}
                  >
                    <MediaCoverView
                      media={item}
                      playIconSize={playIconSize}
                      playIconStyle={playIconStyle}
                      onPress={onMediaPress}
                      TouchableComponent={TouchableComponent}
                    />
                  </View>
                ))}
              </View>
            );
          }}
        </LayoutProviderView>
      );
    }

    return (
      <LayoutProviderView style={style}>
        {size => (
          <>
            <ImageViewer
              images={imageUrls}
              index={currentImageIndex}
              show={isImageViewerOpen}
              onDismiss={() => setIsImageViewerOpen(false)}
            />
            <FlatList
              data={medias}
              keyExtractor={item => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              scrollEnabled={scrollEnabled}
              listKey={listKey}
              renderItem={({ item }) => (
                <MediaCoverView
                  media={item}
                  playIconSize={playIconSize}
                  playIconStyle={playIconStyle}
                  onPress={onMediaPress}
                  TouchableComponent={TouchableComponent}
                  css={`
                    width: ${size.width}px;
                    height: ${size.height}px;
                  `}
                  style={itemStyle}
                />
              )}
              onMomentumScrollEnd={e =>
                setCurrentIndex(
                  Math.round(e.nativeEvent.contentOffset.x / size.width),
                )
              }
            />
            {showPageIndicators !== false && medias.length > 1 && (
              <View
                css={`
                  position: absolute;
                  bottom: 10px;
                  left: 0;
                  right: 0;
                  justify-content: center;
                  flex-direction: row;
                `}
              >
                <PageIndicator total={medias.length} current={currentIndex} />
              </View>
            )}
          </>
        )}
      </LayoutProviderView>
    );
  },
);
