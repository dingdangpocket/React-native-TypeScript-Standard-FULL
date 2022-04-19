/**
 * @file: useTagAnnotations.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { nanoid } from 'nanoid/non-secure';
import { useCallback, useMemo, useRef, useState } from 'react';
import { SharedValue } from 'react-native-reanimated';
import { AnnotationTagStyle, TagInfo } from './TagInfo';

type Tag = TagInfo;

export const synthesizedPos = (values: {
  x: number;
  y: number;
  tx: number;
  ty: number;
}) => {
  const { x, y, tx, ty } = values;
  return [+Math.round(x + tx), +Math.round(y + ty)] as const;
};

export const useTagAnnotations = () => {
  // keeps track of a list of tags added to the canvas.
  const [tags, setTags] = useState<Tag[]>([]);

  const tagListRef = useRef<Tag[]>(tags);
  tagListRef.current = tags;

  /**
   * Add new tag.
   */
  const addNewTag = useCallback(
    (name: string, x: number, y: number, style?: AnnotationTagStyle) => {
      // create a new tag
      const tag: Tag = {
        id: nanoid(),
        name,
        x,
        y,
        width: 0,
        height: 0,
        style,
      };

      setTags(list => [...list, tag]);
    },
    [],
  );

  /**
   * Initialize the interaction context of the given tag.
   */
  const initTagInteractionContext = useCallback(
    (
      id: string,
      interaction: {
        zIndex: SharedValue<number>;
        translateX: SharedValue<number>;
        translateY: SharedValue<number>;
      },
    ) => {
      const tag = tagListRef.current.find(x => x.id === id);

      if (!tag) return;

      Object.assign(tag, interaction);

      // bring the tag to front by adjusting its z-index
      const max = Math.max(
        ...tagListRef.current.map(x => x.zIndex?.value ?? 0),
      );

      tag.zIndex!.value = max + 1;
    },
    [],
  );

  /**
   * Bring the given tag to front by adjusting its z-ordering.
   */
  const bringTagToFront = useCallback((id: string) => {
    const tag = tagListRef.current.find(x => x.id === id);

    if (!tag?.zIndex) return;

    // bring the tag to front by adjusting its z-index
    const max = Math.max(...tagListRef.current.map(x => x.zIndex?.value ?? 0));
    if (tag.zIndex.value < max) {
      tag.zIndex.value = max + 1;
    }
  }, []);

  /**
   * Update the given tag's information.
   */
  const updateTag = useCallback(
    (
      id: string,
      updateInfo: { [p in keyof Tag]?: Tag[p] },
      inPlace?: boolean,
    ) => {
      let tag = tagListRef.current.find(x => x.id === id);
      if (!tag) {
        return;
      }
      if (inPlace) {
        Object.assign(tag, updateInfo);
        return;
      }
      tag = { ...tag, ...updateInfo };
      setTags(list => list.map(x => (x.id === id ? tag! : x)));
    },
    [],
  );

  const selectTag = useCallback((id: string) => {
    setTags(list =>
      list.map(item => {
        if (item.id === id) {
          if (item.selected) return item;
          return { ...item, selected: true };
        }
        if (item.selected) {
          return { ...item, selected: false };
        }
        return item;
      }),
    );
  }, []);

  const deselectTag = useCallback((id: string) => {
    setTags(list =>
      list.map(item => {
        if (item.id === id) {
          if (!item.selected) return item;
          return { ...item, selected: false };
        }
        return item;
      }),
    );
  }, []);

  const deleteTag = useCallback((id: string) => {
    setTags(list => list.filter(x => x.id !== id));
  }, []);

  const deselectAll = useCallback(() => {
    setTags(list =>
      list.map(x => (x.selected ? { ...x, selected: false } : x)),
    );
  }, []);

  const updateTagStyle = useCallback(
    (
      id: string,
      style: { [p in keyof AnnotationTagStyle]?: AnnotationTagStyle[p] },
    ) => {
      setTags(list =>
        list.map(x =>
          x.id === id
            ? ({ ...x, style: { ...x.style, ...style } } as TagInfo)
            : x,
        ),
      );
    },
    [],
  );

  const selectedTag = useMemo(() => tags.find(x => x.selected), [tags]);

  return {
    tags,
    selectedTag,
    addNewTag,
    initTagInteractionContext,
    bringTagToFront,
    updateTag,
    selectTag,
    deselectTag,
    deleteTag,
    deselectAll,
    updateTagStyle,
  };
};
