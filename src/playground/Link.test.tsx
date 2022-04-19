/**
 * @file: Link.test.ts
 * @copyright: (c) 2019-2021 sichuan zhichetech co., ltd.
 */

import renderer from 'react-test-renderer';
import { Link } from './Link';

it('renders correctly', () => {
  const tree = renderer
    .create(<Link page="https://facebook.com">Facebook.com</Link>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
