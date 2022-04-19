import { AppNavParams } from '@euler/app/Routes';
import { wrapNavigatorScreen } from '@euler/functions';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Image,
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
interface Props {
  sitePath: string;
}
export const PreInspectionFailurePreviewScreen = wrapNavigatorScreen(
  (props: Props) => {
    const { height } = useWindowDimensions();
    const navigation = useNavigation<StackNavigationProp<AppNavParams>>();
    return (
      <SafeAreaView
        css={`
          flex: 1;
        `}
      >
        <View
          css={`
            height: 60px;
            background: black;
            align-items: flex-start;
            justify-content: center;
          `}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            css={`
              margin-left: 20px;
              width: 32px;
              height: 32px;
            `}
          >
            <AntDesign name="leftcircleo" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <ScrollView
          css={`
            flex: 1;
          `}
        >
          <Image
            source={{ uri: props.sitePath }}
            css={`
              height: ${height * 0.85}px;
            `}
          ></Image>
        </ScrollView>
      </SafeAreaView>
    );
  },
  {
    headerShown: false,
    cardStyle: {
      backgroundColor: '#000',
    },
  },
);
