import { LayoutProviderView } from '@euler/app/components/layout/LayoutProvider';
import OcrRecognizePreview from '@euler/app/flows/common/components/OcrRecognizePreview';
import { VinRecognizeResultView } from '@euler/app/flows/common/components/VinRecognizeResultView';
import { useOcrRecognize } from '@euler/app/flows/common/functions/useOcrRecognize';
import { wrapNavigatorScreen } from '@euler/functions';
import { ResourceAccessScope } from '@euler/model/enum';
import { useServiceFactory } from '@euler/services/factory';
import { VehicleServiceInfo } from '@euler/services/vehicle-info.service';
import { useNavigation } from '@react-navigation/native';
import {
  CardStyleInterpolators,
  StackNavigationOptions,
} from '@react-navigation/stack';
import { useCallback, useState } from 'react';
import { LayoutRectangle } from 'react-native';

export const VinRecognizeResultScreen = wrapNavigatorScreen(
  ({
    plateNo,
    imageUri,
    imageSize,
    cropRect,
    maskSize,
    onConfirm,
  }: {
    plateNo?: string;
    imageUri: string;
    imageSize: { width: number; height: number };
    cropRect?: LayoutRectangle;
    maskSize?: { width: number; height: number };
    onConfirm?: (
      plateNo: string,
      imageUrl: string | undefined,
      serviceInfo?: VehicleServiceInfo,
    ) => void;
  }) => {
    const previewProps = {
      imageUri,
      imageSize,
      cropRect,
      maskSize,
    };
    const { ocrService, vehicleInfoService } = useServiceFactory();
    const [lastResult, setLastResult] = useState<string>();
    const {
      recognizeState,
      startRecognize,
      extraInfoState,
      fetchExtraInfo,
      recognizedResponse,
    } = useOcrRecognize({
      ...previewProps,
      recognize: async (uri: string) => {
        console.log('recoginizing ' + uri + '...');
        return await ocrService.vinRecognize({
          uri,
        });
      },
      fetchExtraInfo: async result => {
        const res = await vehicleInfoService.listVehicleServiceInfo({
          scope: ResourceAccessScope.Org,
          plateno: plateNo,
          vin: result,
        });
        if (result !== lastResult) {
          setLastResult(result);
        }
        return res;
      },
    });

    const navigation = useNavigation();
    const onConfirmPress = useCallback(
      (vin: string, serviceInfo?: VehicleServiceInfo) => {
        navigation.goBack();
        const imageUrl =
          lastResult !== recognizedResponse?.result
            ? undefined
            : recognizedResponse?.url;
        onConfirm?.(vin, imageUrl, serviceInfo);
      },
      [
        lastResult,
        navigation,
        onConfirm,
        recognizedResponse?.result,
        recognizedResponse?.url,
      ],
    );

    return (
      <OcrRecognizePreview
        label="车牌"
        state={recognizeState}
        {...previewProps}
        onRetry={startRecognize}
      >
        {result => (
          <LayoutProviderView
            fallbackToChildren
            css={`
              flex: 1;
            `}
          >
            <VinRecognizeResultView
              result={result}
              extraInfo={extraInfoState}
              fetchExtraInfo={fetchExtraInfo}
              lastResult={lastResult}
              onConfirm={onConfirmPress}
            />
          </LayoutProviderView>
        )}
      </OcrRecognizePreview>
    );
  },
  {
    presentation: 'transparentModal',
    headerShown: false,
    cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
    detachPreviousScreen: false,
    cardOverlayEnabled: true,
    cardStyle: {
      backgroundColor: '#fff',
      flex: 1,
    },
  } as StackNavigationOptions,
);
