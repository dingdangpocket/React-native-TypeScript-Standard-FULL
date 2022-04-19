/**
 * @file: DateSegments.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

export type DateSegmentItem = {
  type: 'offset';
  unit: 'day' | 'month' | 'week';
  text: string;
  value: number;
};

type PredefinedDateRangeKey = 'recent7days' | 'recent30days' | 'today';

export const PredefinedDateSegments: {
  [key in PredefinedDateRangeKey]: DateSegmentItem;
} = {
  today: {
    type: 'offset',
    unit: 'day',
    text: '今日',
    value: 0,
  },
  recent7days: {
    type: 'offset',
    unit: 'day',
    text: '近7日',
    value: -6,
  },
  recent30days: {
    type: 'offset',
    unit: 'day',
    text: '近30日',
    value: -29,
  },
};

export const CommonDateSegments = [
  PredefinedDateSegments.recent7days,
  PredefinedDateSegments.recent30days,
];
