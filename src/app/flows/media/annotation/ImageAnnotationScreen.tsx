/* eslint-disable @typescript-eslint/no-use-before-define */
import { AppNavParams } from '@euler/app/Routes';
import { Center } from '@euler/components';
import { wrapNavigatorScreen } from '@euler/functions';
import { useWatchValue } from '@euler/utils/hooks';
import { NavigationAction, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AnimatePresence, MotiView } from 'moti';
import { uniq } from 'ramda';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Image, LayoutRectangle, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ViewShot from 'react-native-view-shot';
import { AnnotationCanvas } from './components/AnnotationCanvas';
import { TagButtonBar } from './components/TagButtonBar';
import { TagInteractionContext } from './components/TagView';
import { TopActionBar } from './components/TopActionBar';
import { ImageAnotationMetadata } from './functions/AnnotationMetadata';
import { AnnotationMetadataBuilder } from './functions/AnnotationMetadataBuilder';
import { AnnotationTagStyle, TagInfo } from './functions/TagInfo';
import {
  AnnotationTagColorStyle,
  DefaultAnnotationTagStyle,
  DefaultTagFontFamily,
  DefaultTagFontSize,
} from './functions/tagPresets';
import { useImagePreviewSize } from './functions/useImagePreviewSize';
import { useTagAnnotations } from './functions/useTagAnnotations';

export const ImageAnnotationScreen = wrapNavigatorScreen(
  ({
    imageUri,
    mask,
    tags,
    quality,
    onDone,
  }: {
    imageUri: string;
    mask?: { width: number; height: number };
    tags: string[];
    quality?: number;
    onDone?: (result: {
      imageUri: string;
      originalImageUri: string;
      width: number;
      height: number;
      annotationMetadata: ImageAnotationMetadata | undefined;
    }) => void;
  }) => {
    const [width, height] = useImagePreviewSize({ mask });

    return (
      <View
        css={`
          flex: 1;
          background-color: black;
        `}
      >
        <Center
          css={`
            width: ${width}px;
            flex: 1;
            align-items: center;
            justify-content: center;
          `}
        >
          <Content
            imageUri={imageUri}
            width={width}
            height={height}
            quality={quality}
            predefinedTags={tags}
            onDone={onDone}
          />
        </Center>
      </View>
    );
  },
  {
    headerShown: false,
    cardStyle: {
      backgroundColor: '#000000',
    },
    animationEnabled: false,
  },
);

const getTagCoords = (tag: TagInfo) => {
  const [x1, y1] = [
    tag.x + (tag.translateX?.value ?? 0),
    tag.y + (tag.translateY?.value ?? 0),
  ];
  return {
    x1,
    y1,
    x2: x1 + tag.width,
    y2: y1 + tag.height,
  };
};

const Content = memo(
  ({
    imageUri,
    width,
    height,
    predefinedTags,
    quality = 0.85,
    onDone,
  }: {
    imageUri: string;
    width: number;
    height: number;
    predefinedTags: string[];
    quality?: number;
    onDone?: (result: {
      imageUri: string;
      originalImageUri: string;
      width: number;
      height: number;
      annotationMetadata: ImageAnotationMetadata | undefined;
    }) => void;
  }) => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<StackNavigationProp<AppNavParams>>();
    const [isControlsVisible, setIsControlsVisible] = useState(true);
    const [isNavigatingAway, setIsNavigatingAway] = useState(false);
    const continueAction = useRef<NavigationAction>();
    const viewShot = useRef<ViewShot>(null);

    const {
      tags,
      addNewTag,
      updateTag,
      initTagInteractionContext,
      bringTagToFront,
      selectTag,
      deselectAll,
      deleteTag,
      selectedTag,
      updateTagStyle,
    } = useTagAnnotations();
    const [nextTag, setNextTag] =
      useState<{ name: string; style?: AnnotationTagStyle }>();
    const tipTimeout = useRef<any>();

    useEffect(() => {
      return navigation.addListener('beforeRemove', e => {
        e.preventDefault();
        continueAction.current = e.data.action;
        setIsControlsVisible(false);
        setIsNavigatingAway(true);
      });
    }, [navigation]);

    const onRetake = useCallback(() => {
      navigation.goBack();
    }, [navigation]);

    const onTagButtonPress = useCallback(
      (name: string) => {
        setNextTag({ name });
        deselectAll();
        if (tipTimeout.current) {
          clearTimeout(tipTimeout.current);
        }
        tipTimeout.current = setTimeout(() => {
          tipTimeout.current = undefined;
          setNextTag(undefined);
        }, 60000);
      },
      [deselectAll],
    );

    const onAddTag = useCallback(() => {
      setIsControlsVisible(false);
      navigation.navigate('_addCustomTagAnnotation', {
        onCancel: () => {
          navigation.goBack();
          setIsControlsVisible(true);
        },
        onDone: (name, style) => {
          navigation.goBack();
          setIsControlsVisible(true);
          name = name.trim();
          if (!name) return;
          setNextTag({ name, style });
        },
      });
    }, [navigation]);

    const onCanvasTap = useCallback(
      (x: number, y: number) => {
        deselectAll();

        if (!nextTag) return;

        setNextTag(undefined);

        if (tipTimeout.current) {
          clearTimeout(tipTimeout.current);
          tipTimeout.current = undefined;
        }

        addNewTag(nextTag.name, x, y, nextTag.style);
      },
      [addNewTag, deselectAll, nextTag],
    );

    const onTagReadyForInteraction = useCallback(
      (id: string, interaction: TagInteractionContext) => {
        initTagInteractionContext(id, interaction);
      },
      [initTagInteractionContext],
    );

    const onTagMoveBegin = useCallback(
      (id: string) => {
        bringTagToFront(id);
      },
      [bringTagToFront],
    );

    const onTagLayoutChange = useCallback(
      (id: string, layout: LayoutRectangle) => {
        updateTag(id, layout, true);
      },
      [updateTag],
    );

    const onTagPress = useCallback(
      (id: string) => {
        selectTag(id);
      },
      [selectTag],
    );

    const onDeleteTag = useCallback(
      (id: string) => {
        deleteTag(id);
      },
      [deleteTag],
    );

    const onTagColorStyleChange = useCallback(
      (id: string, style: AnnotationTagColorStyle) => {
        updateTagStyle(id, style);
      },
      [updateTagStyle],
    );

    const finish = useCallback(async () => {
      const annotationMetadata = !tags.length
        ? undefined
        : AnnotationMetadataBuilder.builder({
            keywords: uniq(tags.map(x => x.name)),
            canvasWidth: width,
            canvasHeight: height,
          })
            .withStyle('tag', {
              stroke: DefaultAnnotationTagStyle.stroke,
              fill: DefaultAnnotationTagStyle.fill,
            })
            .withStyle('text', {
              fill: DefaultAnnotationTagStyle.textFill,
            })
            .withObjects(objects => {
              tags.forEach(tag =>
                objects.tag(t =>
                  t
                    .withCoords(getTagCoords(tag))
                    .withStyleName('tag')
                    .withZIndex(tag.zIndex?.value)
                    .withStyle(style =>
                      style
                        .withFill(tag.style?.fill)
                        .withStroke(tag.style?.stroke),
                    )
                    .withName(
                      tag.name,
                      'text',
                      {
                        family: DefaultTagFontFamily,
                        size: DefaultTagFontSize,
                      },
                      style => style.withFill(tag.style?.textFill),
                    ),
                ),
              );
            })
            .getMetadata();

      let snapshotImageUri = imageUri;
      const originalImageUri = imageUri;

      if (viewShot.current) {
        try {
          const result = await viewShot.current.capture?.();
          if (result) {
            snapshotImageUri = result;
          }
        } catch (e) {}
      }

      onDone?.({
        imageUri: snapshotImageUri,
        originalImageUri,
        width,
        height,
        annotationMetadata,
      });
    }, [height, imageUri, onDone, tags, width]);

    const continueFinish = useRef(false);

    useWatchValue(selectedTag, async (prev, curr) => {
      if (prev && !curr && continueFinish.current) {
        await finish();
      }
    });

    const onConfirm = useCallback(async () => {
      if (selectedTag) {
        continueFinish.current = true;
        // clear the selection otherwise the selected view artifacts
        // will also be rendered.
        deselectAll();
      } else {
        await finish();
      }
    }, [deselectAll, finish, selectedTag]);

    return (
      <>
        <ViewShot
          ref={viewShot}
          options={{ format: 'jpg', quality }}
          css={`
            width: ${width}px;
            height: ${height}px;
          `}
        >
          <Image
            source={{ uri: imageUri }}
            css={`
              width: ${width}px;
              height: ${height}px;
            `}
            resizeMode="cover"
          />
          <AnnotationCanvas
            width={width}
            height={height}
            tags={tags}
            onTap={onCanvasTap}
            onTagMoveBegin={onTagMoveBegin}
            onTagReadyForInteraction={onTagReadyForInteraction}
            onTagLayoutChange={onTagLayoutChange}
            onTagPress={onTagPress}
            onDeleteTag={onDeleteTag}
          />
        </ViewShot>
        <TopActionBar
          visible={isControlsVisible}
          nextTag={nextTag?.name}
          selectedTag={selectedTag}
          onRetake={onRetake}
          onConfirm={onConfirm}
          onTagColorStyleChange={onTagColorStyleChange}
        />

        <AnimatePresence>
          {isControlsVisible !== false && (
            <MotiView
              from={{ translateY: 50 + insets.top, opacity: 0 }}
              animate={{ translateY: 0, opacity: 1 }}
              exit={{ translateY: 50 + insets.top, opacity: 0 }}
              transition={{
                type: 'timing',
              }}
              css={`
                position: absolute;
                left: 0;
                bottom: ${insets.bottom + 15}px;
                right: 0;
                background-color: #000;
              `}
            >
              <TagButtonBar
                tags={predefinedTags}
                activeTag={nextTag?.name}
                onTagPress={onTagButtonPress}
                onAddTag={onAddTag}
              />
            </MotiView>
          )}
        </AnimatePresence>
        <AnimatePresence
          onExitComplete={() => {
            if (continueAction.current) {
              navigation.dispatch(continueAction.current);
            }
          }}
        >
          {!isNavigatingAway && (
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                type: 'timing',
              }}
              css={`
                width: 0px;
                height: 0px;
              `}
            />
          )}
        </AnimatePresence>
      </>
    );
  },
);
