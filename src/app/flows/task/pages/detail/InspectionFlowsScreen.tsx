/* eslint-disable @typescript-eslint/no-use-before-define */
import { useAppLoading } from '@euler/app/components/loading';
import { SuspenseContentWrapper } from '@euler/app/components/SuspenseContentWrapper';
import { MemberCell } from '@euler/app/flows/common/components/MemberCell';
import {
  isInspectionTemplateNominatedFor,
  useInspectionTemplates,
} from '@euler/app/flows/task/functions';
import { useTaskContext } from '@euler/app/flows/task/functions/TaskContext';
import { Center } from '@euler/components';
import { Img } from '@euler/components/adv-image/AdvancedImage';
import { Label } from '@euler/components/typography/Label';
import {
  PredefinedHitSlops,
  useMemberList,
  wrapNavigatorScreen,
} from '@euler/functions';
import { useGeneralBottomSheetModal } from '@euler/functions/useBottomSheetModal';
import { InspectionTemplate, VehicleInspectionFlow } from '@euler/model';
import { OrgMember } from '@euler/model/entity';
import { InspectionCategory } from '@euler/model/enum';
import { Entypo } from '@expo/vector-icons';
import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { memo, useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components';

type Props = {
  category: InspectionCategory;
};

export const InspectionFlowsScreen = wrapNavigatorScreen(
  (props: Props) => {
    return (
      <SuspenseContentWrapper ErrorBoundaryComponent={null}>
        <Content {...props} />
      </SuspenseContentWrapper>
    );
  },
  ({ route }) => ({
    title:
      route.params.category === InspectionCategory.Pre
        ? '预检任务'
        : '检测任务',
  }),
);

const Content = memo(({ category }: Props) => {
  const { detail, taskManager } = useTaskContext();
  const navigation = useNavigation();

  const templates = useInspectionTemplates();

  const templateList = useMemo(
    () =>
      templates.filter(isInspectionTemplateNominatedFor.bind(null, category)),
    [category, templates],
  );

  const [currentTemplateForNewFlow, setCurrentTemplateForNewFlow] =
    useState<InspectionTemplate>();

  const onPillPress = useCallback(
    (template: InspectionTemplate) => {
      const flow = detail.inspection.flows.find(
        x => x.template.originTemplateId === template.id,
      );
      if (flow) return;
      setCurrentTemplateForNewFlow(template);
    },
    [detail.inspection.flows],
  );

  const appLoading = useAppLoading();

  const onMemberSelected = useCallback(
    async (templateId: number, member: OrgMember) => {
      setCurrentTemplateForNewFlow(undefined);
      const template = templateList.find(x => x.id === templateId);
      if (!template) return;
      try {
        appLoading.show();
        await taskManager.inspectionManager.addInspectionFlow({
          templateId: template.id,
          assignToMemberId: member.id,
        });
        appLoading.hide();
        navigation.goBack();
      } catch (e) {
        appLoading.hide();
        alert((e as Error).message);
      }
    },
    [appLoading, navigation, taskManager, templateList],
  );

  return (
    <>
      <FlatList
        contentContainerStyle={{ padding: 15 }}
        data={templateList}
        keyExtractor={x => String(x.id)}
        renderItem={({ item }) => {
          const flow = detail.inspection.flows.find(
            x => x.template.originTemplateId === item.id,
          );
          return <Cell template={item} flow={flow} onPillPress={onPillPress} />;
        }}
      />
      <MemberSheet
        show={currentTemplateForNewFlow != null}
        templateId={currentTemplateForNewFlow?.id ?? 0}
        templateName={currentTemplateForNewFlow?.name ?? ''}
        onSelect={onMemberSelected}
        onDismiss={() => setCurrentTemplateForNewFlow(undefined)}
      />
    </>
  );
});

const Pill = memo(
  ({
    text,
    loading,
    ...props
  }: { text: string; loading?: boolean } & TouchableOpacityProps) => {
    return (
      <TouchableOpacity
        css={`
          width: 68px;
          height: 32px;
          border-radius: 16px;
          align-items: center;
          justify-content: center;
        `}
        {...props}
        hitSlop={PredefinedHitSlops.large}
      >
        {loading ? (
          <ActivityIndicator size="small" color={'#fff'} />
        ) : (
          <Label color="#fff" light size={15}>
            {text}
          </Label>
        )}
      </TouchableOpacity>
    );
  },
);

const Cell = memo(
  ({
    template,
    flow,
    loading,
    onPillPress,
  }: {
    template: InspectionTemplate;
    flow?: VehicleInspectionFlow;
    onPillPress?: (template: InspectionTemplate) => void;
    loading?: boolean;
  }) => {
    const theme = useTheme();
    const onPress = useCallback(() => {
      if (loading) return;
      onPillPress?.(template);
    }, [loading, onPillPress, template]);
    return (
      <TouchableOpacity
        css={`
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          background-color: ${theme.components.card.background};
          min-height: 80px;
          border-radius: 5px;
          padding: 24px 15px;
          margin-bottom: 15px;
        `}
        onPress={onPress}
      >
        {template.icon ? (
          <Img
            uri={template.icon}
            css={`
              width: 36px;
              height: 36px;
              border-radius: 8px;
            `}
          />
        ) : (
          <Entypo name="layers" size={40} color="#5BA0E0" />
        )}
        <View
          css={`
            flex: 1;
            margin: 0 10px;
          `}
        >
          <Label
            size={20}
            regular
            css={`
              line-height: 32px;
            `}
          >
            {template.name}
          </Label>
          <Label size={14} light>
            {template.description ?? '暂无该检测任务的说明'}
          </Label>
        </View>
        <View
          css={`
            align-items: center;
            justify-content: center;
          `}
        >
          <Pill
            onPress={onPress}
            text={flow ? '已派' : '派工'}
            loading={loading}
            css={`
              background-color: ${flow ? '#40C779' : '#207FE7'};
              margin-left: 10px;
            `}
          />
          {flow ? (
            <Label
              light
              size={12}
              color="#777"
              css={`
                margin-top: 2px;
              `}
            >
              {flow.assignedTo.name}
            </Label>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  },
);

const MemberSheet = memo(
  ({
    show,
    templateId,
    templateName,
    onSelect,
    onDismiss,
  }: {
    show?: boolean;
    templateId: number;
    templateName: string;
    onSelect?: (templateId: number, member: OrgMember) => void;
    onDismiss?: () => void;
  }) => {
    const insets = useSafeAreaInsets();
    const members = useMemberList()!;
    const { bottomSheetModalRef, ...bottomSheetProps } =
      useGeneralBottomSheetModal({
        show,
        onDismiss,
      });
    return (
      <BottomSheetModal ref={bottomSheetModalRef} {...bottomSheetProps}>
        <BottomSheetFlatList
          data={members}
          contentContainerStyle={{
            paddingLeft: 12,
            paddingRight: 12,
            paddingTop: 60,
            paddingBottom: insets.bottom + 15,
          }}
          keyExtractor={x => String(x.id)}
          renderItem={({ item, index }) => (
            <MemberCell
              member={item}
              first={index === 0}
              last={index === members.length - 1}
              onPress={member => onSelect?.(templateId, member)}
              isRoleLabelVisible
            />
          )}
        />
        <Center
          css={`
            padding: 10px;
            padding-bottom: 20px;
            background-color: #fff;
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            height: 60px;
          `}
        >
          <Label size={18}>为{templateName}分配技师</Label>
        </Center>
      </BottomSheetModal>
    );
  },
);
