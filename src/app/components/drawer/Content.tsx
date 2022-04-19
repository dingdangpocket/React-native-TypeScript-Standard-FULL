/* eslint-disable @typescript-eslint/no-use-before-define */
import { useAuthenticatedUser, useLogout } from '@euler/app/flows/auth/hooks';
import { Avatar, versionText } from '@euler/components';
import { FontFamily } from '@euler/components/typography';
import { onErrorIgnore } from '@euler/utils';
import {
  AntDesign,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
  SimpleLineIcons,
} from '@expo/vector-icons';
import {
  DrawerContentComponentProps,
  DrawerItem,
} from '@react-navigation/drawer';
import { nativeApplicationVersion } from 'expo-application';
import { FC, memo, ReactNode, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const kAvatarSize = 60;
const kAvatarBorder = 5;
const kIconInactiveColor = 'rgba(255, 255, 255, 0.5)';
const kIconActiveColor = 'white';

type DrawItemInfo = {
  name: string;
  label: string;
  icon: (props: { focused: boolean; size: number }) => ReactNode;
};

const DrawItems: DrawItemInfo[] = [
  {
    name: 'Home',
    label: '门店看板',
    icon: ({ focused, size }) =>
      focused ? (
        <MaterialIcons name="home" size={size} color={kIconActiveColor} />
      ) : (
        <SimpleLineIcons name="home" size={size} color={kIconInactiveColor} />
      ),
  },
  {
    name: 'Profile',
    label: '我的',
    icon: ({ focused, size }) =>
      focused ? (
        <FontAwesome5 name="user-alt" size={size} color={kIconActiveColor} />
      ) : (
        <FontAwesome5 name="user" size={size} color={kIconInactiveColor} />
      ),
  },
  {
    name: 'Settings',
    label: '设置',
    icon: ({ focused, size }) =>
      focused ? (
        <Ionicons name="settings" size={size} color={kIconActiveColor} />
      ) : (
        <Ionicons
          name="settings-outline"
          size={size}
          color={kIconInactiveColor}
        />
      ),
  },
  {
    name: 'Help',
    label: '帮助',
    icon: ({ focused, size }) =>
      focused ? (
        <Ionicons name="help-circle" size={size} color={kIconActiveColor} />
      ) : (
        <Ionicons
          name="help-circle-outline"
          size={size}
          color={kIconInactiveColor}
        />
      ),
  },
];

if (__DEV__) {
  DrawItems.push({
    name: 'Playground',
    label: 'Playground',
    icon: ({ size }) => (
      <MaterialIcons name="toys" size={size} color={kIconInactiveColor} />
    ),
  });
}

export const AppDrawerContent: FC<DrawerContentComponentProps> = memo(props => {
  const { navigation, state } = props;

  const route = state.routes[state.index];
  const activeRouteName =
    route.state?.routes[route.state?.index ?? 0]?.name ?? 'Home';

  const logout = useLogout();

  const onLogout = useCallback(() => {
    navigation.closeDrawer();
    setTimeout(() => {
      logout().catch(onErrorIgnore);
    }, 500);
  }, [logout, navigation]);

  return (
    <View
      css={`
        flex: 1;
      `}
    >
      <CloseButton navigation={navigation} />
      <UserInfoView />
      <View
        css={`
          flex: 1;
        `}
      >
        {DrawItems.map(({ name, label, icon }) => (
          <AppDrawerItem
            key={name}
            name={name}
            label={label}
            navigation={navigation}
            activeRouteName={activeRouteName}
            icon={icon}
          />
        ))}
        <LogoutButton onPress={onLogout} />
      </View>
      <VersionInfo />
    </View>
  );
});

const AppDrawerItem: FC<{
  name: string;
  label: string;
  navigation: DrawerContentComponentProps['navigation'];
  activeRouteName: string;
  icon?: (props: { focused: boolean; size: number }) => ReactNode;
}> = memo(({ name, label, icon, navigation, activeRouteName }) => {
  const onPress = useCallback(() => {
    navigation.navigate(name);
  }, [navigation, name]);
  const active = activeRouteName === name;
  return (
    <DrawerItem
      label={label}
      labelStyle={
        active
          ? [styles.drawerLabel, styles.drawLabelActive]
          : styles.drawerLabel
      }
      style={styles.drawerItem}
      icon={props => icon?.({ focused: active, size: props.size })}
      onPress={onPress}
    />
  );
});

const LogoutButton: FC<{ onPress?: () => void }> = memo(({ onPress }) => {
  return (
    <View
      css={`
        align-self: flex-start;
        padding: 16px;
        margin-top: 44px;
      `}
    >
      <TouchableOpacity
        css={`
          border-width: 1px;
          border-color: rgba(255, 255, 255, 0.75);
          align-items: center;
          justify-content: center;
          height: 28px;
          border-radius: 14px;
          padding-left: 12px;
          padding-right: 12px;
        `}
        onPress={onPress}
      >
        <Text
          css={`
            font-family: ${FontFamily.NotoSans.Light};
            font-size: 12px;
            color: rgba(255, 255, 255, 0.85);
          `}
        >
          退出登录
        </Text>
      </TouchableOpacity>
    </View>
  );
});

const UserInfoView = memo(() => {
  const { user } = useAuthenticatedUser();
  return (
    <View
      css={`
        width: ${kAvatarSize + 2 * kAvatarBorder}px;
        height: ${kAvatarSize + 2 * kAvatarBorder}px;
        border-radius: ${(kAvatarSize + 2 * kAvatarBorder) / 2}px;
        background-color: rgba(255, 255, 255, 0.2);
        align-items: center;
        justify-content: center;
        margin: 32px 16px;
      `}
    >
      <Avatar
        uri={user.avatar}
        name={user.name ?? user.nick ?? user.userName}
        textStyle={{
          fontSize: 30,
        }}
        css={`
          width: ${kAvatarSize}px;
          height: ${kAvatarSize}px;
          border-radius: ${kAvatarSize / 2}px;
        `}
      />
    </View>
  );
});

const CloseButton: FC<{
  navigation: DrawerContentComponentProps['navigation'];
}> = memo(({ navigation }) => {
  const onClose = useCallback(() => {
    navigation.closeDrawer();
  }, [navigation]);
  return (
    <TouchableOpacity
      onPress={onClose}
      css={`
        margin: 15px 16px 5px 16px;
      `}
    >
      <AntDesign name="close" size={24} color="white" />
    </TouchableOpacity>
  );
});

const VersionInfo = memo(() => {
  const insets = useSafeAreaInsets();
  return (
    <View
      css={`
        margin-bottom: ${insets.bottom + 16}px;
        margin-left: 16px;
      `}
    >
      <Text
        css={`
          font-family: ${FontFamily.NotoSans.Light};
          font-size: 10px;
          color: rgba(255, 255, 255, 0.35);
          margin-bottom: 4px;
        `}
      >
        Powed by zhichetech.com, © 2019-2022.
      </Text>
      <Text
        css={`
          font-family: ${FontFamily.NotoSans.Light};
          font-size: 10px;
          color: rgba(255, 255, 255, 0.35);
        `}
      >
        {nativeApplicationVersion} ({versionText(8)})
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  drawerItem: {
    marginHorizontal: 16,
    paddingHorizontal: 0,
  },
  drawerLabel: {
    color: '#fff',
    marginLeft: -16,
    opacity: 0.5,
    fontFamily: FontFamily.NotoSans.Light,
    fontSize: 18,
    fontWeight: 'normal',
  },
  drawLabelActive: {
    opacity: 1,
  },
});
