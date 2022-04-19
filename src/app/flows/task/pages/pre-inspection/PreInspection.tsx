import { useAppLoading } from '@euler/app/components/loading';
import PreinspectionCell from '@euler/app/flows/task/components/PreinspectionCell';
import { useTaskContext } from '@euler/app/flows/task/functions/TaskContext';
import { BottomButton } from '@euler/app/flows/task/pages/pre-inspection/components/BottomButton';
import { DashbordImageCard } from '@euler/app/flows/task/pages/pre-inspection/components/DashbordImageCard';
import {
  FacadeImageCard,
  ImageItem,
} from '@euler/app/flows/task/pages/pre-inspection/components/FacadeImageCard';
import PreinspectionVehicleSitePoint, {
  FacadeInspectionItem,
} from '@euler/app/flows/task/pages/pre-inspection/components/PreinspectionVehicleSitePoint';
import { SignatureCard } from '@euler/app/flows/task/pages/pre-inspection/components/SignatureCard';
import { TroubleLampItem } from '@euler/app/flows/task/pages/pre-inspection/components/TroubleLampCell';
import { TroubleLampInspectionModal } from '@euler/app/flows/task/pages/pre-inspection/components/TroubleLampInspctionsModal';
import { useDashboardInspectionFlow } from '@euler/app/flows/task/pages/pre-inspection/functions/useDashboardInspectionFlow';
import { useFacadeInspectionFlow } from '@euler/app/flows/task/pages/pre-inspection/functions/useFacadeInspectionFlow';
import { useVehicleSiteArr } from '@euler/app/flows/task/pages/pre-inspection/functions/useVehicleSiteArr';
import { AppNavParams } from '@euler/app/Routes';
import { wrapNavigatorScreen } from '@euler/functions';
import {
  TaskDetail,
  UploadedFile,
  VehicleInspectedSiteInfo,
} from '@euler/model';
import { VehicleInspectionTaskCheckSiteItemMedia } from '@euler/model/entity';
import {
  AbnormalLevel,
  OptionValueType,
  SeverityLevel,
  SiteInspectionType,
} from '@euler/model/enum';
import { useServiceFactory } from '@euler/services/factory';
import { array2map } from '@euler/utils/array';
import { AntDesign, Entypo, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ImageBackground, ScrollView, View } from 'react-native';

const FailureIcon = () => {
  return <Entypo name="warning" size={24} color="#008AFF" />;
};
const SignatureIcon = () => {
  return <FontAwesome name="pencil-square-o" size={24} color="#008AFF" />;
};
const RightIcon = () => {
  return <AntDesign name="right" size={24} color="black" />;
};

type Props = {
  res?: string;
  taskNo?: string;
  signatureUri?: string;
  taskDetail?: TaskDetail;
};

export const PreInspectionScreen = wrapNavigatorScreen(
  (props: Props) => {
    const loading = useAppLoading();
    const { res, signatureUri } = props;
    const { detail, taskNo, fetchDetail } = useTaskContext();
    const { taskService, mediaFileService } = useServiceFactory();
    const [siteId, setSiteId] = useState<number>(0);
    const [siteName, setSiteName] = useState<string | undefined>('');
    const [siteItemId, setSiteItemId] = useState<number>(0);
    const [isVisible, setIsvisible] = useState<boolean>(false);
    const [facadeMediaDataSpliter, setFacadeMediaDataSpliter] =
      useState<boolean>(false);
    const [troubleLampMediaDataSpliter, setTroubleLampMediaDataSpliter] =
      useState<boolean>(false);
    const [otherSiteMediaDataSpliter, setOtherSiteMediaDataSpliter] =
      useState<boolean>(false);
    const { vehicleSiteArr } = useVehicleSiteArr();
    const navigation = useNavigation<StackNavigationProp<AppNavParams | any>>();

    useEffect(() => {
      console.log('DetailDebug', detail);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (signatureUri) {
        void (async () => {
          loading.show();
          const fileUri = signatureUri;
          const uploadRes = await mediaFileService.upload(fileUri);
          if (uploadRes) {
            const informationToUpdate = {
              preInspectionSignatureImgUrl: uploadRes.url,
            };
            void (async () => {
              const signatureImage = await taskService.updateTaskInformation(
                taskNo,
                informationToUpdate,
              );
              if (signatureImage) {
                fetchDetail(true);
                loading.hide();
              }
              console.log('更新签名照片结果 ', signatureImage);
            })();
          }
        })();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);
    //user Signature upload;

    const {
      dashboardSites,
      inspectionResults,
      commitInspectionResult,
      isSiteInspectionResultBeingCommitted,
    } = useDashboardInspectionFlow();
    const lampInspectionItems = useMemo<TroubleLampItem[]>(() => {
      if (!dashboardSites) return [];
      const inspectedSites =
        inspectionResults.inspectedSites?.filter(
          x => x.inspectionType === SiteInspectionType.Dashboard,
        ) ?? [];
      const inspectedSiteMap = array2map(inspectedSites, x => x.siteId);
      return dashboardSites.map<TroubleLampItem>(site => {
        const inspectedResult = inspectedSiteMap.get(site.id);
        const checked =
          inspectedResult != null &&
          inspectedResult?.abnormalLevel !== AbnormalLevel.Fine;
        return {
          siteId: site.id,
          siteCode: site.code,
          name: site.name,
          icon: site.iconUrl ?? undefined,
          checked,
          loading: isSiteInspectionResultBeingCommitted(site.id),
        };
      });
    }, [
      dashboardSites,
      inspectionResults.inspectedSites,
      isSiteInspectionResultBeingCommitted,
    ]);
    //lampSite Computed;

    const {
      facadeSites,
      facadeInspectionResults,
      updataFacadeInspectionResults,
    } = useFacadeInspectionFlow();

    useEffect(() => {
      if (facadeSites && facadeInspectionResults) {
        console.log(
          '外观部位Debug',
          facadeSites,
          '检测结果Debug',
          facadeInspectionResults,
        );
      }
    }, [facadeSites, facadeInspectionResults]);

    const facadeInspectionItems = useMemo<
      FacadeInspectionItem[] | undefined
    >(() => {
      if (!facadeSites) {
        return;
      } else {
        const facadeSitesFilter =
          facadeInspectionResults?.inspectedSites?.filter(
            x => x.inspectionType === SiteInspectionType.Facade,
          ) ?? [];
        const facadeSitesMap = array2map(facadeSitesFilter, x => x.siteId);
        const facadeSitesPositionMap = array2map(vehicleSiteArr, x => x.site);
        return facadeSites.map<FacadeInspectionItem>(site => {
          const inspectedResult = facadeSitesMap.get(site.id);
          const siteStyleOption = facadeSitesPositionMap.get(site.name);
          const position = siteStyleOption?.styles;
          let hasIssue = false;
          if (inspectedResult?.inspectedSiteItems != undefined) {
            if (inspectedResult.inspectedSiteItems[0].abnormalLevel == 50) {
              hasIssue = true;
            }
          }
          return {
            siteId: site.id,
            siteName: site.name,
            itemId: site.checkItems[0].id,
            hasIssue: hasIssue,
            styles: position,
          };
        });
      }
    }, [facadeSites, vehicleSiteArr, facadeInspectionResults]);
    //facadeSite Point Computed;

    const facadeImageItems = useMemo<ImageItem[] | undefined>(() => {
      if (!facadeInspectionResults?.inspectedSites) {
        return;
      } else {
        const facadeSiteFilter =
          facadeInspectionResults?.inspectedSites?.filter(
            x => x.inspectionType === SiteInspectionType.Facade,
          ) ?? [];
        return facadeSiteFilter.map<ImageItem>(site => {
          let mediasArray: any = [];
          let itemId = 0;
          if (site.inspectedSiteItems != undefined) {
            mediasArray = site.inspectedSiteItems[0].medias;
            itemId = site.inspectedSiteItems[0].itemId;
          }
          return {
            medias: mediasArray,
            itemId: itemId,
            currentSiteId: site.siteId,
            currentSiteName: site.name,
          };
        });
      }
    }, [facadeInspectionResults?.inspectedSites]);
    //facadeSite Image Computed;

    const AbnormalLevelDefectiveOptionHead = {
      inspectionType: SiteInspectionType.Facade,
      abnormalLevel: AbnormalLevel.Defective,
      severityLevel: SeverityLevel.Warning,
    };
    const AbnormalLevelDefectiveOption = {
      name: siteName,
      resultDataType: OptionValueType.String,
      resultDataStringValue: '异常',
      abnormalLevel: AbnormalLevel.Defective,
      severityLevel: SeverityLevel.Warning,
      isCustom: false,
    };
    const AbnormalLevelFineOptionHead = {
      inspectionType: SiteInspectionType.Facade,
      abnormalLevel: AbnormalLevel.Fine,
      severityLevel: SeverityLevel.None,
    };
    const AbnormalLevelFineOption = {
      resultDataType: OptionValueType.String,
      resultDataStringValue: '良好',
      abnormalLevel: AbnormalLevel.Fine,
      severityLevel: SeverityLevel.None,
      isCustom: false,
    };
    //Common options;

    const singleImageCaseCommit = async (uploadRes: UploadedFile) => {
      const commitRes = await taskService.commitSiteInspection(taskNo, siteId, {
        ...AbnormalLevelDefectiveOptionHead,
        items: [
          {
            itemId: siteItemId,
            ...AbnormalLevelDefectiveOption,
            medias: [{ type: 'image/jpeg', url: uploadRes.url }],
          },
        ],
      });
      if (commitRes) {
        return commitRes;
      }
    };

    const commitFinish = async (commitRes: VehicleInspectedSiteInfo) => {
      if (commitRes) {
        fetchDetail(true);
        await updataFacadeInspectionResults();
        loading.hide();
      }
    };

    const useCommonCommit = async (uploadRes: UploadedFile) => {
      if (uploadRes && facadeImageItems) {
        const facadeSitesMediaMap = array2map(
          facadeImageItems,
          x => x.currentSiteId,
        );

        if (!facadeSitesMediaMap.get(siteId)) {
          const commitRes = await singleImageCaseCommit(uploadRes);
          if (commitRes) {
            await commitFinish(commitRes);
          }
          return;
        }

        if (facadeSitesMediaMap.get(siteId)?.medias.length === 0) {
          const commitRes = await singleImageCaseCommit(uploadRes);
          if (commitRes) {
            await commitFinish(commitRes);
          }
        }

        if (facadeSitesMediaMap.get(siteId)?.medias.length !== 0) {
          const Media = facadeSitesMediaMap
            .get(siteId)
            ?.medias.map((item: VehicleInspectionTaskCheckSiteItemMedia) => {
              return { type: 'image/jpeg', url: item.url };
            });
          Media?.push({ type: 'image/jpeg', url: uploadRes.url });
          const commitRes = await taskService.commitSiteInspection(
            taskNo,
            siteId,
            {
              ...AbnormalLevelDefectiveOptionHead,
              items: [
                {
                  itemId: siteItemId,
                  ...AbnormalLevelDefectiveOption,
                  medias: Media,
                },
              ],
            },
          );
          await commitFinish(commitRes);
        }
      }
    };
    //Common commit function;

    useEffect(() => {
      if (res && facadeMediaDataSpliter) {
        void (async () => {
          loading.show();
          const fileUri = res;
          const uploadRes = await mediaFileService.upload(fileUri);
          await useCommonCommit(uploadRes);
          setFacadeMediaDataSpliter(false);
        })();
      }
      //facadeMediaDataSpliter
      if (res && troubleLampMediaDataSpliter) {
        void (async () => {
          loading.show();
          const compressImage = await manipulateAsync(res, [], {
            compress: 0.2,
            format: SaveFormat.JPEG,
          });
          const fileUri = compressImage.uri;
          const uploadRes = await mediaFileService.upload(fileUri);
          if (uploadRes) {
            const informationToUpdate = {
              dashboardImgUrl: uploadRes.url,
            };
            void (async () => {
              const dashbordImage = await taskService.updateTaskInformation(
                taskNo,
                informationToUpdate,
              );
              if (dashbordImage) {
                fetchDetail(true);
                loading.hide();
              }
              console.log('仪表盘照片上传结果 ', dashbordImage);
            })();
          }
        })();
        setTroubleLampMediaDataSpliter(false);
      }
      //troubleLampMediaDataSpliter
      if (res && otherSiteMediaDataSpliter) {
        const fileUri = res;
        void (async () => {
          loading.show();
          const uploadRes = await mediaFileService.upload(fileUri);
          await useCommonCommit(uploadRes);
          setOtherSiteMediaDataSpliter(false);
        })();
      }
      //otherSiteMediaDataSpliter
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [res]);
    //all camera import logic;

    const onTroubleLampCamera = () => {
      setTroubleLampMediaDataSpliter(true);
      navigation.push('InspectionCamera', { troubleLampCamera: true });
    };
    const onVehiclePreInspectionCamera = (
      currentSiteName: string | undefined,
      currentSiteId: number,
      currentSiteItemId: number,
    ) => {
      setSiteName(currentSiteName);
      setSiteId(currentSiteId);
      setSiteItemId(currentSiteItemId);
      setFacadeMediaDataSpliter(true);
      navigation.push('InspectionCamera', {
        vehiclePreInspectionCamera: true,
      });
    };
    const onOtherSitePreinspectionCamera = () => {
      setSiteId(206);
      setSiteItemId(683);
      setSiteName('其他部位');
      setOtherSiteMediaDataSpliter(true);
      navigation.push('InspectionCamera', {
        otherSitePreinspectionCamera: true,
      });
    };
    const deleteVehicleSiteImage = async (
      currentSiteId: number,
      currentItemId: number,
      currentSiteName: string,
      currentMediaItem: VehicleInspectionTaskCheckSiteItemMedia,
    ) => {
      if (facadeImageItems) {
        const facadeSitesMediaMap = array2map(
          facadeImageItems,
          x => x.currentSiteId,
        );
        if (facadeSitesMediaMap.get(currentSiteId)?.medias.length === 0) return;
        if (facadeSitesMediaMap.get(currentSiteId)?.medias.length === 1) {
          loading.show();
          const commitRes = await taskService.commitSiteInspection(
            taskNo,
            currentSiteId,
            {
              ...AbnormalLevelFineOptionHead,
              items: [
                {
                  itemId: currentItemId,
                  name: currentSiteName,
                  ...AbnormalLevelFineOption,
                },
              ],
            },
          );
          await commitFinish(commitRes);
        }
        if (facadeSitesMediaMap.get(currentSiteId)?.medias.length !== 1) {
          const Media = facadeSitesMediaMap
            .get(currentSiteId)
            ?.medias.filter((item: VehicleInspectionTaskCheckSiteItemMedia) => {
              return item != currentMediaItem;
            });
          const commitRes = await taskService.commitSiteInspection(
            taskNo,
            currentSiteId,
            {
              ...AbnormalLevelDefectiveOptionHead,
              items: [
                {
                  itemId: currentItemId,
                  ...AbnormalLevelDefectiveOption,
                  medias: Media,
                },
              ],
            },
          );
          await commitFinish(commitRes);
        }
      }
    };

    const onLampCellPress = useCallback(
      async (item: TroubleLampItem) => {
        await commitInspectionResult(item.siteId, !item.checked);
      },
      [commitInspectionResult],
    );

    const onSignatureCardPress = useCallback(() => {
      navigation.push('PreInspectionSignature', {});
    }, [navigation]);

    const onPreview = useCallback(() => {
      navigation.push('PreinspectionReportPreview', {});
    }, [navigation]);

    return (
      <>
        <View
          css={`
            flex: 1;
            background: white;
          `}
        >
          <ScrollView
            css={`
              flex: 1;
              margin-bottom: 90px;
            `}
          >
            <DashbordImageCard
              imageRes={detail.dashboardImgUrl}
              onPress={onTroubleLampCamera}
            />
            <PreinspectionCell
              leftIcon={FailureIcon}
              title={'故障灯'}
              onPress={() => setIsvisible(!isVisible)}
              isVisible={isVisible}
              value={RightIcon}
            />
            <ImageBackground
              source={require('@euler/assets/img/car-facade-views.png')}
              resizeMode="stretch"
              css={`
                height: 370px;
              `}
            >
              {facadeInspectionItems?.map(
                (item: FacadeInspectionItem, index: number) => {
                  return (
                    <PreinspectionVehicleSitePoint
                      key={index}
                      item={item}
                      onPress={onVehiclePreInspectionCamera}
                    />
                  );
                },
              )}
            </ImageBackground>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              css={`
                background: rgb(240, 240, 240);
                padding: 5px;
              `}
            >
              {facadeImageItems?.map((item: ImageItem) => {
                return (
                  <FacadeImageCard
                    key={item.currentSiteId}
                    onDelete={deleteVehicleSiteImage}
                    medias={item.medias}
                    itemId={item.itemId}
                    currentSiteId={item.currentSiteId}
                    currentSiteName={item.currentSiteName}
                  />
                );
              })}
            </ScrollView>
            <PreinspectionCell
              leftIcon={SignatureIcon}
              title={'客户签字'}
              onPress={() => navigation.push('PreInspectionSignature', {})}
              value={'重签'}
            />
            <SignatureCard
              imageRes={detail.preInspectionSignatureImgUrl}
              onPress={onSignatureCardPress}
            />
          </ScrollView>
          <BottomButton
            leftText={'更多部位'}
            rightText={'预览报告'}
            onLeftPress={onOtherSitePreinspectionCamera}
            onRightPress={onPreview}
          />
        </View>
        <TroubleLampInspectionModal
          isVisible={isVisible}
          items={lampInspectionItems}
          onCellPress={onLampCellPress}
        />
      </>
    );
  },
  {
    title: '接车预检',
    headerShown: true,
    titleStyle: {
      fontSize: 49,
    },
  },
);
