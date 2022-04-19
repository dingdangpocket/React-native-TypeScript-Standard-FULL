/* eslint-disable @typescript-eslint/no-use-before-define */
import { useAppNavigation } from '@euler/app/components/AppNavigationProvider';
import { useAppLoading } from '@euler/app/components/loading';
import { useCurrentUser } from '@euler/app/flows/auth';
import { PredefinedAnnotationTags } from '@euler/app/flows/media/annotation/functions/tagPresets';
import { FloatingActionButton } from '@euler/app/flows/order/components/FloatingActionButton';
import { useTaskContext } from '@euler/app/flows/task/functions/TaskContext';
import { SiteInspectionView } from '@euler/app/flows/task/pages/inspection/site-inspection/components/SiteInspectionView';
import { useSiteInspectionNavigatorContext } from '@euler/app/flows/task/pages/inspection/site-inspection/SiteInspectionNavigator';
import {
  getDefectiveLevel,
  useSystemMetrics,
  wrapNavigatorScreen,
} from '@euler/functions';
import { isSimpleNumericItemResult } from '@euler/functions/inspectionResultDataTypeHelpers';
import { InspectionSiteInfo } from '@euler/functions/useInventory';
import { useToggleAutomaticKeyboard } from '@euler/lib/keyboard';
import { VehicleInspectionSiteCheckItemOption } from '@euler/model/entity';
import { AbnormalLevel, SiteInspectionType } from '@euler/model/enum';
import { TaskMediaStaged } from '@euler/model/task-detail';
import { comparer, isNotNull, mimeTypeFromFileUri } from '@euler/utils';
import { sorted } from '@euler/utils/array';
import {
  useBehaviorSubject,
  useBehaviorSubjectUpdater,
} from '@euler/utils/hooks';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { StackNavigationOptions } from '@react-navigation/stack';
import { useCallback, useEffect, useMemo } from 'react';
import {
  CheckItemInfo,
  MediaInfo,
  OptionInfo,
} from './functions/SiteInspection';

export const SiteInspectionScreen = wrapNavigatorScreen(
  ({ site, onDone }: { site: InspectionSiteInfo; onDone?: () => void }) => {
    useToggleAutomaticKeyboard(true);

    const appNavigation = useAppNavigation();

    const { dirty$, bottomComponent$ } = useSiteInspectionNavigatorContext();
    const setAsDirty = useBehaviorSubjectUpdater(dirty$);
    const { taskManager } = useTaskContext();
    const { user } = useCurrentUser()!;
    const siteInspectionManager =
      taskManager.inspectionManager.beginSiteInspection({
        site,
        inspectionType: SiteInspectionType.Default,
        technicianId: user.memberId,
        technicianName: user.name,
      });
    const [inspection] = useBehaviorSubject(siteInspectionManager.staged$);

    const inspectedItems = useMemo(() => {
      const list = inspection.items.map<CheckItemInfo | null>(inspectedItem => {
        if (inspectedItem.type === 'customIssue') {
          return {
            key: inspectedItem._key,
            id: inspectedItem.id,
            name: inspectedItem.name,
            customIssueId: inspectedItem.id,
            options: [
              {
                defectiveLevel: getDefectiveLevel(
                  inspectedItem.abnormalLevel,
                  inspectedItem.severityLevel,
                ),
                isCustom: false,
                title: inspectedItem.name,
                maintenceAdvice: inspectedItem.maintenanceAdvice,
              },
            ],
            selectedOptionIndex: 0,
            medias: inspectedItem?.medias?.map(mediaStagedToMediaInfo),
          };
        }

        const checkItem = site.checkItems.find(
          x => x.id === inspectedItem.itemId,
        );
        if (!checkItem) return null;

        const checkOptions = sorted(checkItem.options, compareOption);
        let selectedOptionIndex = checkOptions.findIndex(
          x => x.abnormalLevel === AbnormalLevel.Fine,
        );
        if (inspectedItem) {
          // select by option label first.
          let index = checkOptions.findIndex(
            x => x.label === inspectedItem.label,
          );

          // then, fallback to match levels
          if (index === -1) {
            index = checkOptions.findIndex(
              x =>
                x.abnormalLevel === inspectedItem.abnormalLevel &&
                x.severityLevel === inspectedItem.severityLevel,
            );
          }

          // then, fallback to severity level match
          if (index === -1) {
            index = checkOptions.findIndex(
              x => x.severityLevel === inspectedItem.severityLevel,
            );
          }

          // last, fallback to abnormal level match
          if (index === -1) {
            index = checkOptions.findIndex(
              x => x.abnormalLevel === inspectedItem.abnormalLevel,
            );
          }

          if (index >= 0) {
            selectedOptionIndex = index;
          }
        }
        const itemInfo: CheckItemInfo = {
          id: inspectedItem?.id,
          key: inspectedItem._key,
          name: checkItem.name,
          itemId: checkItem.id,
          value: isSimpleNumericItemResult(inspectedItem.result)
            ? inspectedItem.result.value
            : undefined,
          valueType: checkItem.valueType ?? undefined,
          valueUnit: checkItem.valueUnit ?? undefined,
          protocolFieldId: checkItem.protocolFieldId ?? undefined,
          positionCode: checkItem.positionCode ?? undefined,
          isPicPreferred: checkItem.isPicPreferred ?? undefined,
          isCustom: inspectedItem.isCustom,
          options: checkOptions.map<OptionInfo>(option => ({
            defectiveLevel: getDefectiveLevel(
              option.abnormalLevel,
              option.severityLevel,
            ),
            isCustom: false,
            title: option.label,
            maintenceAdvice: option.maintenanceAdvice ?? undefined,
          })),
          selectedOptionIndex,
          medias: inspectedItem?.medias?.map(mediaStagedToMediaInfo),
        };
        return itemInfo;
      });

      return list.filter(isNotNull);
    }, [inspection, site.checkItems]);

    const { safeAreaInsets } = useSystemMetrics();

    const onSelectedOptionChange = useCallback(
      (item: CheckItemInfo, index: number) => {
        if (!item.itemId) return;
        const target = site.checkItems.find(x => x.id === item.itemId);
        if (!target) return;
        const options = sorted(target.options, compareOption);
        const option = options[index];
        siteInspectionManager.produceItem(item.key, draft => {
          draft.abnormalLevel = option.abnormalLevel;
          draft.severityLevel = option.severityLevel;
          if (draft.type === 'item') {
            draft.optionLabel = option.label;
            draft.optionLabelFormat = option.labelFormat ?? undefined;
          }
        });
        setAsDirty(true);
      },
      [setAsDirty, site.checkItems, siteInspectionManager],
    );

    const onTakeMedia = useCallback(
      (item: CheckItemInfo) => {
        if (!item.itemId) return;
        appNavigation.navigate('_camera', {
          onCaptured: result => {
            if (result.type === 'photo') {
              appNavigation.navigate('_imageAnnotation', {
                imageUri: result.uri,
                mask: result.mask,
                tags: PredefinedAnnotationTags.inspection,
                onDone: results => {
                  console.log(results);
                  taskManager.uploadController.enqueue({
                    localFileUri: results.imageUri,
                    contentType: 'image/jpeg',
                    type: 'image',
                    // simulateFailure: true,
                    parameters: {
                      cover: true,
                      realm: 'temp',
                    },
                    context: {
                      type: 'item-inspection',
                      siteId: site.id,
                      key: item.key,
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
                  realm: 'temp',
                },
                context: {
                  type: 'item-inspection',
                  siteId: site.id,
                  key: item.key,
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
        site.id,
        siteInspectionManager.id,
        taskManager.uploadController,
      ],
    );

    const onDeleteMedia = useCallback(
      (item: CheckItemInfo, media: MediaInfo) => {
        siteInspectionManager.removeMedia(item.key, media.key);
      },
      [siteInspectionManager],
    );

    const onRetryMediaUpload = useCallback(
      (item: CheckItemInfo, media: MediaInfo) => {
        taskManager.uploadController.enqueue({
          localFileUri: media.url,
          contentType: mimeTypeFromFileUri(media.url),
          type: media.type,
          parameters: {
            realm: 'temp',
          },
          context: {
            type: 'item-inspection',
            siteId: site.id,
            key: item.key,
            // add this media key to indicate retry instead of add new media object
            mediaKey: media.key,
            siteInspectionManagerId: siteInspectionManager.id,
          },
        });
      },
      [site.id, siteInspectionManager.id, taskManager.uploadController],
    );

    const onPreviewVideo = useCallback(
      (item: CheckItemInfo, media: MediaInfo) => {
        const stagedMedia = siteInspectionManager.findMedia(
          item.key,
          media.key,
        );
        if (
          stagedMedia &&
          stagedMedia._source.type === 'local' &&
          stagedMedia._source.state.status === 'uploaded'
        ) {
          appNavigation.navigate('_mediaPreview', {
            type: 'video',
            url: stagedMedia._source.localFileUri,
          });
        } else {
          appNavigation.navigate('_mediaPreview', {
            type: 'video',
            url: media.url,
          });
        }
      },
      [appNavigation, siteInspectionManager],
    );

    const appLoading = useAppLoading();
    const onSubmit = useCallback(async () => {
      appLoading.show();
      try {
        await siteInspectionManager.commit();
        appLoading.hide();
        setAsDirty(false);
        taskManager.inspectionManager.endSiteInspection(site.id);
        onDone?.();
      } catch (e) {
        appLoading.hide();
        alert((e as Error).message);
      }
    }, [
      appLoading,
      onDone,
      setAsDirty,
      site.id,
      siteInspectionManager,
      taskManager.inspectionManager,
    ]);

    const setBottomComponent = useBehaviorSubjectUpdater(bottomComponent$);
    const footer = useMemo(
      () => (
        <FloatingActionButton
          text="提交"
          onPress={onSubmit}
          containerStyle={{ bottom: 0 }}
          css={`
            padding-left: 60px;
            padding-right: 60px;
          `}
        />
      ),
      [onSubmit],
    );

    useEffect(() => {
      setBottomComponent(footer);
    }, [footer, setBottomComponent]);

    return (
      <>
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: safeAreaInsets.bottom + 15,
          }}
        >
          <SiteInspectionView
            items={inspectedItems}
            onSelectedOptionChange={onSelectedOptionChange}
            onTakeMedia={onTakeMedia}
            onDeleteMedia={onDeleteMedia}
            onRetryMediaUpload={onRetryMediaUpload}
            onPreviewVideo={onPreviewVideo}
          />
        </BottomSheetScrollView>
      </>
    );
  },
  ({ route }) =>
    ({
      title: route.params.site.name,
      headerShown: true,
      cardStyle: {
        backgroundColor: '#f5f5f5',
      },
    } as StackNavigationOptions),
);

export const mediaStagedToMediaInfo = (media: TaskMediaStaged): MediaInfo => {
  return {
    id: media.id,
    cid: media._source.type === 'remote' ? media._source.cid : undefined,
    key: media._key,
    type: media.type.includes('video') ? 'video' : 'image',
    url:
      media._source.type === 'remote'
        ? media._source.url
        : media._source.state.status === 'uploaded'
        ? media._source.state.result.url
        : media._source.localFileUri,
    coverUrl: media.coverUrl,
    description: media.remark ?? undefined,
    status:
      media._source.type === 'local' ? media._source.state.status : undefined,
    progress:
      media._source.type === 'local' &&
      media._source.state.status === 'uploading'
        ? media._source.state.progress
        : undefined,
    error:
      media._source.type === 'local' && media._source.state.status === 'error'
        ? media._source.state.error
        : undefined,
  };
};

const compareOption = (
  x: VehicleInspectionSiteCheckItemOption,
  y: VehicleInspectionSiteCheckItemOption,
): number => {
  if (x.abnormalLevel === y.abnormalLevel) {
    return comparer(x.severityLevel, y.severityLevel);
  }
  return comparer(x.abnormalLevel, y.abnormalLevel);
};
