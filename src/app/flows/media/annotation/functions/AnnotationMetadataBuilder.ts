/* eslint-disable @typescript-eslint/no-use-before-define */
/**
 * @file: AnnotationMetadataBuilder.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import * as Metadata from './AnnotationMetadata';

const kVersion = '1.0';

export class AnnotationMetadataBuilder {
  private readonly version = kVersion;
  private keywords?: string[];
  private canvas = { width: 0, height: 0 };
  private styles?: { [name: string]: Metadata.ObjectStyle };
  private readonly objects: Metadata.AnnotationObject[] = [];

  private constructor() {}

  static builder(metadata: {
    keywords?: string[];
    canvasWidth: number;
    canvasHeight: number;
  }) {
    const builder = new AnnotationMetadataBuilder();
    builder.canvas = {
      width: metadata.canvasWidth,
      height: metadata.canvasHeight,
    };
    builder.keywords = metadata.keywords;
    return builder;
  }

  withStyle(name: string, style: Metadata.ObjectStyle): this {
    if (!this.styles) this.styles = {};
    this.styles[name] = style;
    return this;
  }

  withObject(object: Metadata.AnnotationObject): this {
    this.objects.push(object);
    return this;
  }

  withObjects(fn: (objectsBuilder: ObjectsBuilder) => void): this {
    const objectsBuilder = new ObjectsBuilder();
    fn(objectsBuilder);
    const objects = objectsBuilder.getObjects();
    this.objects.push(...objects);
    return this;
  }

  getMetadata(): Metadata.ImageAnotationMetadata {
    return {
      version: this.version,
      origin_uri: '',
      keywords: this.keywords,
      canvas: this.canvas,
      style: this.styles,
      objects: this.objects,
    };
  }
}

class ObjectsBuilder {
  private readonly objects: Metadata.AnnotationObject[] = [];
  tag(fn: (tagBuilder: TagObjectBuilder) => void) {
    const tagBuilder = new TagObjectBuilder();
    fn(tagBuilder);
    const tag = tagBuilder.getObject();
    this.objects.push(tag);
    return this;
  }

  getObjects() {
    return this.objects;
  }
}

class ObjectBuilder<T> {
  protected object: Metadata.BaseObject & T = {} as any;
  withStyleName(style: string): this {
    this.object.style = style;
    return this;
  }
  withStyle(fn: (styleBuilder: StyleBuilder) => void): this {
    const styleBuilder = new StyleBuilder();
    fn(styleBuilder);
    Object.assign(this.object, styleBuilder.getStyle());
    return this;
  }
  getObject() {
    return this.object;
  }
}

class StyleBuilder {
  private style?: Metadata.ObjectStyle;
  withStroke(
    stroke: string | undefined,
    width?: number,
    opacity?: number,
  ): this {
    if (!this.style) this.style = {};
    this.style.stroke = stroke;
    this.style.stroke_width = width;
    this.style.stroke_opacity = opacity;
    return this;
  }
  withFill(fill: string | undefined, opacity?: number): this {
    if (!this.style) this.style = {};
    this.style.fill = fill;
    this.style.fill_opacity = opacity;
    return this;
  }
  withTransform(
    transform: Metadata.ObjectStyle['transform'] | undefined,
  ): this {
    if (!this.style) this.style = {};
    this.style.transform = transform;
    return this;
  }
  getStyle() {
    return this.style;
  }
}

class TagObjectBuilder extends ObjectBuilder<Metadata.Tag> {
  constructor() {
    super();
    this.object.type = 'tag';
  }
  withCoords(coords: Metadata.Tag['coords']): this {
    this.object.coords = coords;
    return this;
  }
  withZIndex(zindex: number | undefined): this {
    this.object.zindex = zindex;
    return this;
  }
  withName(
    name: string,
    style: string | undefined,
    font: Metadata.Tag['name']['font'],
    fn: (styleBuilder: StyleBuilder) => void,
  ): this {
    const styleBuilder = new StyleBuilder();
    fn(styleBuilder);
    const styleProps = styleBuilder.getStyle();
    this.object.name = {
      text: name,
      style,
      font,
      ...styleProps,
    };
    return this;
  }
}
