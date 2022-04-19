import { OcrPreviewBottomActions } from '@euler/app/flows/common/components/OcrPreviewBottomActions';
import { VehicleServiceInfoView } from '@euler/app/flows/common/components/VehicleServiceInfoView';
import {
  isValidVin,
  validateVin,
  vinTransformed,
} from '@euler/app/flows/order/functions/vinHelper';
import { Input } from '@euler/components/form/Input';
import { FontFamily } from '@euler/components/typography';
import { AsyncState } from '@euler/functions/useFetchAsyncState';
import { useFormController } from '@euler/lib/form/controller';
import { VehicleServiceInfo } from '@euler/services';
import { memo, useCallback } from 'react';
import { Text, View } from 'react-native';
import { Fill } from 'react-slot-fill';

export const VinRecognizeResultView = memo(
  ({
    result,
    onVinChange,
    extraInfo,
    fetchExtraInfo,
    lastResult,
    onConfirm,
  }: {
    result: string;
    lastResult: string | undefined;
    extraInfo: AsyncState<VehicleServiceInfo | null>;
    fetchExtraInfo: (result: string) => any;
    onVinChange?: (value: string) => void;
    onConfirm?: (plateNo: string, serviceInfo?: VehicleServiceInfo) => void;
  }) => {
    if (!lastResult) {
      lastResult = result;
    }

    const { form, validateAll } = useFormController({
      vin: {
        required: true,
        defaultValue: result,
        validators: [validateVin],
      },
    });

    const onEndEditing = useCallback(() => {
      if (form.vin.value !== result) {
        onVinChange?.(form.vin.value);
      }
    }, [form.vin.value, onVinChange, result]);

    const onVinBlur = useCallback(() => {
      form.vin.onBlur();
      const vin = form.vin.value;
      if (!isValidVin(vin)) {
        return;
      }
      if (vin !== lastResult) {
        fetchExtraInfo(vin);
      }
    }, [fetchExtraInfo, form.vin, lastResult]);

    const onFetchExtraInfo = useCallback(() => {
      fetchExtraInfo(result);
    }, [fetchExtraInfo, result]);

    return (
      <>
        <View
          css={`
            padding: 8px 15px 0;
          `}
        >
          <Text
            css={`
              font-family: ${FontFamily.NotoSans.Regular};
              font-size: 14px;
              line-height: 16px;
              color: #999;
            `}
          >
            识别结果，点击可手动修改
          </Text>
          <Input
            bottomSheet={false}
            value={form.vin.value}
            errorMsg={form.vin.error}
            placeholder="请输入车辆VIN码"
            autoCapitalize="characters"
            keyboardType="ascii-capable"
            errorBottomOffset={2}
            onChangeText={s => form.vin.update(vinTransformed(s))}
            onBlur={onVinBlur}
            onEndEditing={onEndEditing}
            containerStyle={{
              marginTop: 10,
            }}
          />
        </View>
        <VehicleServiceInfoView state={extraInfo} onFetch={onFetchExtraInfo} />
        <Fill name="ocr-preview-footer">
          <OcrPreviewBottomActions
            visible
            onConfirm={async () => {
              const isValid = await validateAll();
              if (!isValid) return;
              onConfirm?.(
                form.vin.value,
                extraInfo.status === 'success'
                  ? extraInfo.result ?? undefined
                  : undefined,
              );
            }}
          />
        </Fill>
      </>
    );
  },
);
