/**
 * @file: builder.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import { StyleProp, ViewStyle } from 'react-native';
import {
  FormElement,
  FormElementCustom,
  FormElementGroup,
  FormElementText,
  FormElementType,
} from './types';

type ElemParamType<T extends { type: FormElementType }> = Omit<T, 'type'>;

export class FormBuilder<T extends object> {
  protected elements: Array<FormElement<T>> = [];

  text(elem: ElemParamType<FormElementText<T>>): this {
    this.elements.push({ type: 'text', ...elem });
    return this;
  }

  custom(elem: Omit<ElemParamType<FormElementCustom<T>>, 'prop'>): this {
    this.elements.push({ type: 'custom', ...elem, prop: '' as any });
    return this;
  }

  group(buildGroup: (builder: FormElementGroupBuilder<T>) => void): this {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const builder = new FormElementGroupBuilder<T>();
    buildGroup(builder);
    const group = builder.buildGroup();
    this.elements.push(group);
    return this;
  }
}

export class FormElementGroupBuilder<T extends object> extends FormBuilder<T> {
  private label = '';
  private width?: number;
  private style?: StyleProp<ViewStyle>;

  withLabel(label: string): this {
    this.label = label;
    return this;
  }

  withWidth(width: number) {
    this.width = width;
    return this;
  }

  withStyle(style: StyleProp<ViewStyle>): this {
    this.style = style;
    return this;
  }

  buildGroup(): FormElementGroup<T> {
    return {
      type: 'element-group',
      label: this.label,
      prop: '' as any,
      width: this.width,
      style: this.style,
      elements: this.elements,
    };
  }
}
