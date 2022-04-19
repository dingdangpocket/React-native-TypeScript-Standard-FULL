import { createElement, FC, memo, ReactNode } from 'react';
import { Text, View } from 'react-native';
import { FormTextInput, FormTextInputProps } from './elements/text';
import { FormData, FormElement } from './types';

interface Props<T extends FormData> {
  element: FormElement<T>;
  value: any;
  onChange: (values: Partial<T>) => void;
}

const TextContent = memo(({ text }: { text?: ReactNode }) => {
  if (!text) return null;
  if (
    typeof text === 'string' ||
    typeof text === 'number' ||
    typeof text === 'boolean'
  ) {
    return <Text>{String(text)}</Text>;
  }
  return <View>{text}</View>;
});

const FormElementLabel = memo(({ label }: { label?: ReactNode }) => {
  return <TextContent text={label} />;
});

const FormHelpText = memo(({ text }: { text?: ReactNode }) => {
  return <TextContent text={text} />;
});

export const FormElementRenderer = memo(
  <T extends FormData>({ element, value, onChange }: Props<T>) => {
    const { label, labelPosition, helpText, ...props } = element;
    const orientation = label && labelPosition === 'left' ? 'h' : 'v';

    return (
      <View
        css={`
          flex-direction: ${orientation === 'h' ? 'row' : 'column'};
          flex-wrap: nowrap;
          justify-content: ${orientation === 'h'
            ? 'space-between'
            : 'flex-start'};
          align-items: ${orientation === 'h' ? 'center' : 'flex-start'};
        `}
      >
        <FormElementLabel label={label} />
        <View>
          {(() => {
            switch (element.type) {
              case 'text': {
                return createElement(
                  FormTextInput as unknown as FC<FormTextInputProps<T>>,
                  {
                    ...props,
                    value,
                    onChange,
                  },
                );
              }
              default:
                return null;
            }
          })()}
        </View>
        <FormHelpText text={helpText} />
      </View>
    );
  },
);
