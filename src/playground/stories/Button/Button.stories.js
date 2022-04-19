import {
  FullHeightCenteredDecorator,
  withTemplate,
} from '../../../utils/storybook';
import { Button } from './Button';

export default {
  title: 'Playground/Button',
  component: Button,
  decorators: [FullHeightCenteredDecorator],
};

const template = withTemplate(Button, {});

export const Default = template({});
