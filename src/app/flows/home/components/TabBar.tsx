import { useHomeTabBarLayout } from '@euler/app/flows/home/functions/useHomeTabBarLayout';
import { useOrderContext } from '@euler/app/flows/order/functions/OrderContext';
import { AppNavParams } from '@euler/app/Routes';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { FC, memo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { TabBarButton } from './TabBarButton';
import { TabBarItem } from './TabBarItem';

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#343336',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.45,
    shadowRadius: 15,
    elevation: 5,
  },
});

export const TabBar: FC<
  BottomTabBarProps & {
    onOrderSuccess?: (orderNo: string) => void;
  }
> = memo(({ navigation, state, onOrderSuccess }) => {
  const nav = navigation as unknown as StackNavigationProp<AppNavParams>;
  const orderContext = useOrderContext();
  const layout = useHomeTabBarLayout();
  const activeTabName = state.routes[state.index].name;

  const onDashboardPress = useCallback(() => {
    navigation.navigate('Dashboard');
  }, [navigation]);

  const onHistoryPress = useCallback(() => {
    navigation.navigate('History');
  }, [navigation]);

  const onCenterButtonPress = useCallback(() => {
    nav.navigate('Order', {
      onSuccess: orderNo => {
        orderContext.orderCreationSuccessful.next(orderNo);
        onOrderSuccess?.(orderNo);
      },
    });
  }, [nav, onOrderSuccess, orderContext.orderCreationSuccessful]);

  return (
    <View
      css={`
        position: absolute;
        height: ${layout.height}px;
        bottom: ${layout.bottom}px;
        left: ${layout.left}px;
        right: ${layout.right}px;
        background-color: #4094cc;
        border-radius: 15px;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
      `}
      style={styles.shadow}
    >
      <LinearGradient
        colors={['#f9fbfc', '#c4c5c7']}
        style={StyleSheet.absoluteFill}
        css={`
          border-radius: 15px;
        `}
      ></LinearGradient>
      <TabBarItem
        name="Dashboard"
        activeTabName={activeTabName}
        text="门店看板"
        icon={(size, color) => <Entypo name="home" size={size} color={color} />}
        onPress={onDashboardPress}
      />
      <TabBarButton onPress={onCenterButtonPress} />
      <TabBarItem
        name="History"
        activeTabName={activeTabName}
        text="历史看板"
        icon={(size, color) => (
          <FontAwesome name="history" size={size} color={color} />
        )}
        onPress={onHistoryPress}
      />
    </View>
  );
});
