/* eslint-disable @typescript-eslint/no-use-before-define */
import { ListItemCheckmark } from '@euler/app/components';
import { Separator } from '@euler/app/flows/order/components/Separator';
import { Avatar } from '@euler/components';
import { FontFamily } from '@euler/components/typography';
import { getOrgUserRoleTypeLabels } from '@euler/functions';
import { OrgMember } from '@euler/model/entity';
import { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'styled-components';
import styled from 'styled-components/native';

export const MemberCell = memo(
  ({
    member,
    selected,
    first,
    last,
    isRoleLabelVisible,
    onPress,
  }: {
    member: OrgMember;
    selected?: boolean;
    first?: boolean;
    last?: boolean;
    isRoleLabelVisible?: boolean;
    onPress?: (member: OrgMember) => void;
  }) => {
    const theme = useTheme();
    const roleLabels = isRoleLabelVisible
      ? getOrgUserRoleTypeLabels(member.role)
      : [];
    return (
      <TouchableOpacity
        onPress={() => onPress?.(member)}
        css={`
          flex-direction: row;
          align-items: center;
          flex-wrap: nowrap;
          justify-content: space-between;
          background-color: ${theme.components.card.background};
          padding: 15px 15px;
        `}
      >
        {first && (
          <Separator
            css={`
              top: 0;
            `}
          />
        )}
        <Separator
          css={`
            bottom: 0;
            left: ${last ? 0 : 15}px;
          `}
        />
        <Avatar
          name={member.name}
          css={`
            width: 32px;
            height: 32px;
            border-radius: 16px;
            margin-right: 10px;
          `}
          textStyle={{ fontSize: 18 }}
        />
        <Text
          css={`
            flex: 1;
            font-family: ${FontFamily.NotoSans.Light};
            font-size: 19px;
          `}
        >
          {member.name}
        </Text>
        <View
          css={`
            flex-direction: row;
            align-items: center;
            justify-content: flex-end;
          `}
        >
          {roleLabels.map((label, i) => (
            <RoleLabel
              key={i}
              css={`
                margin-left: 3px;
              `}
            >
              {label}
            </RoleLabel>
          ))}
          <ListItemCheckmark checked={selected} />
        </View>
      </TouchableOpacity>
    );
  },
);

const RoleLabel = styled.Text`
  font-family: ${FontFamily.NotoSans.Light};
  font-size: 12px;
  color: #777;
  background-color: #f2f2f2;
  padding: 2px 5px;
  border-radius: 3px;
  overflow: hidden;
`;
