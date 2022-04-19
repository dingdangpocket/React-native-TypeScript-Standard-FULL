import { useAuthenticatedUser } from '@euler/app/flows/auth/hooks';
import { Avatar } from '@euler/components';
import { FontFamily } from '@euler/components/typography';
import { OrgUserRoleType } from '@euler/model/enum';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { memo, useCallback } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export const Header = memo(() => {
  const { user, store } = useAuthenticatedUser();
  const name = user.name ?? user.nick ?? user.userName ?? '用户';
  const navigation = useNavigation();

  const onAvatarClick = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  return (
    <View
      css={`
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0 15px;
        height: 44px;
      `}
    >
      <View
        css={`
          flex-direction: row;
          justify-content: flex-start;
          align-items: center;
          flex-grow: 0;
        `}
      >
        <TouchableOpacity
          css={`
            width: 30px;
            height: 30px;
            border-radius: 15px;
          `}
          onPress={onAvatarClick}
        >
          <Avatar
            uri={user.avatar}
            name={name}
            css={`
              width: 30px;
              height: 30px;
              border-radius: 15px;
            `}
            textStyle={{
              fontSize: 16,
            }}
          />
        </TouchableOpacity>
        <View
          css={`
            margin-left: 8px;
          `}
        >
          <Text
            css={`
              font-family: ${FontFamily.NotoSans.Regular};
              font-size: 16px;
              line-height: 18px;
            `}
          >
            {name}
          </Text>
          <Text
            css={`
              font-family: ${FontFamily.NotoSans.Thin};
              font-size: 10px;
              line-height: 12px;
              margin-top: 2px;
            `}
          >
            {user.role.includes(OrgUserRoleType.ServiceAgents)
              ? '服务顾问'
              : '服务技师'}
          </Text>
        </View>
      </View>
      <Text
        numberOfLines={1}
        css={`
          flex: 1;
          font-family: ${FontFamily.NotoSans.Thin};
          font-size: 14px;
          line-height: 16px;
          text-align: right;
        `}
      >
        {store.name}
      </Text>
    </View>
  );
});
