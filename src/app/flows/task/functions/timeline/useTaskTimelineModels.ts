/**
 * @file: useTaskTimelineModels.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { MediaObject } from '@euler/model';
import { useMemo } from 'react';
import { TextLine, TimelineSection, TimelineSectionType } from './types';

export type TimelineCell =
  | {
      type: 'section-header';
      id: string;
      sectionType: TimelineSectionType;
      title: string;
      onPressLink?: (type: TimelineSectionType) => void;
      first: boolean;
      last: boolean;
    }
  | {
      type: 'event';
      id: string;
      technicianName: string;
      title: TextLine;
      taglines?: TextLine[];
      timestamp: Date;
      medias?: MediaObject[];
      first: boolean;
      last: boolean;
      lastSection: boolean;
    };

export function useTaskTimelineModels({
  sections,
  onPressSectionHeader,
}: {
  sections: TimelineSection[];
  onPressSectionHeader?: (type: TimelineSectionType) => void;
}) {
  return useMemo(() => {
    const cells: TimelineCell[] = [];
    for (const section of sections) {
      cells.push({
        id: `section-header/${section.type}`,
        type: 'section-header',
        sectionType: section.type,
        title: section.label,
        onPressLink: onPressSectionHeader,
        first: section === sections[0],
        last: section === sections[sections.length - 1],
      });
      for (const item of section.items) {
        cells.push({
          id: item.key,
          type: 'event',
          technicianName: item.author,
          title: item.label,
          taglines: item.taglines,
          timestamp: item.timestamp,
          first: item === section.items[0],
          last: item === section.items[section.items.length - 1],
          lastSection: section === sections[sections.length - 1],
          medias: item.medias?.map(x => ({
            type: x.type.startsWith('image/') ? 'image' : 'video',
            id: x.id,
            url: x.url,
            coverUrl: x.coverUrl,
          })),
        });
      }
    }
    return { cells };
  }, [sections, onPressSectionHeader]);
}
