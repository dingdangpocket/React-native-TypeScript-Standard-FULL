/**
 * @file: predefinedTags.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
import { FontFamily } from '@euler/components/typography';
import { AnnotationTagStyle } from './TagInfo';
export { AnnotationTagColorStyle } from './TagInfo';

export const PredefinedAnnotationTags = {
  deliveryCheck: ['检查合格', '达到上限', '已修复', '已更换'],
  preInspection: ['划痕', '凹陷', '掉漆', '破损', '进水', '脏污'],
  inspection: ['漏液', '脏污', '损坏', '到达使用里程', '故障', '开裂', '老化'],
};

export const DefaultTagFontSize = 14;
export const DefaultTagFontFamily = FontFamily.NotoSans.Light;

export const DefaultAnnotationTagStyle: AnnotationTagStyle = {
  stroke: '#FFA500',
  fill: '#555555',
  textFill: '#FFFFFF',
};

const DefaultTagColorPalette = {
  white: ['#F2F2F2', '#2B2B2B'],
  black: ['#2B2B2B', '#FFFFFF'],
  red: ['#F95151', '#FFFFFF'],
  yellow: ['#FFC300', '#FFFFFF'],
  green: ['#07C160', '#FFFFFF'],
  blue: ['#10AEFE', '#FFFFFF'],
  purple: ['#6467F0', '#FFFFFF'],
};

export type TagColorPaletteKey = keyof typeof DefaultTagColorPalette;

export const DefaultTagColorPaletteKeys = Object.keys(
  DefaultTagColorPalette,
) as TagColorPaletteKey[];

export type TagColorPresets = {
  [p in TagColorPaletteKey]: AnnotationTagStyle;
};

export const DefaultTagColorPresets =
  DefaultTagColorPaletteKeys.reduce<TagColorPresets>((presets, key) => {
    presets[key] = {
      stroke: DefaultTagColorPalette[key][0],
      fill: DefaultTagColorPalette[key][0],
      textFill: DefaultTagColorPalette[key][1],
    };
    return presets;
    // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
  }, {} as any);
