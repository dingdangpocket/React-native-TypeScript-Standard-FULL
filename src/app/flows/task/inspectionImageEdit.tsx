import FailureTag from '@euler/app/flows/task/components/FailureTag';
import PreinspectionFailureAddButton from '@euler/app/flows/task/components/PreinspectionFailureAddButton';
import { AppNavParams } from '@euler/app/Routes';
import { wrapNavigatorScreen } from '@euler/functions';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import {
  StackNavigationOptions,
  StackNavigationProp,
} from '@react-navigation/stack';
import { useRef, useState } from 'react';
import {
  Image,
  SafeAreaView,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import ViewShot from 'react-native-view-shot';

const addIcon = () => {
  return <Ionicons name="add-circle-outline" size={26} color="orange" />;
};
interface Props {
  buttonArray: string[];
  backTo: string;
  res: string;
  itemId?: string;
}

export const InspectionImageEditScreen = wrapNavigatorScreen(
  (props: Props) => {
    const { height } = useWindowDimensions();
    const navigation = useNavigation<StackNavigationProp<AppNavParams & any>>();
    const screenShot: any = useRef();
    const onEdited = () => {
      void (async () => {
        const uri = await screenShot.current.capture();
        navigation.navigate(props.backTo, {
          res: uri,
          itemId: props.itemId,
          //此ID用于判断相机图片最后放入对应的Card位置;
        });
      })();
    };

    const [failureLableArr, setFailureLableArr] = useState<any>([]);
    const onAddTag = (tag: string) => {
      setFailureLableArr([...failureLableArr, { id: Date.now(), tag: tag }]);
    };
    const onDeleteTag = (id: number) => {
      const deletedArr = failureLableArr.map((item: any) => {
        if (item.id == id) {
          item = '';
        }
        return item;
      });
      setFailureLableArr([...deletedArr]);
    };
    const onReTakePicture = () => {
      setFailureLableArr([]);
      navigation.navigate('InspectionCamera', {});
    };

    return (
      <SafeAreaView
        css={`
          flex: 1;
        `}
      >
        <ViewShot ref={screenShot} options={{ format: 'jpg', quality: 0.9 }}>
          <View
            css={`
              background: black;
            `}
          >
            <Image
              source={{ uri: props.res }}
              css={`
                height: ${height * 0.78}px;
              `}
            ></Image>
            {failureLableArr.map((item: any) => {
              return (
                <>
                  <FailureTag item={item} onPress={onDeleteTag} />
                </>
              );
            })}
          </View>
        </ViewShot>

        <View
          css={`
            height: 60px;
            opacity: 0.9;
          `}
        >
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {props.buttonArray.map((item: string) => {
              return (
                <PreinspectionFailureAddButton
                  key={item}
                  icon={addIcon}
                  tag={item}
                  onPress={onAddTag}
                />
              );
            })}
          </ScrollView>
        </View>
        <View
          css={`
            height: 60px;
            background: black;
            align-items: center;
            justify-content: space-between;
            flex-direction: row;
          `}
        >
          <TouchableOpacity
            onPress={() => onReTakePicture()}
            css={`
              margin-left: 20px;
            `}
          >
            <Ionicons
              name="md-camera-reverse-outline"
              size={35}
              color="white"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onEdited()}
            css={`
              margin-left: 20px;
            `}
          >
            <AntDesign
              name="checkcircleo"
              size={30}
              color="white"
              css={`
                margin-right: 10px;
              `}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  },
  {
    headerShown: false,
    presentation: 'transparentModal',
    cardOverlayEnabled: false,
    cardStyle: {
      backgroundColor: '#000',
    },
  } as StackNavigationOptions,
);
