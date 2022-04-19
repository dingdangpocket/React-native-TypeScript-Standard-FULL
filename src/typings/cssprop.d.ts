/**
 * @file: cssprop.d.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */
import { CSSProp } from 'styled-components';
import { DefaultTheme } from 'styled-components/native';

// ---------------------------------------------------------------------------
// NOTE(important):
// Read the following thread for how to add typing for css prop:
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/31245
//
// Also see the definition of `CSSProp` for more information.
//
// Other references:
// https://styled-components.com/docs/api#css-prop
// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/31245
// https://stackoverflow.com/questions/60952710/styled-componentss-css-prop-with-typescript
//
// the following should also work
// import type {} from 'styled-components/cssprop';
// ---------------------------------------------------------------------------
declare module 'react' {
  interface Attributes {
    css?: CSSProp<DefaultTheme>;
  }
}
