/* eslint-disable @typescript-eslint/member-ordering */
/**
 * @file: item-builder.ts
 * @author: eric <eric.blueplus@gmail.com>
 * @copyright: (c) 2019-2020 sichuan zhichetech co., ltd.
 */

import {
  getMediaPreviewUrl,
  getVideoStreamUrl,
} from '@euler/functions/getMediaPreviewUrl';
import { InspectionTaskEventDataType } from '@euler/model/enum';
import qs from 'qs';
import {
  EventInfo,
  TextLine,
  TimelineItemInfo,
  TimelineItemInfoBuilder,
  TimelineItemMedia,
  TimelineSectionType,
} from '../types';

export class TimelineItemInfoBuilderImpl implements TimelineItemInfoBuilder {
  private item: TimelineItemInfo = {} as any;
  private _data: any;

  constructor(private readonly event: EventInfo) {
    this.item.author = event.author ?? '';
    this.item.timestamp = new Date(event.timestamp);
    this.item.sourceEvent = event;
    this.item.key = event.id;
    this.item.taglines = [];
    this.initialize();
  }

  private initialize() {
    const event = this.event;
    if (event.dataType === InspectionTaskEventDataType.Json) {
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      this._data = JSON.parse(event.data || '{}');
    } else if (event.dataType === InspectionTaskEventDataType.Text) {
      this._data = (event.data ?? '').split('\n');
    } else if (event.dataType === InspectionTaskEventDataType.StringList) {
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      this._data = JSON.parse(event.data || '[]');
    } else if (event.dataType === InspectionTaskEventDataType.QueryString) {
      this._data = qs.parse(event.data ?? '');
    } else if (event.dataType === InspectionTaskEventDataType.None) {
      this._data = null;
    } else {
      this._data = event.data;
    }
  }

  get data() {
    return this._data;
  }

  sectionType(type: TimelineSectionType): this {
    this.item.sectionType = type;
    return this;
  }

  key(value: string): this {
    this.item.key = value;
    return this;
  }

  author(value: string): this {
    this.item.author = value;
    return this;
  }

  label(value: TextLine): this {
    this.item.label = value;
    return this;
  }

  tagline(line: TextLine): this {
    this.item.taglines.push(line);
    return this;
  }

  medias(values: TimelineItemMedia[] | 'string'): this {
    if (typeof values === 'string') {
      // use the property values in the data
      this.item.medias = [];
      if (this.data && Array.isArray(this.data[values])) {
        for (const entry of this.data[values]) {
          this.item.medias.push({
            id: entry._ || String(entry.id),
            key: entry._ || String(entry.id),
            type: entry.t || 'image/png',
            coverUrl: entry.cr,
            url:
              entry.url ||
              (entry.t?.startsWith('video/')
                ? getVideoStreamUrl(entry._)
                : '') ||
              (entry._ && getMediaPreviewUrl(entry._)),
          });
        }
      }
    } else {
      this.item.medias = values;
    }
    return this;
  }

  get() {
    return this.item;
  }
}
