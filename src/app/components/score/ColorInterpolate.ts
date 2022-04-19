/**
 * @file: ColorInterpolate.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

type RGBAColor = [number, number, number, number?];
type ColorFormat = 'hex' | 'rgba';

export function interpolateColor(
  color1: RGBAColor,
  color2: RGBAColor,
  factor: number,
): RGBAColor {
  const result = Array<number>(Math.max(color1.length, color2.length));
  for (let i = 0; i < result.length; i++) {
    const [a = 1, b = 1] = [color1[i], color2[i]];
    result[i] = a + factor * (b - a);
  }
  return result as RGBAColor;
}

export function rgbaColorFromColorString(colorString: string) {
  if (colorString.startsWith('#')) {
    return rgbaColorFromHexString(colorString);
  }
  return rgbaColorFromRgbaString(colorString);
}

export function rgbaColorFromHexString(hexColor: string): RGBAColor {
  const m =
    /^#?([0-9a-z]{2})([0-9a-z]{2})([0-9a-z]{2})([0-9a-z]{2})?$/i.exec(
      hexColor.trim(),
    ) ?? /^#?([0-9a-z])([0-9a-z])([0-9a-z])([0-9a-z])?$/i.exec(hexColor.trim());
  if (!m) {
    throw new Error('invalid hex color string: ' + hexColor);
  }
  const [r, g, b, a] = m
    .slice(1)
    .filter(x => x != null)
    .map(x => parseInt(x.length === 1 ? x + x : x, 16));

  if (a == null) {
    return [r, g, b] as RGBAColor;
  }

  return [r, g, b, a / 255] as RGBAColor;
}

export function rgbaColorFromRgbaString(rgbaColor: string): RGBAColor {
  const m =
    /^rgba\s*\(\s*(\d{1,2}|[0-1]\d{2}|2[0-4]\d|25[0-5])\s*,\s*(\d{1,2}|[0-1]\d{2}|2[0-4]\d|25[0-5])\s*,\s*(\d{1,2}|[0-1]\d{2}|2[0-4]\d|25[0-5])(?:\s*,\s*(1(?:\.0*)?|0(?:\.\d*)?))\s*\)$/i.exec(
      rgbaColor,
    );
  if (!m) {
    throw new Error('invalid rgba color string: ' + rgbaColor);
  }
  return m.slice(1).map(x => (x == null ? 1 : parseFloat(x))) as RGBAColor;
}

export function formatRgbaColor(
  color: RGBAColor,
  format: ColorFormat = 'rgba',
): string {
  const [r, g, b] = color;
  let a = color[3];

  if (format === 'hex') {
    if (a != null) {
      a = Math.round(a * 255);
    }
    return (
      '#' +
      [r, g, b, a]
        .filter(x => x != null)
        .map(x => Math.round(x!).toString(16).padStart(2, '0'))
        .join('')
    );
  }
  return 'rgba(' + [r, g, b, a ?? 1].join(', ') + ')';
}

export function interpolateConoicGradientColors(
  angles: number[],
  colors: string[],
): RGBAColor[] {
  const total = 360;
  angles = [...angles, angles[0]];
  colors = [...colors, colors[0]];
  const result: RGBAColor[] = [];
  for (let i = 0; i < angles.length - 1; i++) {
    const [startAngle, endAngle] = [angles[i], angles[i + 1]];
    const [startColor, endColor] = [
      rgbaColorFromColorString(colors[i]),
      rgbaColorFromColorString(colors[i + 1]),
    ];
    const offset = (360 + endAngle - startAngle) % 360;
    const n = Math.min(Math.round(offset), total - result.length);
    for (let j = 0; j < n; j++) {
      const color = interpolateColor(startColor, endColor, j / n);
      result.push(color);
    }
  }
  return result;
}
