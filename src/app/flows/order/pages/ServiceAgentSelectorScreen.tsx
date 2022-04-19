import { MemberCell } from '@euler/app/flows/common/components/MemberCell';
import { wrapNavigatorScreen } from '@euler/functions';
import { useServiceAgentList } from '@euler/functions/useServiceAgentList';
import { OrgMember } from '@euler/model/entity';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { FlatList, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const ServiceAgentSelectorScreen = wrapNavigatorScreen(
  ({
    selectedServiceAgentId,
    onSelect,
  }: {
    selectedServiceAgentId?: number;
    onSelect?: (member: OrgMember) => void;
  }) => {
    const insets = useSafeAreaInsets();
    const serviceAgents = useServiceAgentList()!;
    const navigation = useNavigation();
    const [selected, setSelected] = useState(selectedServiceAgentId);

    const onItemPress = useCallback(
      (member: OrgMember) => {
        setSelected(member.id);
        onSelect?.(member);
        setTimeout(() => {
          navigation.goBack();
        }, 450);
      },
      [navigation, onSelect],
    );

    return (
      <FlatList
        css={`
          flex: 1;
        `}
        contentContainerStyle={{
          paddingTop: 15,
          paddingBottom: insets.bottom + 8,
        }}
        data={serviceAgents}
        keyExtractor={x => String(x.id)}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        stickySectionHeadersEnabled={true}
        renderItem={({ item, index }) => (
          <MemberCell
            member={item}
            first={index === 0}
            last={index === serviceAgents.length - 1}
            selected={item.id === selected}
            onPress={onItemPress}
          />
        )}
      />
    );
  },
  {
    title: '选择服务顾问',
    presentation: Platform.OS === 'ios' ? 'modal' : 'card',
  },
);
