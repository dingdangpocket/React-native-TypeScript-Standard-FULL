/**
 * @file: AnnotationMetadata.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

export type ObjectStyle = {
  stroke?: string;
  stroke_width?: number;
  stroke_opacity?: number;
  fill?: string;
  fill_opacity?: number;
  transform?: {
    scale?: number | { x?: number; y?: number };
    rotate?: string;
    translate?: string;
  };
};

export type BaseObject = ObjectStyle & {
  style?: string;
};

export type AnnotationObject = BaseObject &
  (
    | Line
    | Arrow
    | Rect
    | Oval
    | Circle
    | Ellipse
    | Polyline
    | Polygon
    | Text
    | Tag
  );

export type Line = {
  type: 'line';
  coords: { x1: number; y1: number; x2: number; y2: number };
};

export type Arrow = {
  type: 'arrow';
  coords: { x1: number; y1: number; x2: number; y2: number };
};

export type Rect = {
  type: 'rect';
  coords: { x: number; y: number; w: number; h: number };
};

export type Oval = {
  type: 'oval';
  coords: { x: number; y: number; w: number; h: number };
};

export type Circle = {
  type: 'circle';
  coords: { cx: number; cy: number; r: number };
};

export type Ellipse = {
  type: 'ellipse';
  coords: { cx: number; cy: number; rx: number; ry: number };
};

export type Polyline = {
  type: 'polyline';
  points: string;
};

export type Polygon = {
  type: 'polygon';
  points: string;
};

export type Text = {
  type: 'text';
  coords: { x: number; y: number; w: number; h: number };
  text: string;
  line_height: number;
  bg_color?: string;
  font: { family?: string; size: number | string };
};

export type Tag = {
  type: 'tag';
  coords: { x1: number; y1: number; x2: number; y2: number };
  zindex?: number;
  name: {
    text: string;
    style?: string;
    font: { family?: string; size: number | string };
  } & ObjectStyle;
};

export type ImageAnotationMetadata = {
  version: string;
  keywords?: string[];
  canvas: { width: number; height: number };
  origin_uri: string;
  style?: { [name: string]: ObjectStyle };
  objects?: AnnotationObject[];
};
