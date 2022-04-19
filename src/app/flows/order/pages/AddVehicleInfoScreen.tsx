/* eslint-disable @typescript-eslint/no-use-before-define */
import { MaybeText } from '@euler/components';
import { Input } from '@euler/components/form/Input';
import { ModalPanDownGestureProvider } from '@euler/components/ModalScrollView';
import { ModalWrapper, ModalWrapperRef } from '@euler/components/ModalWrapper';
import { TableView } from '@euler/components/TableView';
import { FontFamily } from '@euler/components/typography';
import { wrapNavigatorScreen } from '@euler/functions';
import { useFormController } from '@euler/lib/form/controller';
import { FC, memo, ReactNode, useCallback, useRef } from 'react';
import {
  StyleProp,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from 'styled-components';
import styled from 'styled-components/native';

type FormData = {
  brand: string;
  model: string;
};

export const AddVehicleInfoScreen = wrapNavigatorScreen(
  ({
    brand,
    onConfirm,
  }: {
    brand?: string;
    onConfirm?: (brand: string, model: string) => void;
  }) => {
    const {
      order: { placeholderColor },
      label: { color: btnTextColor, destructiveColor },
      components: {
        table: { borderColor },
      },
    } = useTheme();

    const { form, validateAll, isAllValid } = useFormController<FormData>({
      brand: { required: true, defaultValue: brand ?? '' },
      model: { required: true, defaultValue: '' },
    });

    const brandInputRef = useRef<TextInput>(null);
    const modelInputRef = useRef<TextInput>(null);

    const onBrandPress = useCallback(() => {
      brandInputRef.current?.focus();
    }, []);

    const onModelPress = useCallback(() => {
      modelInputRef.current?.focus();
    }, []);

    const modalRef = useRef<ModalWrapperRef>(null);

    const onConfirmPress = useCallback(async () => {
      const isValid = await validateAll();
      console.log('isValid: ', isValid);
      if (isValid) {
        modalRef.current?.dismiss(() => {
          onConfirm?.(form.brand.value.trim(), form.model.value.trim());
        });
      }
    }, [form.brand.value, form.model.value, onConfirm, validateAll]);

    const onCancelPress = useCallback(() => {
      modalRef.current?.dismiss();
    }, []);

    return (
      <ModalWrapper dismissible={true} height={230} ref={modalRef}>
        <ModalPanDownGestureProvider>
          <TableView>
            <Section>
              <Row onPress={onBrandPress}>
                <Cell label="车辆品牌">
                  <FormInput
                    inputRef={brandInputRef}
                    placeholderTextColor={placeholderColor}
                    value={form.brand.value}
                    placeholder="请输入车辆品牌信息"
                    errorMsg={form.brand.error}
                    onChangeText={form.brand.update}
                    onBlur={form.brand.onBlur}
                  />
                </Cell>
              </Row>
              <Row onPress={onModelPress}>
                <Cell label="车辆名称">
                  <FormInput
                    inputRef={modelInputRef}
                    placeholderTextColor={placeholderColor}
                    value={form.model.value}
                    placeholder="请输入车辆名称信息"
                    errorMsg={form.model.error}
                    onChangeText={form.model.update}
                    onBlur={form.model.onBlur}
                  />
                </Cell>
              </Row>
            </Section>
          </TableView>
          <View
            css={`
              position: absolute;
              left: 0;
              right: 0;
              bottom: 0;
              flex-direction: row;
              align-items: center;
              justify-content: space-between;
              border-top-color: ${borderColor};
              border-top-width: 1px;
            `}
          >
            <TouchableOpacity
              css={`
                border-right-color: ${borderColor};
                border-right-width: 1px;
                align-items: center;
                justify-content: center;
                flex: 1;
                height: 44px;
              `}
              onPress={onCancelPress}
            >
              <Text
                css={`
                  color: ${destructiveColor};
                  font-family: ${FontFamily.NotoSans.Regular};
                  font-size: 16px;
                  line-height: 18px;
                `}
              >
                取消
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              css={`
                align-items: center;
                justify-content: center;
                flex: 1;
                height: 44px;
              `}
              disabled={!isAllValid()}
              onPress={onConfirmPress}
            >
              <Text
                css={`
                  color: ${btnTextColor};
                  font-family: ${FontFamily.NotoSans.Regular};
                  font-size: 16px;
                  line-height: 18px;
                `}
              >
                确定
              </Text>
            </TouchableOpacity>
          </View>
        </ModalPanDownGestureProvider>
      </ModalWrapper>
    );
  },
  {
    presentation: 'transparentModal',
    cardOverlayEnabled: true,
    animationEnabled: false,
    detachPreviousScreen: false,
    cardStyle: {
      backgroundColor: 'transparent',
    },
    headerShown: false,
  },
);

const FormInput = styled(Input)`
  border-width: 0;
  background-color: #fff;
  padding: 8px 0;
  font-size: 16px;
`;

const Cell: FC<{ label: ReactNode; style?: StyleProp<ViewStyle> }> = memo(
  ({ label, children, style }) => {
    const theme = useTheme();
    return (
      <View
        css={`
          padding: 0;
          margin: 0;
        `}
        style={style}
      >
        <MaybeText
          text={label}
          css={`
            font-family: ${FontFamily.NotoSans.Regular};
            font-size: 14px;
            line-height: 16px;
            color: ${theme.order.labelColor};
            margin-bottom: 5px;
          `}
        />
        {children}
      </View>
    );
  },
);

const Section = styled(TableView.Section)`
  background-color: #fff;
  margin-top: 15px;
  border-radius: 8px;
`;

const Row = styled(TableView.Item).attrs(props => ({
  separatorStyle: {
    backgroundColor: '#f2f2f2',
  },
  ...props,
}))`
  padding: 15px;
  height: 80px;
`;
