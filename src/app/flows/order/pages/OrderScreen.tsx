/* eslint-disable @typescript-eslint/no-use-before-define */
import { useAppLoading } from '@euler/app/components/loading';
import { CameraShadeImageSource } from '@euler/app/components/media/camera/CameraShade';
import { FloatingActionButton } from '@euler/app/flows/order/components/FloatingActionButton';
import { FloatingRemarkInput } from '@euler/app/flows/order/components/FloatingRemarkInput';
import { MileageIcon } from '@euler/app/flows/order/components/icons/MileageIcon';
import { ServiceTypeIcon } from '@euler/app/flows/order/components/icons/ServiceTypeIcon';
import { TimeIcon } from '@euler/app/flows/order/components/icons/TimeIcon';
import { UserIcon } from '@euler/app/flows/order/components/icons/UserIcon';
import { VehicleIcon } from '@euler/app/flows/order/components/icons/VehicleIcon';
import {
  isValidVin,
  validateVin,
  vinTransformed,
} from '@euler/app/flows/order/functions/vinHelper';
import { OrderNavParams } from '@euler/app/flows/order/OrderFlow';
import { AppNavParams } from '@euler/app/Routes';
import { Center, MaybeText } from '@euler/components';
import { AdvancedImage } from '@euler/components/adv-image/AdvancedImage';
import {
  DateTimePicker,
  useDateTimePicker,
} from '@euler/components/DateTimePicker';
import { Input } from '@euler/components/form/Input';
import { TableView } from '@euler/components/TableView';
import { FontFamily } from '@euler/components/typography';
import { useTask, wrapNavigatorScreen } from '@euler/functions';
import {
  getOrderTypeInfo,
  getOrderTypes,
} from '@euler/functions/orderTypeInfo';
import { PredefinedHitSlops } from '@euler/functions/predefinedHitSlops';
import { useServiceAgentList } from '@euler/functions/useServiceAgentList';
import { useFormController, ValidateResult } from '@euler/lib/form/controller';
import { useToggleAutomaticKeyboard } from '@euler/lib/keyboard';
import { ServiceOrderInfo, VehicleInfoCore } from '@euler/model';
import { VehicleInfo } from '@euler/model/entity';
import { InspectionOrderType } from '@euler/model/enum';
import { VehicleServiceInfo } from '@euler/services';
import { useServiceFactory } from '@euler/services/factory';
import { onErrorIgnore, sleep, withConfirmation } from '@euler/utils';
import { isSimulator } from '@euler/utils/device';
import { formatDate, formatDateTime } from '@euler/utils/formatters';
import { usePersistFn } from '@euler/utils/hooks';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { captureException } from '@sentry/react';
import {
  FC,
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  StyleProp,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components';
import styled from 'styled-components/native';

type Props = {
  licensePlateNo?: string;
  vin?: string;
  onSuccess?: (orderNo: string) => void;
};

type OrderForm = {
  licensePlateNo: string;
  vin: string;
  mileage: number;
  serviceType?: InspectionOrderType;
  serviceAgentInfo?: {
    serviceAgentId: number;
    name: string;
  };
  vehicleInfo?: Omit<
    VehicleInfoCore,
    'licensePlateNo' | 'vin' | 'vehicleMileage'
  >;
  remark?: string;
  estimatedFinishTime?: Date;
};

export const OrderScreen = wrapNavigatorScreen(
  ({ onSuccess, ...props }: Props) => {
    useToggleAutomaticKeyboard(true);

    const insets = useSafeAreaInsets();

    const {
      link,
      order: { labelColor, placeholderColor, iconColor },
    } = useTheme();

    const lastVehicleInfo = useRef<VehicleInfo>();
    const lastServiceInfo = useRef<VehicleServiceInfo>();
    const { orderService, vehicleInfoService } = useServiceFactory();
    const licensePlateNoImgUrl = useRef<string>();
    const vinImgUrl = useRef<string>();
    const licensePlateNoTimestamp = useRef<Date>();
    const vinTimestamp = useRef<Date>();
    const orderResult = useRef<string>();

    const { form, dirty, validateAll, isAllValid, setDirty } =
      useFormController<OrderForm>({
        licensePlateNo: {
          required: true,
          defaultValue: props.licensePlateNo ?? '',
        },
        vin: {
          required: true,
          defaultValue: props.vin ?? '',
          validators: [validateVin],
        },
        mileage: {
          required: true,
          defaultValue: 0,
          empty: x => !x,
          validators: [
            validateMileage,
            value => {
              const lastRecord = lastServiceInfo.current?.serviceRecords[0];
              if (!lastRecord || value > lastRecord.mileage) {
                return true;
              }
              return {
                error: `公里数不能低于最近一次服务公里数${lastRecord.mileage}`,
              };
            },
          ],
        },
        serviceType: { required: true, defaultValue: undefined },
        serviceAgentInfo: { required: true, defaultValue: undefined },
        vehicleInfo: { required: true, defaultValue: undefined },
        remark: { defaultValue: '' },
        estimatedFinishTime: { defaultValue: undefined },
      });

    const { showActionSheetWithOptions } = useActionSheet();
    const navigation =
      useNavigation<StackNavigationProp<AppNavParams & OrderNavParams>>();
    const serviceAgents = useServiceAgentList(null);

    useEffect(() => {
      return navigation.addListener('beforeRemove', e => {
        if (!dirty) return;
        e.preventDefault();
        withConfirmation({
          title: '确认',
          message: '返回后，您所录入的信息将会丢失，是否继续?',
          confirmButtonText: '是',
          cancelButtonText: '否',
        })
          .then(confirmed => {
            if (confirmed) {
              navigation.dispatch(e.data.action);
            }
          })
          .catch(onErrorIgnore);
      });
    }, [dirty, navigation]);

    const vinInputRef = useRef<TextInput>(null);
    const mileageInputRef = useRef<TextInput>(null);
    const remarkRef = useRef<{
      onPress: () => void;
    }>(null);

    const loadVehicleInfoByVin = usePersistFn(async (vin: string) => {
      form.vehicleInfo.setLoading(true);
      try {
        const { vinInfo } = await vehicleInfoService.getVinInfo(vin);
        if (vinInfo) {
          lastVehicleInfo.current = vinInfo;
          form.vehicleInfo.update({
            vehicleName: vinInfo.canonicalName,
            vehicleImageUrl: vinInfo.imgUrl ?? undefined,
            vehicleBrandName: vinInfo.brand!,
            vehicleBrandLogo: vinInfo.brandLogo ?? undefined,
            vehicleManufacturer: vinInfo.manufacturer ?? undefined,
            vehicleFuelType: vinInfo.fuelType ?? undefined,
            vehicleModel: vinInfo.seriesName ?? vinInfo.modelName ?? undefined,
            vehicleModelYear: vinInfo.modelYear ?? undefined,
            vehicleDisplacement: vinInfo.displacement ?? undefined,
          });
          setVehicleImage(vinInfo.imgUrl ?? undefined);
        }
        form.vehicleInfo.setLoading(false);
      } catch (e) {
        captureException(e);
        form.vehicleInfo.update(undefined);
        form.vehicleInfo.setError(
          '获取车辆信息失败, 请检查输入/识别的VIN码是否正确, 然后点击重试, 如果查询依然失败，您可以进行手动选择',
        );
      }
    });

    const onScan = useCallback(
      (type: 'vin' | 'plate') => {
        const updateOcrStats = (
          imageUrl: string | undefined,
          vehicleInfo: VehicleInfoCore | undefined,
        ) => {
          // save the image url that is used for recognizing
          if (type === 'plate') {
            licensePlateNoImgUrl.current = imageUrl;
            licensePlateNoTimestamp.current = imageUrl ? new Date() : undefined;
          } else {
            vinImgUrl.current = imageUrl;
            vinTimestamp.current = imageUrl ? new Date() : undefined;
          }
          if (vehicleInfo) {
            // if the result comes from recognizing plate/vin, but the other
            // does not match the current value, just reset the stats info.
            if (type === 'plate' && vehicleInfo.vin !== form.vin.value) {
              vinImgUrl.current = undefined;
              vinTimestamp.current = undefined;
            } else if (
              type === 'vin' &&
              vehicleInfo.licensePlateNo !== form.licensePlateNo.value
            ) {
              licensePlateNoImgUrl.current = undefined;
              licensePlateNoTimestamp.current = undefined;
            }
          }
        };

        const updateResult = (
          mode: 'plate' | 'vin',
          value: string,
          serviceInfo: VehicleServiceInfo | undefined,
        ) => {
          const vehicleInfo = serviceInfo?.vehicleInfo;
          if (vehicleInfo) {
            form.licensePlateNo.update(vehicleInfo.licensePlateNo);
            form.vin.update(vehicleInfo.vin);
            form.vehicleInfo.update(vehicleInfo);
          } else if (mode === 'plate') {
            form.licensePlateNo.update(value);
          } else {
            form.vin.update(value);
            if (lastVehicleInfo.current?.vin !== value) {
              loadVehicleInfoByVin(value).catch(onErrorIgnore);
            }
          }
          lastServiceInfo.current = serviceInfo;
          form.mileage.onBlur();
        };

        if (isSimulator()) {
          const asset = Image.resolveAssetSource(CameraShadeImageSource);
          navigation.push(
            type === 'vin' ? '_vinRecognizeResult' : '_plateRecognizeResult',
            {
              imageUri: asset.uri,
              imageSize: { width: asset.width, height: asset.height },
              onConfirm: (value, imageUrl, serviceInfo) => {
                updateOcrStats(imageUrl, serviceInfo?.vehicleInfo);
                updateResult(type, value, serviceInfo);
              },
            },
          );
        } else {
          navigation.push('_vehicleInfoScanner', {
            mode: type,
            modal: Platform.OS === 'ios',
            onConfirm: (mode, value, imageUrl, serviceInfo) => {
              updateOcrStats(imageUrl, serviceInfo?.vehicleInfo);
              updateResult(mode, value, serviceInfo);
            },
          });
        }
      },
      [
        form.vin,
        form.licensePlateNo,
        form.mileage,
        form.vehicleInfo,
        loadVehicleInfoByVin,
        navigation,
      ],
    );

    const onPlateCellPress = useCallback(() => {
      navigation.navigate('_plate', {
        licensePlateNo: form.licensePlateNo.value,
        onDone: value => {
          form.licensePlateNo.update(value);
        },
      });
    }, [form.licensePlateNo, navigation]);

    const onVinCellPress = useCallback(() => {
      vinInputRef.current?.focus();
    }, []);

    const onMileageCellPress = useCallback(() => {
      mileageInputRef.current?.focus();
    }, []);

    const onVinBlur = useCallback(() => {
      form.vin.onBlur();
      const vin = form.vin.value;
      if (!isValidVin(vin)) {
        return;
      }
      if (lastVehicleInfo.current?.vin !== vin) {
        loadVehicleInfoByVin(vin).catch(onErrorIgnore);
      }
    }, [form.vin, loadVehicleInfoByVin]);

    const onOrderTypePress = useCallback(() => {
      const orderTypes = getOrderTypes();
      showActionSheetWithOptions(
        {
          title: '选择本次服务类型',
          options: [...orderTypes.map(x => x.name), '关闭'],
          destructiveButtonIndex: orderTypes.length,
        },
        async buttonIndex => {
          if (buttonIndex == null || buttonIndex === orderTypes.length) {
            return;
          }
          form.serviceType.update(orderTypes[buttonIndex].type);
        },
      );
    }, [form.serviceType, showActionSheetWithOptions]);

    const onServiceAgentPress = useCallback(() => {
      if (null == serviceAgents) return;
      if (serviceAgents.length > 4) {
        navigation.push('_serviceAgentSelector', {
          selectedServiceAgentId: form.serviceAgentInfo.value?.serviceAgentId,
          onSelect: sa => {
            form.serviceAgentInfo.update({
              serviceAgentId: sa.id,
              name: sa.name,
            });
          },
        });
        return;
      }
      showActionSheetWithOptions(
        {
          title: '选择服务顾问',
          message: !serviceAgents.length
            ? '您所在的门店尚未添加拥有服务顾问角色的用户'
            : undefined,
          options: [...serviceAgents.map(x => x.name), '关闭'],
          destructiveButtonIndex: serviceAgents.length,
        },
        async buttonIndex => {
          if (buttonIndex == null || buttonIndex === serviceAgents.length) {
            return;
          }
          const sa = serviceAgents[buttonIndex];
          form.serviceAgentInfo.update({
            serviceAgentId: sa.id,
            name: sa.name,
          });
        },
      );
    }, [
      form.serviceAgentInfo,
      navigation,
      serviceAgents,
      showActionSheetWithOptions,
    ]);

    const [isDateTimePickerVisible, showDateTimePicker, hideDateTimePicker] =
      useDateTimePicker();

    const [vehicleImage, setVehicleImage] = useState<string>();
    const onVehicleInfoPress = useCallback(() => {
      if (form.vehicleInfo.loading) return;
      if (form.vehicleInfo.error) {
        form.vehicleInfo.setError(undefined);
      }
      navigation.navigate('_vehicleBrandSelector', {
        selected: {
          brand: form.vehicleInfo.value?.vehicleBrandName,
          model: form.vehicleInfo.value?.vehicleModel,
        },
        onSelect: (brand, model) => {
          form.vehicleInfo.update({
            vehicleName: `${brand} ${model.name}`,
            vehicleBrandName: brand,
            vehicleModel: model.name,
            vehicleManufacturer: model.manufacturer,
          });
          setVehicleImage(model.img ?? undefined);
        },
      });
    }, [form.vehicleInfo, navigation]);

    const onRetryLoadVehicleInfoByVin = useCallback(() => {
      loadVehicleInfoByVin(form.vin.value).catch(onErrorIgnore);
    }, [form.vin.value, loadVehicleInfoByVin]);

    useEffect(() => {
      if (form.vehicleInfo.error) {
        form.vehicleInfo.setError(undefined);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.vin.value]);

    const appLoading = useAppLoading();

    const test = false;
    const onSubmit = useTask(async () => {
      const isValid = await validateAll();
      if (!isValid) return;
      try {
        const orderInfo: ServiceOrderInfo = {
          orderType: form.serviceType.value,
          licensePlateNo: form.licensePlateNo.value,
          licensePlateNoImgUrl: licensePlateNoImgUrl.current,
          licensePlateNoTimestamp: licensePlateNoTimestamp.current
            ? formatDateTime(licensePlateNoTimestamp.current)
            : undefined,
          vin: form.vin.value,
          vinImgUrl: vinImgUrl.current,
          vinTimestamp: vinTimestamp.current
            ? formatDateTime(vinTimestamp.current)
            : undefined,
          vehicleName: form.vehicleInfo.value!.vehicleName,
          vehicleBrandName: form.vehicleInfo.value!.vehicleBrandName,
          vehicleModel: form.vehicleInfo.value!.vehicleModel ?? '未知',
          vehicleModelYear: form.vehicleInfo.value!.vehicleModelYear,
          vehicleManufacturer: form.vehicleInfo.value!.vehicleManufacturer,
          vehicleDisplacement: form.vehicleInfo.value!.vehicleDisplacement,
          vehicleFuelType: form.vehicleInfo.value!.vehicleFuelType,
          vehicleInfo: lastVehicleInfo.current,
          mileageInKm: form.mileage.value,
          serviceAgentId: form.serviceAgentInfo.value!.serviceAgentId,
          serviceAgentName: form.serviceAgentInfo.value!.name,
          startTask: true,
          remark: form.remark.value,
        };
        console.log(JSON.stringify(orderInfo, null, 2));
        appLoading.show();
        if (test) {
          await sleep(3000);
          orderResult.current = 'test';
          setDirty(false);
        } else {
          const orderNo = await orderService.plateOrder(orderInfo);
          console.log('place order success: ', orderNo);
          orderResult.current = orderNo;
          setDirty(false);
        }
      } catch (e) {
        alert((e as Error).message);
      } finally {
        appLoading.hide();
      }
    });

    useEffect(() => {
      if (!dirty && orderResult.current) {
        navigation.goBack();
        onSuccess?.(orderResult.current);
      }
    }, [dirty, navigation, onSuccess]);

    return (
      <>
        <ScrollView
          css={`
            flex: 1;
          `}
        >
          <TableView
            css={`
              margin-bottom: ${insets.bottom + 98}px;
            `}
          >
            <Section>
              <Row
                icon={
                  <Icon>
                    <TextIcon text="车牌" color={iconColor} />
                  </Icon>
                }
                detail={
                  <ScanButton
                    color={labelColor}
                    onPress={() => onScan('plate')}
                  />
                }
                onPress={onPlateCellPress}
              >
                <Cell label="车牌号">
                  <FormInput
                    placeholderTextColor={placeholderColor}
                    value={form.licensePlateNo.value}
                    placeholder="请输入或扫描识别车牌"
                    errorMsg={form.licensePlateNo.error}
                    loading={form.licensePlateNo.loading}
                    editable={false}
                    pointerEvents="none"
                    tag="plate"
                  />
                </Cell>
              </Row>

              <Row
                icon={
                  <Icon>
                    <TextIcon text="VIN" color={iconColor} />
                  </Icon>
                }
                detail={
                  <ScanButton
                    color={labelColor}
                    onPress={() => onScan('vin')}
                  />
                }
                onPress={onVinCellPress}
              >
                <Cell label="VIN码">
                  <FormInput
                    inputRef={vinInputRef}
                    placeholderTextColor={placeholderColor}
                    value={form.vin.value}
                    placeholder="请输入或扫描识别车辆VIN码"
                    errorMsg={form.vin.error}
                    loading={form.vin.loading}
                    autoCapitalize="characters"
                    keyboardType="ascii-capable"
                    onChangeText={s => form.vin.update(vinTransformed(s))}
                    onBlur={onVinBlur}
                    tag="vin"
                  />
                </Cell>
              </Row>
            </Section>
            <Section>
              <Row
                icon={
                  <Icon>
                    <VehicleIcon color={iconColor} />
                  </Icon>
                }
                detailIcon="disclosure"
                onPress={onVehicleInfoPress}
              >
                <View
                  css={`
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                  `}
                >
                  <Cell
                    label="品牌/车型"
                    css={`
                      flex: 1;
                    `}
                  >
                    <FormInput
                      placeholderTextColor={placeholderColor}
                      value={form.vehicleInfo.value?.vehicleName ?? ''}
                      placeholder={
                        form.vehicleInfo.loading
                          ? '正在查询车型VIN信息, 请稍候...'
                          : '请输入或选择品牌车型'
                      }
                      errorMsg={form.vehicleInfo.error}
                      editable={false}
                      pointerEvents="none"
                      alwaysShowError
                    />
                  </Cell>
                  {form.vehicleInfo.loading && <ActivityIndicator />}
                  {form.vehicleInfo.error ? (
                    <TouchableOpacity
                      css={`
                        border-width: 1px;
                        border-color: ${link};
                        padding: 0 4px;
                        border-radius: 2px;
                      `}
                      hitSlop={PredefinedHitSlops.large}
                      onPress={onRetryLoadVehicleInfoByVin}
                    >
                      <Text
                        css={`
                          font-family: ${FontFamily.NotoSans.Light};
                          font-size: 12px;
                          line-height: 16px;
                          color: ${link};
                        `}
                      >
                        重试
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                  {vehicleImage &&
                  !form.vehicleInfo.loading &&
                  !form.vehicleInfo.error ? (
                    <AdvancedImage
                      uri={vehicleImage}
                      css={`
                        width: 67.5px;
                        height: 45px;
                      `}
                    />
                  ) : null}
                </View>
              </Row>

              <Row
                icon={
                  <Icon>
                    <MileageIcon color={iconColor} />
                  </Icon>
                }
                onPress={onMileageCellPress}
              >
                <Cell label="行驶里程">
                  <View
                    css={`
                      flex-direction: row;
                      justify-content: space-between;
                      align-items: center;
                    `}
                  >
                    <FormInput
                      inputRef={mileageInputRef}
                      placeholderTextColor={placeholderColor}
                      value={
                        form.mileage.value > 0 ? String(form.mileage.value) : ''
                      }
                      placeholder="请输入车辆里程"
                      keyboardType="number-pad"
                      errorMsg={form.mileage.error}
                      onChangeText={x => form.mileage.update(Number(x))}
                      onBlur={form.mileage.onBlur}
                      containerStyle={{ flex: 1 }}
                      alwaysShowError={form.mileage.value > 0}
                    />
                    <Text
                      css={`
                        font-family: ${FontFamily.NotoSans.Light};
                        font-size: 14px;
                        color: ${labelColor};
                      `}
                    >
                      公里
                    </Text>
                  </View>
                </Cell>
              </Row>

              <Row
                detailIcon={'disclosure'}
                icon={
                  <Icon>
                    <ServiceTypeIcon color={iconColor} />
                  </Icon>
                }
                onPress={onOrderTypePress}
              >
                <Cell label="业务类型">
                  <FormInput
                    placeholderTextColor={placeholderColor}
                    value={
                      form.serviceType.value
                        ? getOrderTypeInfo(form.serviceType.value).name
                        : ''
                    }
                    placeholder="请选择业务类型"
                    errorMsg={form.serviceType.error}
                    editable={false}
                    pointerEvents="none"
                  />
                </Cell>
              </Row>

              <Row
                detailIcon={'disclosure'}
                icon={
                  <Icon>
                    <UserIcon color={iconColor} />
                  </Icon>
                }
                onPress={onServiceAgentPress}
              >
                <Cell label="服务顾问">
                  <FormInput
                    placeholderTextColor={placeholderColor}
                    value={form.serviceAgentInfo.value?.name ?? ''}
                    placeholder="请选择服务顾问"
                    errorMsg={form.serviceAgentInfo.error}
                    editable={false}
                    loading={serviceAgents == null}
                    pointerEvents="none"
                  />
                </Cell>
              </Row>

              <Row
                detailIcon={'disclosure'}
                icon={
                  <Icon>
                    <TimeIcon color={iconColor} />
                  </Icon>
                }
                onPress={() => {
                  showDateTimePicker();
                }}
              >
                <Cell label="预计交车时间">
                  <FormInput
                    placeholderTextColor={placeholderColor}
                    value={
                      form.estimatedFinishTime.value
                        ? formatDate(form.estimatedFinishTime.value)
                        : ''
                    }
                    placeholder="可选"
                    errorMsg={form.estimatedFinishTime.error}
                    editable={false}
                    pointerEvents="none"
                  />
                </Cell>
              </Row>

              <Row
                detailIcon={'disclosure'}
                icon={
                  <Icon>
                    <SimpleLineIcons name="note" size={20} color={iconColor} />
                  </Icon>
                }
                onPress={() => remarkRef.current?.onPress()}
              >
                <Cell label="服务备注">
                  <FormInput
                    placeholderTextColor={placeholderColor}
                    value={form.remark.value ?? ''}
                    placeholder="可选"
                    errorMsg={form.remark.error}
                    editable={false}
                    pointerEvents="none"
                  />
                </Cell>
              </Row>
            </Section>
          </TableView>
        </ScrollView>
        <FloatingRemarkInput
          ref={remarkRef}
          value={form.remark.value}
          onDone={form.remark.update}
        />
        <DateTimePicker
          isVisible={isDateTimePickerVisible}
          onConfirm={value => {
            form.estimatedFinishTime.update(value);
            hideDateTimePicker();
          }}
          onCancel={hideDateTimePicker}
          confirmTextIOS="确认"
          cancelTextIOS="关闭"
        />
        <FloatingActionButton
          text={onSubmit.loading ? '请稍候... ' : '完成建单'}
          disabled={!isAllValid() || onSubmit.loading}
          onPress={onSubmit.request}
        />
      </>
    );
  },
  {
    title: '车辆建单',
  },
);

const Row = styled(TableView.Item).attrs(props => ({
  separatorStyle: {
    marginLeft: 20,
    backgroundColor: '#f2f2f2',
  },
  ...props,
}))`
  padding: 15px;
`;

const Section = styled(TableView.Section)`
  background-color: #fff;
  margin-top: 15px;
  margin-left: 15px;
  margin-right: 15px;
  border-radius: 8px;
`;

const FormInput = styled(Input)`
  border-width: 0;
  background-color: #fff;
  padding: 8px 0;
  font-size: 16px;
`;

const Icon: FC<{
  style?: StyleProp<ViewStyle>;
}> = memo(({ style, children }) => {
  return (
    <Center
      css={`
        width: 40px;
        height: 40px;
        background-color: #fff;
        border-color: #f5f5f5;
        border-width: 1px;
        border-radius: 20px;
        margin-left: -10px;
      `}
      style={style}
    >
      {children}
    </Center>
  );
});

const TextIcon: FC<{
  text: string;
  color: string;
  style?: StyleProp<ViewStyle>;
}> = memo(({ text, color, style }) => (
  <Center
    css={`
      border-radius: 3px;
      background-color: ${color};
      padding: 0 4px;
    `}
    style={style}
  >
    <Text
      css={`
        font-family: ${FontFamily.NotoSans.Light};
        font-size: 10px;
        line-height: 14px;
        color: #fff;
        text-align: center;
      `}
    >
      {text}
    </Text>
  </Center>
));

const Cell: FC<{ label: ReactNode; style?: StyleProp<ViewStyle> }> = memo(
  ({ label, children, style }) => {
    const theme = useTheme();
    return (
      <View
        css={`
          padding: 0;
          margin: 0 10px;
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

const ScanButton = memo(
  ({ color, ...props }: TouchableOpacityProps & { color: string }) => {
    return (
      <TouchableOpacity
        hitSlop={{ left: 10, top: 10, right: 10, bottom: 10 }}
        {...props}
      >
        <Ionicons name="scan" size={24} color={color} />
      </TouchableOpacity>
    );
  },
);

function validateMileage(value: number): ValidateResult {
  if (value >= 100) {
    return true;
  }
  if (value <= 0) {
    return { error: '里程公里数必须大于0' };
  }

  return { error: '里程数至少需要100公里' };
}
