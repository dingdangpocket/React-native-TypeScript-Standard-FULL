/**
 * @file: TagInfo.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
import { SharedValue } from 'react-native-reanimated';

export type AnnotationTagColorStyle = {
  stroke: string;
  fill: string;
  textFill: string;
};

export type AnnotationTagStyle = AnnotationTagColorStyle;

export type TagInfo = {
  id: string;
  name: string;
  /** the initial x of touch point */
  x: number;
  /** the initial y of touch point */
  y: number;
  /** width of the tag */
  width: number;
  /** height of the tag */
  height: number;
  /** zIndex of the tag */
  zIndex?: SharedValue<number>;
  /** translate-x value of the tag  */
  translateX?: SharedValue<number>;
  /** translate-y value of the tag  */
  translateY?: SharedValue<number>;
  /** cutomized tag style */
  style?: Partial<AnnotationTagStyle>;
  /** if the tag is selected */
  selected?: boolean;
};
