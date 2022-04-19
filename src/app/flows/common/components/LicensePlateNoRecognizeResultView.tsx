import { useContainerLayout } from '@euler/app/components/layout/LayoutProvider';
import {
  BoxConfig,
  kDefaultBoxConfig,
} from '@euler/app/components/LicensePlateNoInput';
import { LicensePlateNoKeyboard } from '@euler/app/components/LicensePlateNoKeyboard';
import { OcrPreviewBottomActions } from '@euler/app/flows/common/components/OcrPreviewBottomActions';
import { VehicleServiceInfoView } from '@euler/app/flows/common/components/VehicleServiceInfoView';
import { FontFamily } from '@euler/components/typography';
import { AsyncState } from '@euler/functions/useFetchAsyncState';
import { LicensePlateNoRecognizeInfo } from '@euler/model/ocr/LicensePlateNoRecognizeInfo';
import { VehicleServiceInfo } from '@euler/services/vehicle-info.service';
import { AnimatePresence, MotiView } from 'moti';
import { memo, useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fill } from 'react-slot-fill';

const kBoxConfig: BoxConfig = {
  ...kDefaultBoxConfig,
  backgroundColor: '#f5f5f5',
};

export const LicensePlateNoRecognizeResultView = memo(
  ({
    result,
    lastResult,
    onPlateNoChange,
    extraInfo,
    fetchExtraInfo,
    onConfirm,
  }: {
    result: LicensePlateNoRecognizeInfo;
    lastResult: string | undefined;
    extraInfo: AsyncState<VehicleServiceInfo | null>;
    fetchExtraInfo: (result: LicensePlateNoRecognizeInfo) => any;
    onPlateNoChange?: (value: string) => void;
    onConfirm?: (plateNo: string, serviceInfo?: VehicleServiceInfo) => void;
  }) => {
    const layout = useContainerLayout();
    const boxSize = (layout.width - 4 * 8 - 26) / 8;
    const insets = useSafeAreaInsets();
    const [isPlateNoKeyboardVisible, setIsPlateNoKeyboardVisible] =
      useState(false);
    const [plateNo, setPlateNo] = useState(result.number);
    if (!lastResult) {
      lastResult = result.number;
    }

    const onPlateInputIndexChange = useCallback(() => {
      if (isPlateNoKeyboardVisible) return;
      setIsPlateNoKeyboardVisible(true);
    }, [isPlateNoKeyboardVisible]);

    const onPlateKeyboardDonePress = useCallback(
      (value: string) => {
        if (value !== lastResult) {
          onPlateNoChange?.(value);
          setPlateNo(value);
          fetchExtraInfo({ ...result, number: value });
        }
        setIsPlateNoKeyboardVisible(false);
      },
      [fetchExtraInfo, lastResult, onPlateNoChange, result],
    );

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
        </View>
        <LicensePlateNoKeyboard
          value={result.number}
          doneButtonText="确认"
          defaultSelectedIndex={-1}
          onDone={onPlateKeyboardDonePress}
          onInputIndexChange={onPlateInputIndexChange}
        >
          {({ renderInput, renderKeypad }) => (
            <View
              css={`
                margin-top: 15px;
                padding: 0 15px;
              `}
            >
              {renderInput({ boxConfig: { ...kBoxConfig, size: boxSize } })}
              <Fill name="ocr-preview-footer">
                {isPlateNoKeyboardVisible && (
                  <AnimatePresence>
                    <MotiView
                      from={{ opacity: 0, translateY: 200 }}
                      animate={{ opacity: 1, translateY: 0 }}
                      exit={{ opacity: 0, translateY: 200 }}
                      transition={{ type: 'timing', duration: 200 }}
                      exitTransition={{ type: 'timing', duration: 200 }}
                      css={`
                        position: absolute;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background-color: #d5d8dd;
                        padding-top: 10px;
                        padding-bottom: ${insets.bottom}px;
                      `}
                    >
                      {renderKeypad()}
                    </MotiView>
                  </AnimatePresence>
                )}
              </Fill>
            </View>
          )}
        </LicensePlateNoKeyboard>
        <VehicleServiceInfoView state={extraInfo} onFetch={onFetchExtraInfo} />
        <Fill name="ocr-preview-footer">
          <OcrPreviewBottomActions
            visible={!isPlateNoKeyboardVisible}
            onConfirm={() => {
              onConfirm?.(
                plateNo,
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
