import { Story } from '@storybook/react';

export function withTemplate<T>(
  Component: React.FC<T>,
  defaultValues?: Partial<T>,
) {
  const Template: Story<T> = (args: T) => <Component {...args} />;
  return function (args: Partial<T>) {
    const Result = Template.bind({});
    Result.args = {
      ...defaultValues,
      ...args,
    };
    return Result;
  };
}
