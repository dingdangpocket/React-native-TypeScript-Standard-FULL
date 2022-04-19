/**
 * @file: transformOrigin.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

export const transformOrigin = (
  { x, y }: { x: number; y: number },
  ...transformations: any[]
) => {
  'worklet';
  return [
    { translateX: x },
    { translateY: y },
    // eslint-disable-next-line reanimated/unsupported-syntax
    ...transformations,
    { translateX: x * -1 },
    { translateY: y * -1 },
  ];
};
