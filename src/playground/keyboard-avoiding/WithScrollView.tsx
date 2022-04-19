/* eslint-disable @typescript-eslint/no-use-before-define */
import { wrapNavigatorScreen } from '@euler/functions';
import { useHeaderHeight } from '@react-navigation/elements';
import { range } from 'ramda';
import { KeyboardAvoidingView, ScrollView } from 'react-native';
import styled from 'styled-components/native';

const Input = styled.TextInput`
  margin: 8px 32px;
  border-width: 1px;
  border-color: #ddd;
  padding: 16px;
  border-radius: 7px;
  background-color: #fff;
`;

const KeyboardAvoidingViewWithScrollView = () => {
  const headerHeight = useHeaderHeight();
  return (
    <KeyboardAvoidingView
      behavior="padding"
      css={`
        flex: 1;
      `}
      keyboardVerticalOffset={headerHeight + 10}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {range(0, 20).map(k => (
          <Input placeholder={`Text input #${k}`} key={k} />
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export const KeyboardAvoidingViewWithScrollViewDemo = wrapNavigatorScreen(
  KeyboardAvoidingViewWithScrollView,
  {
    title: 'KeyboardAvoidingView w/ ScrollView',
  },
);
