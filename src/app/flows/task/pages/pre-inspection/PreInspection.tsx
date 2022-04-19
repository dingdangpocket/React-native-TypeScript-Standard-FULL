import { useAppNavigation } from '@euler/app/components/AppNavigationProvider';
import { PredefinedAnnotationTags } from '@euler/app/flows/media/annotation/functions/tagPresets';
import PreinspectionCell from '@euler/app/flows/task/components/PreinspectionCell';
import { useTaskContext } from '@euler/app/flows/task/functions/TaskContext';
import { mediaStagedToMediaInfo } from '@euler/app/flows/task/pages/inspection/site-inspection/SiteInspectionScreen';
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
import { TaskNavParams } from '@euler/app/flows/task/TaskFlow';
import { AppNavParams, ReportNavParams } from '@euler/app/Routes';
import { wrapNavigatorScreen } from '@euler/functions';
import {
  useInventory,
  useInventoryLookup,
} from '@euler/functions/useInventory';
import { AbnormalLevel } from '@euler/model/enum';
import { isNotNull, mimeTypeFromFileUri } from '@euler/utils';
import { array2map } from '@euler/utils/array';
import { useBehaviorSubject } from '@euler/utils/hooks';
import { AntDesign, Entypo, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useMemo, useState } from 'react';
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

export const PreInspectionScreen = wrapNavigatorScreen(
  () => {
    // const loading = useAppLoading();
    const appNavigation = useAppNavigation();
    const { detail, taskManager } = useTaskContext();

    const [inventory] = useInventory();
    const { getSiteById } = useInventoryLookup(inventory);

    // const [siteId, setSiteId] = useState<number>(0);
    // const [siteName, setSiteName] = useState<string | undefined>('');
    // const [siteItemId, setSiteItemId] = useState<number>(0);

    const [isVisible, setIsVisible] = useState<boolean>(false);

    const { vehicleSiteArr } = useVehicleSiteArr();
    const navigation =
      useNavigation<
        StackNavigationProp<AppNavParams & TaskNavParams & ReportNavParams>
      >();

    const [siteInspections] = useBehaviorSubject(
      taskManager.preInspectionManager.siteInspections$,
    );

    const onSignatureTaken = useCallback(
      (signatureUri: string) => {
        navigation.goBack();
        taskManager.uploadController.enqueue({
          localFileUri: signatureUri,
          contentType: mimeTypeFromFileUri(signatureUri),
          type: 'image',
          listener: async event => {
            if (event.type === 'finished') {
              try {
                await taskManager.updateBasicInfo({
                  preInspectionSignatureImgUrl: event.result.url,
                });
              } catch (e) {
                alert((e as Error).message);
              }
            }
          },
        });
      },
      [taskManager, navigation],
    );

    const {
      dashboardSites,
      commitInspectionResult,
      isSiteInspectionResultBeingCommitted,
    } = useDashboardInspectionFlow();

    const lampInspectionItems = useMemo<TroubleLampItem[]>(() => {
      if (!dashboardSites) return [];
      return dashboardSites.map<TroubleLampItem>(site => {
        const inspectedResult = siteInspections.get(site.id);
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
    }, [dashboardSites, isSiteInspectionResultBeingCommitted, siteInspections]);
    //lampSite Computed;

    const { facadeSites } = useFacadeInspectionFlow();

    const facadeInspectionItems = useMemo<
      FacadeInspectionItem[] | undefined
    >(() => {
      if (!facadeSites) {
        return;
      } else {
        const facadeSitesPositionMap = array2map(vehicleSiteArr, x => x.site);

        return facadeSites.map<FacadeInspectionItem>(site => {
          const inspectedResult = siteInspections.get(site.id);
          const siteStyleOption = facadeSitesPositionMap.get(site.name);
          const position = siteStyleOption?.styles;
          const inspectedItem = inspectedResult?.items?.[0];
          return {
            siteId: site.id,
            siteName: site.name,
            itemId: site.checkItems[0].id,
            hasIssue:
              inspectedItem != null &&
              inspectedItem.abnormalLevel !== AbnormalLevel.Fine,
            styles: position,
          };
        });
      }
    }, [facadeSites, siteInspections, vehicleSiteArr]);
    //facadeSite Point Computed;

    const facadeImageItems = useMemo<ImageItem[] | undefined>(() => {
      const inspectedSites = [...siteInspections.values()];
      return inspectedSites
        .map<ImageItem | null>(inspectedSite => {
          const inspectedItem = inspectedSite.items[0];
          const site = getSiteById(inspectedSite.siteId);
          const checkItem = site?.checkItems[0];
          if (!site || !checkItem) return null;

          return {
            medias: inspectedItem.medias.map(mediaStagedToMediaInfo),
            itemId: checkItem.id,
            currentSiteId: inspectedSite.siteId,
            currentSiteName: site.name,
          };
        })
        .filter(isNotNull);
    }, [getSiteById, siteInspections]);
    //facadeSite Image Computed;

    // const AbnormalLevelDefectiveOptionHead = {
    //   inspectionType: SiteInspectionType.Facade,
    //   abnormalLevel: AbnormalLevel.Defective,
    //   severityLevel: SeverityLevel.Warning,
    // };
    // const AbnormalLevelDefectiveOption = {
    //   name: siteName,
    //   resultDataType: OptionValueType.String,
    //   resultDataStringValue: '异常',
    //   abnormalLevel: AbnormalLevel.Defective,
    //   severityLevel: SeverityLevel.Warning,
    //   isCustom: false,
    // };
    // const AbnormalLevelFineOptionHead = {
    //   inspectionType: SiteInspectionType.Facade,
    //   abnormalLevel: AbnormalLevel.Fine,
    //   severityLevel: SeverityLevel.None,
    // };
    // const AbnormalLevelFineOption = {
    //   resultDataType: OptionValueType.String,
    //   resultDataStringValue: '良好',
    //   abnormalLevel: AbnormalLevel.Fine,
    //   severityLevel: SeverityLevel.None,
    //   isCustom: false,
    // };
    //Common options;

    // const singleImageCaseCommit = async (uploadRes: UploadedFile) => {
    //   const commitRes = await taskService.commitSiteInspection(taskNo, siteId, {
    //     ...AbnormalLevelDefectiveOptionHead,
    //     items: [
    //       {
    //         itemId: siteItemId,
    //         ...AbnormalLevelDefectiveOption,
    //         medias: [{ type: 'image/jpeg', url: uploadRes.url }],
    //       },
    //     ],
    //   });
    //   if (commitRes) {
    //     return commitRes;
    //   }
    // };

    // const commitFinish = async (commitRes: VehicleInspectedSiteInfo) => {
    //   if (commitRes) {
    //     fetchDetail(true);
    //     await updataFacadeInspectionResults();
    //     loading.hide();
    //   }
    // };

    // const useCommonCommit = async (uploadRes: UploadedFile) => {
    //   if (uploadRes && facadeImageItems) {
    //     const facadeSitesMediaMap = array2map(
    //       facadeImageItems,
    //       x => x.currentSiteId,
    //     );

    //     if (!facadeSitesMediaMap.get(siteId)) {
    //       const commitRes = await singleImageCaseCommit(uploadRes);
    //       if (commitRes) {
    //         await commitFinish(commitRes);
    //       }
    //       return;
    //     }

    //     if (facadeSitesMediaMap.get(siteId)?.medias.length === 0) {
    //       const commitRes = await singleImageCaseCommit(uploadRes);
    //       if (commitRes) {
    //         await commitFinish(commitRes);
    //       }
    //     }

    //     if (facadeSitesMediaMap.get(siteId)?.medias.length !== 0) {
    //       const Media = facadeSitesMediaMap
    //         .get(siteId)
    //         ?.medias.map((item: VehicleInspectionTaskCheckSiteItemMedia) => {
    //           return { type: 'image/jpeg', url: item.url };
    //         });
    //       Media?.push({ type: 'image/jpeg', url: uploadRes.url });
    //       const commitRes = await taskService.commitSiteInspection(
    //         taskNo,
    //         siteId,
    //         {
    //           ...AbnormalLevelDefectiveOptionHead,
    //           items: [
    //             {
    //               itemId: siteItemId,
    //               ...AbnormalLevelDefectiveOption,
    //               medias: Media,
    //             },
    //           ],
    //         },
    //       );
    //       await commitFinish(commitRes);
    //     }
    //   }
    // };
    //Common commit function;

    /**
     * const compressImage = await manipulateAsync(res, [], {
            compress: 0.2,
            format: SaveFormat.JPEG,
          });
     */

    const onTakeDashboardPhoto = useCallback(() => {
      appNavigation.navigate('_camera', {
        photoOnly: true,
        onCaptured: result => {
          appNavigation.goBack();
          if (result.type !== 'photo') return;
          taskManager.uploadController.enqueue({
            type: 'image',
            contentType: 'image/jpeg',
            localFileUri: result.uri,
            listener: async event => {
              if (event.type === 'finished') {
                try {
                  await taskManager.updateBasicInfo({
                    dashboardImgUrl: event.result.url,
                  });
                } catch (e) {
                  alert((e as Error).message);
                }
              }
            },
          });
        },
      });
    }, [appNavigation, taskManager]);

    const onVehiclePreInspectionCamera = useCallback(
      (currentSiteId: number) => {
        const siteInspectionManager =
          taskManager.preInspectionManager.getSiteInspectionManager(
            currentSiteId,
          );
        if (!siteInspectionManager) return;

        const inspectedSite = siteInspections.get(currentSiteId);
        if (!inspectedSite || !inspectedSite.items.length) return;

        appNavigation.navigate('_camera', {
          onCaptured: result => {
            if (result.type === 'photo') {
              appNavigation.navigate('_imageAnnotation', {
                imageUri: result.uri,
                mask: result.mask,
                tags: PredefinedAnnotationTags.preInspection,
                onDone: results => {
                  taskManager.uploadController.enqueue({
                    localFileUri: results.imageUri,
                    contentType: 'image/jpeg',
                    type: 'image',
                    // simulateFailure: true,
                    parameters: {
                      cover: true,
                    },
                    context: {
                      type: 'item-inspection',
                      siteId: currentSiteId,
                      key: inspectedSite.items[0]._key,
                      siteInspectionManagerId: siteInspectionManager.id,
                      annotationMetadata: results.annotationMetadata,
                    },
                  });
                  appNavigation.pop(2);
                },
              });
            } else {
              taskManager.uploadController.enqueue({
                localFileUri: result.uri,
                contentType: mimeTypeFromFileUri(result.uri),
                type: 'video',
                parameters: {
                  cover: true,
                },
                context: {
                  type: 'item-inspection',
                  siteId: currentSiteId,
                  key: inspectedSite.items[0]._key,
                  siteInspectionManagerId: siteInspectionManager.id,
                },
              });
              appNavigation.pop();
            }
          },
        });
      },
      [
        appNavigation,
        siteInspections,
        taskManager.preInspectionManager,
        taskManager.uploadController,
      ],
    );

    const onOtherSitePreinspectionCamera = useCallback(() => {}, []);

    // const deleteVehicleSiteImage = async (
    //   currentSiteId: number,
    //   currentItemId: number,
    //   currentMediaItem: MediaInfo,
    // ) => {
    //   if (facadeImageItems) {
    //     const facadeSitesMediaMap = array2map(
    //       facadeImageItems,
    //       x => x.currentSiteId,
    //     );
    //     if (facadeSitesMediaMap.get(currentSiteId)?.medias.length === 0) return;
    //     if (facadeSitesMediaMap.get(currentSiteId)?.medias.length === 1) {
    //       loading.show();

    //       await commitFinish(commitRes);
    //     }
    //     if (facadeSitesMediaMap.get(currentSiteId)?.medias.length !== 1) {
    //       const Media = facadeSitesMediaMap
    //         .get(currentSiteId)
    //         ?.medias.filter((item: VehicleInspectionTaskCheckSiteItemMedia) => {
    //           return item != currentMediaItem;
    //         });
    //       const commitRes = await taskService.commitSiteInspection(
    //         taskNo,
    //         currentSiteId,
    //         {
    //           ...AbnormalLevelDefectiveOptionHead,
    //           items: [
    //             {
    //               itemId: currentItemId,
    //               ...AbnormalLevelDefectiveOption,
    //               medias: Media,
    //             },
    //           ],
    //         },
    //       );
    //       await commitFinish(commitRes);
    //     }
    //   }
    // };

    const onLampCellPress = useCallback(
      async (item: TroubleLampItem) => {
        await commitInspectionResult(item.siteId, !item.checked);
      },
      [commitInspectionResult],
    );

    const onSignatureCardPress = useCallback(() => {
      navigation.push('PreInspectionSignature', {
        onDone: onSignatureTaken,
      });
    }, [navigation, onSignatureTaken]);

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
              imageRes={detail.preInspection.dashboardImgUrl}
              onPress={onTakeDashboardPhoto}
            />
            <PreinspectionCell
              leftIcon={FailureIcon}
              title={'故障灯'}
              onPress={() => setIsVisible(!isVisible)}
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
                    //onDelete={deleteVehicleSiteImage}
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
              imageRes={detail.preInspection.signatureImgUrl}
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
