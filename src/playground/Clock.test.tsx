import renderer from 'react-test-renderer';
import { Clock } from './Clock';

// Mock Date.now function to make it stable across tests.
Date.now = jest.fn(() => 1482363367071);

test('clock renders correctly', () => {
  const tree = renderer.create(<Clock />).toJSON();
  expect(tree).toMatchSnapshot();
});
