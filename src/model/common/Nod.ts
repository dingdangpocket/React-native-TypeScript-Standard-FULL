/**
 * @file: Nod.ts
 * @author: eric <xuxiang@zhichetech.com>
 * @copyright: (c) 2015-2017 sichuan zhichetech co., ltd.
 */

export interface Text {
  type: 'text';
  text: string;
}

export interface Element {
  type?: 'node';
  name: string;
  attrs?: { [name: string]: string };
  children?: Nod[];
}

export type Nod = Text | Element;
